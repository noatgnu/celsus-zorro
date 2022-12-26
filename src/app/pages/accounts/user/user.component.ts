import { Component, OnInit } from '@angular/core';
import {AccountsService} from "../accounts.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  projects: any = {count: 0, results: []}
  loading: boolean = false
  pageIndex = 1
  filterProject = [
    {text: "Total Proteomics", value: "TP"},
    {text: "Post-Translational Modification", value: "PTM"}
  ]
  term:string = ""
  constructor(public accounts: AccountsService) {

  }

  ngOnInit(): void {
  }

  onQueryParamsChange(params: NzTableQueryParams){
    const { pageSize, pageIndex, sort, filter } = params
    const currentSort = sort.find(item => item.value !== null)
    const sortField = (currentSort&&currentSort.key) || null
    const sortOrder = (currentSort&&currentSort.value) || null
    this.loadProjects(pageIndex, sortField,sortOrder,filter)
  }

  loadProjects(pageIndex: number, sortField: string|null, sortOrder: string|null, filter: Array<{key: string; value: string[]}>) {
    this.loading = true
    this.accounts.getProjects(this.term, 20, pageIndex-1, filter, sortField, sortOrder).subscribe((data:any) => {
      this.loading = false
      this.projects = data
      this.projects.results = this.projects.results.map((a:any) => {
        a.date = new Date(a.date)
        return a
      })
    })
  }
}
