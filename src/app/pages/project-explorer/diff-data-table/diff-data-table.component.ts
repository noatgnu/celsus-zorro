import {Component, Input, OnInit} from '@angular/core';
import {WebService} from "../../../services/web.service";
import {NzMNComponent} from "ng-zorro-antd/message";
import {NzTableQueryParams} from "ng-zorro-antd/table";

@Component({
  selector: 'app-diff-data-table',
  templateUrl: './diff-data-table.component.html',
  styleUrls: ['./diff-data-table.component.less']
})
export class DiffDataTableComponent implements OnInit {
  private _filterId: Array<{ key: string; value: string[] }> = []
  private _totalCount: number = 0
  loading = true
  private _data: any[] = []

  @Input() set data(value: any) {
    this._data = value
  }

  @Input() set filterId(value: Array<{ key: string; value: string[] }>) {
    this._filterId = value
  }

  private _baseURL = ""

  @Input() set baseURL(value: string) {
    this._baseURL = value
  }

  get baseURL(): string {
    return this._baseURL
  }
  @Input() set totalCount(value: number) {
    this._totalCount = value
    this.pageNumber = Math.ceil(this.totalCount/this.rowPerPage)
  }

  get totalCount(): number {
    return this._totalCount
  }

  get filterId(): Array<{ key: string; value: string[] }> {
    return this._filterId
  }

  get data(): any[] {
    return this._data
  }

  rowPerPage: number = 20
  pageNumber: number = 1

  constructor(private web: WebService) { }

  ngOnInit(): void {
    this.loadDataFromServer(this.pageNumber, this.rowPerPage, null, null, this.filterId);
  }

  loadDataFromServer(pageIndex: number, pageSize: number, sortField: string|null, sortOrder: string|null, filter: Array<{ key: string; value: string[] }>): void {

    this.web.getData(this.baseURL, pageIndex, 20, sortField, sortOrder, filter).subscribe((data: any) => {
      this.loading = false
      this.totalCount = data["count"]
      this.data = data["results"]
    })
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    filter.concat(this.filterId)
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, this.filterId);
  }
}
