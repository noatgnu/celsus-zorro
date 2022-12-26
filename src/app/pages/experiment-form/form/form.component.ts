import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class FormComponent implements OnInit {
  currentStep = 0
  projectData: any = {}
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  progress(result: boolean) {
    if (result){
      this.currentStep++
    }
  }

  handleProjectData(e: any) {
    this.projectData = e
  }
}
