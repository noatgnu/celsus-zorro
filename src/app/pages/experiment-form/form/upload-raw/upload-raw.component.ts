import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebService} from "../../../../services/web.service";
import {FormBuilder, Validators} from "@angular/forms";
import {DataService} from "../../../../services/data.service";
import {Subject, tap} from "rxjs";

@Component({
  selector: 'app-upload-raw',
  templateUrl: './upload-raw.component.html',
  styleUrls: ['./upload-raw.component.less']
})
export class UploadRawComponent implements OnInit {
  @Output() complete: EventEmitter<boolean> = new EventEmitter<boolean>()
  _externalTrigger: Subject<boolean>|undefined
  @Input() set externalTrigger(value: Subject<boolean>) {
    this._externalTrigger = value
    this._externalTrigger.asObservable().subscribe(data => {
      if (data) {
        this.submitData()
      }
    })
  }

  @Input() projectData: any

  loading = false
  fileId: number = 0
  columns: string[] = []
  form = this.fb.group({
    "primaryId": [null, Validators.required],
    "samples": [[], Validators.required],
    "accessionId": [null,]
  })
  constructor(private web: WebService, private fb: FormBuilder, private data: DataService) { }

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

  submitData() {
    if (!this.loading) {
      if (this.form.valid) {
        if (this.projectData.id !== undefined) {
          this.web.submitRawColumns(this.fileId, this.form.value, this.projectData.id).pipe(tap(_ => this.loading = true)).subscribe(data => {
            this.loading = false
            this.complete.emit(true)
          })
        } else {
          this.web.submitRawColumns(this.fileId, this.form.value, this.data.submittedProject.id).pipe(tap(_ => this.loading = true)).subscribe(data => {
            this.loading = false
            this.complete.emit(true)
          })
        }
      }
    }

  }
}
