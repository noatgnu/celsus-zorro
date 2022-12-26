import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import {ProjectExplorerRoutingModule} from "./project-explorer-routing.module";
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzButtonModule} from "ng-zorro-antd/button";
import { VolcanoPlotComponent } from './volcano-plot/volcano-plot.component';
import {NzInputModule} from "ng-zorro-antd/input";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzCardModule} from "ng-zorro-antd/card";
import { DiffDataTableComponent } from './diff-data-table/diff-data-table.component';
import {NzTableModule} from "ng-zorro-antd/table";
import { SearchDataComponent } from './search-data/search-data.component';
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzListModule} from "ng-zorro-antd/list";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzIconModule} from "ng-zorro-antd/icon";
import { ProteinViewerComponent } from './protein-viewer/protein-viewer.component';
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import { BarChartComponent } from './bar-chart/bar-chart.component';
import {NzModalModule} from "ng-zorro-antd/modal";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {ExperimentFormModule} from "../experiment-form/experiment-form.module";
import { BoxplotComponent } from './boxplot/boxplot.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DetailsDataTableComponent } from './project/project-details/details-data-table/details-data-table.component';
import {NzDividerModule} from "ng-zorro-antd/divider";
import { ProjectTableComponent } from './project/project-table/project-table.component';
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import { ProjectDescriptionComponent } from './project/project-description/project-description.component';
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import { VolcanoPlotlyComponent } from './volcano-plotly/volcano-plotly.component';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { BarChartSimpleComponent } from './bar-chart-simple/bar-chart-simple.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { VolcanoPlotSettingsComponent } from './volcano-plot-settings/volcano-plot-settings.component';
import { PtmPositionVisualizationComponent } from './ptm-position-visualization/ptm-position-visualization.component';

PlotlyModule.plotlyjs = PlotlyJS;


@NgModule({
  declarations: [
    ProjectComponent,
    ProjectDetailsComponent,
    VolcanoPlotComponent,
    DiffDataTableComponent,
    SearchDataComponent,
    ProteinViewerComponent,
    BarChartComponent,
    BoxplotComponent,
    DataTableComponent,
    DetailsDataTableComponent,
    ProjectTableComponent,
    ProjectDescriptionComponent,
    VolcanoPlotlyComponent,
    BarChartSimpleComponent,
    QuickSearchComponent,
    VolcanoPlotSettingsComponent,
    PtmPositionVisualizationComponent
  ],
    imports: [
        CommonModule,
        ProjectExplorerRoutingModule,
        NzLayoutModule,
        ReactiveFormsModule,
        NzFormModule,
        NzSelectModule,
        NzButtonModule,
        NzInputModule,
        NzTypographyModule,
        NzCardModule,
        NzTableModule,
        NzPageHeaderModule,
        NzListModule,
        NzPaginationModule,
        NzIconModule,
        NzDescriptionsModule,
        NzModalModule,
        CKEditorModule,
        NzAutocompleteModule,
        ExperimentFormModule,
        NzDividerModule,
        NzCheckboxModule,
        NzToolTipModule,
        PlotlyModule
    ],
    exports: [
        ProjectComponent,
        BarChartComponent
    ]
})
export class ProjectExplorerModule { }
