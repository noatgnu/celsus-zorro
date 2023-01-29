import { Component, OnInit } from '@angular/core';
import {WebService} from "../../services/web.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent implements OnInit {
  pieChartData: any[] = []
  averageUniqueProteinData: any[] = []
  organismData: any[] = []

  dataType: any[] = [
    {"apiPath": "keywords/", "label": "Keywords", "title": 'Project distribution per keyword', "divName": 'projectDitributionPerKeyword', "results": []},
    {"apiPath": "organism_parts/", "label": "Organism Parts", "title": 'Project distribution per organism part', "divName": 'projectDitributionPerOrganismPart', "results": []},
    {"apiPath": "cell_types/", "label": "Cell Types", "title": 'Project distribution per cell types', "divName": 'projectDitributionPerCellType', "results": []},
    {"apiPath": "organisms/", "label": "Organisms", "title": 'Project distribution per organism', "divName": 'projectDitributionPerOrganism', "results": []},
    {"apiPath": "tissue_types/", "label": "Tissue Types", "title": 'Project distrbution per tissue type', "divName": 'projectDitributionPerTissueType', "results": []},
    {"apiPath": "experiment_types/", "label": "Experiment Types", "title": 'Project distribution per experiment type', "divName": 'projectDitributionPerExperimentType', "results": []},
    {"apiPath": "quantification_methods/", "label": "Quantification Methods", "title": 'Project distribution per quantification method', "divName": 'projectDitributionPerQuantificationMethod', "results": []},
    {"apiPath": "instruments/", "label": "Instruments", "title": 'Project distribution per instrument', "divName": 'projectDitributionPerInstrument', "results": []},
    {"apiPath": "diseases/", "label": "Diseases", "title": 'Project distribution per disease', "divName": 'projectDitributionPerDisease', "results": []},
    {"apiPath": "lab_groups/", "label": "Lab Groups", "title": 'Project distribution per experiment type', "divName": 'projectDitributionPerLabGroup', "results": []},
  ]

  form = this.fb.group({
    apiSelection: [[],]
  })

  constructor(private web: WebService, private fb: FormBuilder) {
    this.web.getOverview().subscribe((data:any) => {
      this.pieChartData = [
        {"label": "Total Proteomics", "value": data["project_count"]["total_proteomics"]},
        {"label": "PTM Proteomics", "value": data["project_count"]["ptm_proteomics"]}
      ]
      this.averageUniqueProteinData = [
        {"label": "Total Proteomics", "value": data["unique_proteins"]["average_unique_proteins"]["total_proteomics"], "icon": "/assets/avatars/total_proteomics.png"},
        {"label": "PTM Proteomics", "value": data["unique_proteins"]["average_unique_proteins"]["ptm_proteomics"], "icon": "/assets/avatars/phosphorylation.png"}
      ]
    })
    this.form.controls["apiSelection"].valueChanges.subscribe((data: string[]) => {
      for (const d of this.dataType) {
        if (data.includes(d.apiPath)) {
          this.web.getProjectCountData(d.apiPath,true).subscribe((da:any) => {
            const results: any[] = []
            da.results.forEach((d:any)=> {
              results.push({
                "label": d.name, "value": d.project_count
              })
            })
            d.results = results
          })
        }
      }
    })
    this.form.controls["apiSelection"].setValue(["organisms/"])
  }

  ngOnInit() {
  }

}
