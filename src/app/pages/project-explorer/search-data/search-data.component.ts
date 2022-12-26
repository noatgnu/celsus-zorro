import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebService} from "../../../services/web.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.less']
})
export class SearchDataComponent implements OnInit {
  data: any = {results:[]}
  query: string = ""

  form = this.fb.group({
    ptmData: [null,],
    significantCutoff: [0, ],
    fcCutoff: [0,]
  })

  constructor(private route: ActivatedRoute, private web: WebService, private fb: FormBuilder) {
    this.route.params.subscribe(data => {
      if (data["query"]) {
        this.query = data["query"]
        this.web.getDifferentialAnalysisFromGeneNames(data["query"], 0, 20,false,"",this.form.value["ptmData"], true).subscribe(data => {
          this.data = data
        })
      }
    })
  }

  ngOnInit(): void {
  }

  changePage(e: any) {
    this.web.getDifferentialAnalysisFromGeneNames(this.query, e-1,20,false,"",this.form.value["ptmData"], true, this.form.value["significantCutoff"], this.form.value["fcCutoff"]).subscribe(data => {
      this.data = data
    })
  }

  refreshSearch(){
    this.web.getDifferentialAnalysisFromGeneNames(this.query, 0, 20,false,"",this.form.value["ptmData"], true, this.form.value["significantCutoff"], this.form.value["fcCutoff"]).subscribe(data => {
      this.data = data
    })
  }
}
