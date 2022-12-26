import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {AccountRoutingModule} from "./account-routing.module";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ReactiveFormsModule} from "@angular/forms";
import { UserComponent } from './user/user.component';
import {NzTableModule} from "ng-zorro-antd/table";



@NgModule({
  declarations: [
    LoginComponent,
    UserComponent
  ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        NzFormModule,
        NzInputModule,
        NzTypographyModule,
        NzButtonModule,
        ReactiveFormsModule,
        NzTableModule
    ]
})
export class AccountsModule { }
