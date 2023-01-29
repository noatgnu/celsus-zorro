import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebService} from "../../../../services/web.service";
import {FormBuilder, Validators} from "@angular/forms";
import {forkJoin, map, Observable, Subject, switchMap, tap} from "rxjs";
import {DataService} from "../../../../services/data.service";

@Component({
  selector: 'app-upload-differential-analysis',
  templateUrl: './upload-differential-analysis.component.html',
  styleUrls: ['./upload-differential-analysis.component.less']
})
export class UploadDifferentialAnalysisComponent implements OnInit {
  columns: string[] = []
  loading = false
  @Output() complete: EventEmitter<boolean> = new EventEmitter<boolean>()
  _externalTrigger: Subject<boolean>|undefined
  @Input() set externalTrigger(value: Subject<boolean>) {
    this._externalTrigger = value
    this._externalTrigger.asObservable().subscribe(data => {
      if (data) {
        this.submitColumnData({})
      }
    })
  }

  @Input() projectData: any

  fileId: number = 0
  form = this.fb.group({
    "primaryId": [null, Validators.required],
    "foldChange": [[], Validators.required],
    "significant": [[], Validators.required],
    "probabilityScore": [null,],
    "sequenceWindow": [null,],
    "ptmPosition": [null,],
    "ptmPositionInPeptide": [null,],
    "accessionId": [null,],
    "peptideSequence": [null,],
  })

  comparisons: any = {}
  checkTimeout: NodeJS.Timeout|undefined
  constructor(private web: WebService, private fb: FormBuilder, private data: DataService) {
    this.form.controls["foldChange"].valueChanges.subscribe(data => {
      data.forEach((d:any) => {
        if (!(d in this.comparisons)) {
          this.comparisons[d] = {significant: "", comparison: ""}
        }
      })
    })

  }

  ngOnInit(): void {
  }

  handleResponse(e: any) {
    this.fileId = e.id
    this.web.getFileColumns(e.id).subscribe(data => {
      if("columns" in data) {
        // @ts-ignore
        this.columns = data["columns"]
      }
    })
  }

  submitColumnData(e: any) {
    if (this.form.valid) {
      const comparisonRequest: Observable<any>[] = []
      for (const c of this.form.value["foldChange"]) {
        comparisonRequest.push(this.web.createComparison({name: this.comparisons[c].comparison}))
      }
      forkJoin(comparisonRequest).subscribe(data => {
        for (const i of this.form.value["foldChange"]) {
          for (const d of data) {
            if (d["name"] === this.comparisons[i].comparison) {
              this.comparisons[i].data = d
              delete this.comparisons[i].data["file"]
              if ("url" in this.comparisons[i].data) {
                this.comparisons[i].data["id"] = this.comparisons[i].data["url"].replace(this.web.host + "/comparisons/", "").replace("/", "")
              }
            }
          }
        }
        if (this.projectData.id !== undefined) {
          this.web.submitDAColumns(this.fileId, this.form.value, this.comparisons, this.projectData.id).pipe(tap(_ => this.loading = true)).subscribe((data:any) => {

            this.checkTimeout = setInterval(()=> {
              this.web.checkJob(data["job_id"]).subscribe((job_status:any) => {
                switch (job_status.status) {
                  case "completed":
                    this.complete.emit(true)
                    this.loading = false
                    clearInterval(this.checkTimeout)
                    break
                  case "failed":
                    console.log(`${data["job_id"]} failed`)
                    break
                  case "progressing":
                    console.log(`${data["job_id"]} in progress`)
                    break
                }
                if (job_status) {
                  job_status.status
                }
              }, error => {
                console.log(error)
              })
            }, 10000)

            //this.complete.emit(true)
          })
        } else {
          this.web.submitDAColumns(this.fileId, this.form.value, this.comparisons, this.data.submittedProject.id).pipe(tap(_ => this.loading = true)).subscribe((data: any) => {
            this.checkTimeout = setInterval(()=> {
              this.web.checkJob(data["job_id"]).subscribe((job_status:any) => {
                switch (job_status.status) {
                  case "completed":
                    this.complete.emit(true)
                    this.loading = false
                    clearInterval(this.checkTimeout)
                    break
                  case "failed":
                    console.log(`${data["job_id"]} failed`)
                    break
                  case "progressing":
                    console.log(`${data["job_id"]} in progress`)
                    break
                }
                if (job_status) {
                  job_status.status
                }
              }, error => {
                console.log(error)
              })
            }, 10000)
            //this.complete.emit(true)
          })
        }

      })
      /*this.web.submitDAColumns(this.fileId, this.form.value, this.comparisons).subscribe(data => {
        console.log(data)
      })*/
    }
  }

  pairSignificant(e: any, p: string) {
    this.comparisons[p].significant = e
    console.log(e)
  }

  setComparisonName(e: any, p: string) {
    this.comparisons[p].comparison = e
    console.log(this.comparisons)
  }

  ngOnDestroy() {
    if (this.checkTimeout) {
      clearInterval(this.checkTimeout)
    }
  }
}
