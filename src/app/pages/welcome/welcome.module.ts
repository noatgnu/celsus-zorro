import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzGridModule} from "ng-zorro-antd/grid";
import { PieChartComponent } from './pie-chart/pie-chart.component';
import {CommonModule} from "@angular/common";
import { BarChartComponent } from './bar-chart/bar-chart.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";


@NgModule({
  imports: [WelcomeRoutingModule, NzPageHeaderModule, NzLayoutModule, NzCardModule, NzGridModule, CommonModule, ReactiveFormsModule, NzFormModule, NzSelectModule],
  declarations: [WelcomeComponent, PieChartComponent, BarChartComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
