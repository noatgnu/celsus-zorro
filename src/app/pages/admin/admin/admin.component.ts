import { Component, OnInit } from '@angular/core';
import {WebService} from "../../../services/web.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

  constructor(private web: WebService) { }

  ngOnInit(): void {
  }

  refreshGeneMap() {
    this.web.refreshUniprot().subscribe()
  }
}
