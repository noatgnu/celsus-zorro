import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebService} from "../../../../services/web.service";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";
import {NzMessageService} from "ng-zorro-antd/message";
import {DataService} from "../../../../services/data.service";

@Component({
  selector: 'app-upload-data-multiple',
  templateUrl: './upload-data-multiple.component.html',
  styleUrls: ['./upload-data-multiple.component.less'],
  providers: [NzMessageService]
})

export class UploadDataMultipleComponent implements OnInit {
  get fileType(): string {
    return this._fileType;
  }

  private _fileType: string = "O"
  @Input() set fileType(value: string) {
    this.web.currentFileType = value
    this._fileType = value;
  }
  _projectID: number|undefined
  @Input() set projectID(value: number|undefined) {
    console.log(value)
    this._projectID = value
  }

  get projectID():any {
    return this._projectID
  }

  @Output() fileData: EventEmitter<any> = new EventEmitter<any>()
  constructor(public web: WebService, private msg: NzMessageService, private data: DataService) {
    console.log(this.projectID)
  }

  ngOnInit(): void {
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      if (info.file.status === "removed") {
        this.web.deleteFile(this.web.uploadedContent[info.file.name].id).subscribe(data => {
          if (data.status === 204) {
            this.msg.success(`${info.file.name} file deleted successfully`);
          }
        })
      }
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
      console.log(this._projectID)
      if (this.projectID !== undefined) {
        this.web.setFileToProject(this.projectID, this.web.uploadedContent[info.file.name].id).subscribe()
      } else {
        if ("id" in this.data.submittedProject) {
          this.web.setFileToProject(this.data.submittedProject.id, this.web.uploadedContent[info.file.name].id).subscribe()
        }
      }

      this.fileData.emit(this.web.uploadedContent[info.file.name])

    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }
}



