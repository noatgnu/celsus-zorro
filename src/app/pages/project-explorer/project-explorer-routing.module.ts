import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import {ProjectDetailsComponent} from "./project/project-details/project-details.component";
import {SearchDataComponent} from "./search-data/search-data.component";
import {ProteinViewerComponent} from "./protein-viewer/protein-viewer.component";

const routes: Routes = [
  { path: '', component: ProjectComponent},
  { path: 'details/:id', component: ProjectDetailsComponent},
  { path: 'search/:query', component: SearchDataComponent},
  { path: 'protein-viewer/:gene_names/:comparison_id/:primary_key/:ptm_data', component: ProteinViewerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectExplorerRoutingModule { }
