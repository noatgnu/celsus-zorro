import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {WebService} from "../../../../services/web.service";
import {AutocompleteDatabase} from "../../../../classes/autocomplete-database";
import {DataService} from "../../../../services/data.service";
import {tap} from "rxjs";
// @ts-ignore
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: 'app-basic-experiment-info',
  templateUrl: './basic-experiment-info.component.html',
  styleUrls: ['./basic-experiment-info.component.less']
})
export class BasicExperimentInfoComponent implements OnInit, AfterViewInit {
  @Output() complete: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() projectData: EventEmitter<any> = new EventEmitter<any>()

  Editor = ClassicEditor

  loading = false
  form = this.fb.group({
    title: [null, Validators.required],
    currentOrganism: ["",],
    organisms: [[],],
    currentOrganismPart: ["",],
    organismParts: [[],],
    currentCellType: ["",],
    cellTypes: [[],],
    currentTissueType: ["", ],
    tissueTypes: [[],],
    currentKeyword: ["", ],
    keywords: [[],],
    currentExperimentType: ["", ],
    experimentTypes: [[],],
    currentQuantificationMethod: ["", ],
    quantificationMethods: [[],],
    currentInstrument: ["", ],
    instruments: [[],],
    currentDisease: ["", ],
    diseases: [[],],
    currentAuthors: ["",],
    authors: [[], Validators.required],
    firstAuthors: [[],],
    sampleProcessingProtocol: [[],],
    dataProcessingProtocol: [[],],
    description: [[],],
    ptmData: [false,],
    currentLabGroup: ["",],
    labGroups: [[],],
    projectType: ["TP",]
  })

  dataControlList: any[] = [
    {current: "currentOrganismPart", control: "organismParts", results: [], apiPath: "organism_parts", label: "Organism Parts"},
    {current: "currentTissueType", control: "tissueTypes", results: [], apiPath: "tissue_types", label: "Tissue types"},
    {current: "currentCellType", control: "cellTypes", results: [], apiPath: "cell_types", label: "Cell types"},
    {current: "currentExperimentType", control: "experimentTypes", results: [], apiPath: "experiment_types", label: "Experiment types"},
    {current: "currentQuantificationMethod", control: "quantificationMethods", results: [], apiPath: "quantification_methods", label: "Quantification methods"},
    {current: "currentKeyword", control: "keywords", results: [], apiPath: "keywords", label: "Keyword"},
    {current: "currentInstrument", control: "instruments", results: [], apiPath: "instruments", label: "Instruments"},
    {current: "currentDisease", control: "diseases", results: [], apiPath: "diseases", label: "Diseases"},
    {current: "currentAuthors", control: "authors", results: [], apiPath: "authors", label: "Authors"},
    {current: "currentLabGroup", control: "labGroups", results: [], apiPath: "lab_groups", label: "Lab Groups"},
  ]

  organismResults: any[] = []

  organismAutocomplete: AutocompleteDatabase = new AutocompleteDatabase("organism", this.web, this.form.controls["currentOrganism"].valueChanges, "organisms")

  constructor(private fb: FormBuilder, private web: WebService, private data: DataService) {
    for (let i = 0; i < this.dataControlList.length; i ++) {
      this.dataControlList[i].autocomplete = new AutocompleteDatabase(this.dataControlList[i].control, this.web, this.form.controls[this.dataControlList[i].current].valueChanges, this.dataControlList[i].apiPath)
      this.dataControlList[i].autocomplete.valueObservable.subscribe((data:any) => {
        this.dataControlList[i].results = data.results
      })
    }
    // this.form.controls["organism"].valueChanges.pipe(
    //   debounceTime(1000),
    //   distinctUntilChanged((curr, prev) => {
    //     return curr.toLowerCase() === prev.toLowerCase()
    //   })
    //   ).subscribe(data => {
    //
    // })
  }

  ngOnInit(): void {
  }

  getOrganismResults(e: Event) {
    e.preventDefault()
  }

  ngAfterViewInit() {
    this.organismAutocomplete.valueObservable.subscribe(data => {
      this.organismResults = data.results
    })
  }

  addToList(objectToAdd: any, controlName: string) {
    if (objectToAdd !== null) {
      if (this.form.value[controlName] === null) {
        this.form.controls[controlName].setValue([objectToAdd])
      } else {
        const organisms = this.form.value[controlName]
        organisms.push(objectToAdd)
        this.form.controls[controlName].setValue(organisms)
      }
    }
  }

  removeFromList(id: any, controlName: string, name: string = "") {
    let filtered = -1
    if (!(id)) {
      filtered = this.form.value[controlName].findIndex( (a:any) => a.name === name)
    } else {
      filtered = this.form.value[controlName].findIndex( (a:any) => a.id === id)
    }

    if (filtered > -1) {
      const selected = this.form.value[controlName]
      selected.splice(filtered, 1)
      this.form.controls[controlName].setValue(selected)
    }
  }

  submitBasicData() {
    if (this.form.valid) {
      this.web.submitProject(this.form.value).pipe(tap(_ => this.loading = true)).subscribe(data => {
        this.data.submittedProject = data
        this.loading = false
        this.projectData.emit(data)
        console.log(this.data.submittedProject)
        this.complete.emit(true)
      }, error => {
        console.log(error)
      })
    }
  }
}
