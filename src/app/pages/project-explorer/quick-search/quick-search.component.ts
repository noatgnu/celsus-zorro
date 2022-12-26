import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AutocompleteDatabase} from "../../../classes/autocomplete-database";
import {WebService} from "../../../services/web.service";

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.less']
})
export class QuickSearchComponent implements OnInit {
  private _parameters: any = {}
  @Input() set parameters(value: any) {
    this._parameters = value
    for (let i = 0; i < this.control.length; i ++) {
      if (this.control[i].parameterName === "primary_id") {
        this.control[i].autocomplete = new AutocompleteDatabase(
          this.control[i].control,
          this.web,
          this.form.controls[this.control[i].current].valueChanges,
          this.control[i].apiPath, this.control[i].parameterName,
          value
        )
      } else {
        this.control[i].autocomplete = new AutocompleteDatabase(
          this.control[i].control,
          this.web,
          this.form.controls[this.control[i].current].valueChanges,
          this.control[i].apiPath, this.control[i].parameterName,
          value
        )
      }

      this.control[i].autocomplete.valueObservable.subscribe((data:any) => {
        this.control[i].results = data.results
      })
    }
  }

  get parameters(): any {
    return this._parameters
  }

  @Output() selected: EventEmitter<any> = new EventEmitter<any>()

  form = this.fb.group({
    "searchTypes": ["gene_names",],
    "current_accession_id": ["",],
    "current_gene_names": ["",],
    "current_primary_id": ["",],
    "gene_names": ["",],
    "accession_id": ["",],
    "primary_id": ["",]
  })

  control: any[] = [
    {current: "current_accession_id", control: "accession_id", label:"Accession IDs",  results: [], apiPath: "/genenamemap", parameterName:  "accession_id"},
    {current: "current_gene_names", control: "gene_names", label:"Gene Names",  results: [], apiPath: "/genenamemap", parameterName: "gene_names"},
    //{current: "current_primary_id", control: "primary_id", label: "Primary IDs", results: [], apiPath: "/raw_data", parameterName: "primary_id"}
  ]
  constructor(private fb: FormBuilder, private web: WebService) {

  }

  ngOnInit(): void {
  }

}
