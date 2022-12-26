import {Component, Input, OnInit} from '@angular/core';
import {WebService} from "../../../../../services/web.service";

@Component({
  selector: 'app-details-data-table',
  templateUrl: './details-data-table.component.html',
  styleUrls: ['./details-data-table.component.less']
})
export class DetailsDataTableComponent implements OnInit {
  private _data: string[] = []
  @Input() set data(value: string[]|null) {
    if (value) {
      this._data = value
      console.log(value)
      if (this._data.length > 0) {
        this.web.getDifferentialAnalysisData([], 20, value).subscribe(data => {
          this.selectedData = data
          console.log(data)
          console.log(this.selectedData)
        })
      }
    }
  }

  get data(): string[] {
    return this._data
  }

  selectedData: any = {results: []}
  constructor(private web: WebService) {

  }

  ngOnInit(): void {
  }
  changePage(e: any) {
    this.web.getDifferentialAnalysisData([], 20, this.data, e).subscribe(data => {
      this.selectedData = data
    })
  }
}
