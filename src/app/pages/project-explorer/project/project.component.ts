import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebService} from "../../../services/web.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less']
})
export class ProjectComponent implements OnInit {
  projectData: any = {count:0, results: []}
  subtitle = ""

  form = this.fb.group({
    term: ["",],
    title: [true,],
    description: [true,],
    keyword: [true,],
    associated_authors: [false,],
    quantification_method: [false,],
    organism: [false,],
    accession_id: [false,],
    gene_names: [false,],
    lab_group: [false,]
  })

  constructor(private route: ActivatedRoute, private web: WebService, private fb: FormBuilder) {
    this.web.getProjects().subscribe(data => {
      this.projectData = data
      this.subtitle = `${this.projectData.count} projects are available`
    })
  }

  ngOnInit(): void {
  }

  changePage(e: any) {
    this.web.getProjects(this.form.value["term"], 20, e, this.form.value).subscribe(data => {
      this.projectData = data
      this.subtitle = `${this.projectData.count} projects are available`
    })
  }

  submitSearch(e: any) {
    this.web.getProjects(this.form.value["term"],20, 0, this.form.value).subscribe(data => {
      this.projectData = data
      this.subtitle = `${this.projectData.count} projects are available`
    })
  }

  searchProject() {

  }
}
