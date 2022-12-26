import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebService} from "../../../../services/web.service";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";
import {NzMessageService} from "ng-zorro-antd/message";
import {DataService} from "../../../../services/data.service";


@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.less'],
  providers: [NzMessageService]
})
export class UploadDataComponent implements OnInit {
  get fileType(): string {
    return this._fileType;
  }

  private _fileType: string = "DA"
  @Input() set fileType(value: string) {
    this.web.currentFileType = value
    this._fileType = value;
  }
  @Output() fileData: EventEmitter<any> = new EventEmitter<any>()
  constructor(public web: WebService, private msg: NzMessageService, private data: DataService) { }

  ngOnInit(): void {
  }
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
      if ("id" in this.data.submittedProject) {
        this.web.setFileToProject(this.data.submittedProject.id, this.web.uploadedContent[info.file.name].id)
      }
      this.fileData.emit(this.web.uploadedContent[info.file.name])

    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }
}
