import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-upload-other',
  templateUrl: './upload-other.component.html',
  styleUrls: ['./upload-other.component.less']
})
export class UploadOtherComponent implements OnInit {
  loading = false
  @Output() complete: EventEmitter<boolean> = new EventEmitter<boolean>()
  fileIds: any[] = []
  _externalTrigger: Subject<boolean>|undefined
  @Input() set externalTrigger(value: Subject<boolean>) {
    this._externalTrigger = value
    this._externalTrigger.asObservable().subscribe(data => {
      if (data) {
      }
    })
  }

  @Input() projectData: any

  constructor() {
  }

  ngOnInit(): void {
  }
  handleResponse(e: any) {
    this.fileIds.push(e.id)
  }

  done() {
    window.location.href = "/#/project-explorer/details/" + this.projectData.id
  }
}
