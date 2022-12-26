import {Component, Input, OnInit} from '@angular/core';
import {WebService} from "../../../../services/web.service";

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.less']
})
export class ProjectDescriptionComponent implements OnInit {
  private _data: any = {}

  daFile: any = {}
  rawFile: any = {}
  authors: string[] = []
  sampleTooltip: string = ""
  resultCount: number = 0
  labGroups: string[] = []
  @Input() set data(value: any) {
    this._data = value
    if (this._data["associated_authors"]) {
      this.authors = this._data["associated_authors"].map((a: any) => {
        return a.name
      })
      this.labGroups = this._data["lab_group"].map((a:any) => {
        return a.name
      })
      console.log(this.authors)
    }
    if (this._data["files"]) {
      for (const f of this._data["files"]) {
        if (f.file_type === "DA") {
          this.daFile = f
        } else if (f.file_type === "R") {
          this.rawFile = f
          this.sampleTooltip = this.rawFile.raw_sample_columns.map((a: any) => {
            return a.name
          }).join(",")

        }
      }
    }
    this.getProjectData()
  }

  get data(): any {
    return this._data
  }
  constructor(private web: WebService) { }

  ngOnInit(): void {
  }

  getProjectData() {
    this.web.getRawDataFromGeneNames("",0,20,false,[this.rawFile.id]).subscribe((data: any) => {
      this.resultCount = data.count/this.rawFile.raw_sample_columns.length
      console.log(this.resultCount)
    })
  }
}
