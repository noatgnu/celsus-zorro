import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ExperimentFormRoutingModule} from "./experiment-form-routing.module";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import { BasicExperimentInfoComponent } from './form/basic-experiment-info/basic-experiment-info.component';
import {NzInputModule} from "ng-zorro-antd/input";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {HttpClientModule} from "@angular/common/http";
import {NzListModule} from "ng-zorro-antd/list";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzTableModule} from "ng-zorro-antd/table";
import { UploadDataComponent } from './form/upload-data/upload-data.component';
import { UploadDifferentialAnalysisComponent } from './form/upload-differential-analysis/upload-differential-analysis.component';
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzSelectModule} from "ng-zorro-antd/select";
import { UploadRawComponent } from './form/upload-raw/upload-raw.component';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { UploadOtherComponent } from './form/upload-other/upload-other.component';
import { UploadDataMultipleComponent } from './form/upload-data-multiple/upload-data-multiple.component';
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@NgModule({
  declarations: [
    FormComponent,
    BasicExperimentInfoComponent,
    UploadDataComponent,
    UploadDifferentialAnalysisComponent,
    UploadRawComponent,
    UploadOtherComponent,
    UploadDataMultipleComponent,
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ExperimentFormRoutingModule,
        NzLayoutModule,
        NzFormModule,
        NzButtonModule,
        NzGridModule,
        NzStepsModule,
        NzTypographyModule,
        NzInputModule,
        NzAutocompleteModule,
        NzListModule,
        HttpClientModule,
        NzIconModule,
        NzTableModule,
        NzUploadModule,
        NzSelectModule,
        CKEditorModule,
        NzCheckboxModule
    ],
    exports: [
        FormComponent,
        UploadDataComponent,
        UploadDifferentialAnalysisComponent,
        UploadRawComponent,
        UploadOtherComponent
    ]
})
export class ExperimentFormModule { }
