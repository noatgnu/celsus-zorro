import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebService} from "../../../services/web.service";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-protein-viewer',
  templateUrl: './protein-viewer.component.html',
  styleUrls: ['./protein-viewer.component.less']
})
export class ProteinViewerComponent implements OnInit {
  volcanoSettings: FormGroup = this.fb.group({
    pCutoff: [1.5, Validators.required],
    fcCutoff: [0.5, Validators.required],
    minX: [null, ],
    maxX: [null, ],
    minY: [null, ],
    maxY: [null, ]
  })

  query: any = {}
  data: any = {}
  uniprot: any|undefined
  comparison: any = {}
  project: any = {}
  rawData: any = {}
  daFile: any
  rawFile: any
  title: string = ""
  daFCSorted: any[] = []
  daSignificantSorted: any[] = []
  constructor(private route: ActivatedRoute, private web: WebService, private fb: FormBuilder) {
    this.route.params.subscribe(data => {
      this.query = data
      this.title = decodeURI(this.query["gene_names"])
      this.web.getDifferentialAnalysisFromGeneNames(this.title,0,99999999,true, "", data["ptm_data"], true).subscribe((res:any) => {
        const id = parseInt(this.query["primary_key"])
        let pid: string = ""
        res.results = res.results.map((a:any) => {
          if (a.id === id) {
            a.selected = true
            pid = a["primary_id"]
            let uni = a.gene_names.accession_id

            if (a.gene_names.entry !== "") {
              uni = a.gene_names.entry
              if (a.gene_names.primary_uniprot_record) {
                this.web.getUniprotRecord(a.gene_names.primary_uniprot_record).subscribe((uniData: any) => {

                  this.uniprot = uniData.record
                  console.log(this.uniprot)
                })
              }
            }
            /*this.web.getUniprotSingle(uni).subscribe((uniData) => {
              this.uniprot = uniData
            })*/
          }
          return a
        })
        const fcSorted = res.results.slice()
        fcSorted.sort((a:any,b:any) => {
            return Math.abs(b.fold_change) - Math.abs(a.fold_change)
          })

        this.daFCSorted = fcSorted.map((a: any) => {
          let fill = "#FFDBA4"
          let primary_id = `Primary Key ${a.id}`
          if (a.id === id) {
            fill = "#FFCCB3"
            primary_id = primary_id + " (Selected)"
          }
          return {id: primary_id, value: a.fold_change, data: a, columnSettings: {fill: fill}}
        })
        const sigSorted = res.results.slice()
        sigSorted.sort((a:any,b:any) => {
          return b.significant - a.significant
        })

        this.daSignificantSorted = sigSorted.map((a: any) => {
          let fill = "#FFDBA4"
          let primary_id = `Primary Key ${a.id}`
          if (a.id === id) {
            fill = "#FFCCB3"
            primary_id = primary_id + " (Selected)"
          }

          return {id: primary_id, value: a.significant, data: a, columnSettings: {fill: fill}}
        })
        if (pid !== "") {
          this.title = `${this.title} (${pid})`
        }
        this.data = res
        this.web.getComparison(this.query["comparison_id"]).subscribe((resComp:any) => {
          this.comparison = resComp

          this.web.getProjectFromFile(resComp.file).subscribe((proj: any) => {
            this.project = proj
            for (const f of this.project.files) {
              if (f.file_type === "R") {
                this.rawFile = f
                if (this.project.project_type === 'PTM') {
                  this.web.getRawDataFromGeneNames(pid,0,99999999,true, [f.id], true,true).subscribe((resRaw:any) => {
                    this.rawData = resRaw
                  })
                } else {
                  this.web.getRawDataFromGeneNames(decodeURI(this.query["gene_names"]),0,99999999,true, [f.id]).subscribe((resRaw:any) => {
                    this.rawData = resRaw
                  })
                }
              }
            }
          })
        })
      })

    })
  }

  ngOnInit(): void {
  }

  handleVolcanoSettings(e: any) {
    this.volcanoSettings = e
  }
}
