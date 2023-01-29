import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebService} from "../../../../services/web.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// @ts-ignore
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {AutocompleteDatabase} from "../../../../classes/autocomplete-database";
import {forkJoin, Subject} from "rxjs";
import {AccountsService} from "../../../accounts/accounts.service";
import {ProjectSettings} from "../../../../classes/project-settings";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.less']
})
export class ProjectDetailsComponent implements OnInit {
  volcanoSettings: FormGroup = this.fb.group({
    pCutoff: [1.5, Validators.required],
    fcCutoff: [0.5, Validators.required],
    minX: [null, ],
    maxX: [null, ],
    minY: [null, ],
    maxY: [null, ]
  })
  projectSettingsForm: FormGroup = this.fb.group({
    profile_plot: [true,],
    volcano_plot: [true,]
  })
  volcanoRedraw: boolean = false
  projectSettings: ProjectSettings = new ProjectSettings()
  projectSettingsVisible: boolean = false
  volcanoSelection: any = {}
  data: any = {results: []}
  selectedData: string[] = []
  countDA: number = 0
  comparisons: any[] = []
  allDAData: any[] = []
  Editor = ClassicEditor
  project: any = {}
  currentEdit: string = ""
  fileId: number|undefined
  fileDAUpdateTrigger: Subject<boolean> = new Subject<boolean>()
  fileRAWUpdateTrigger: Subject<boolean> = new Subject<boolean>()
  fileOtherUpdateTrigger: Subject<boolean> = new Subject<boolean>()
  daFile: any
  rawFile: any
  otherFiles: any[] = []
  selectedBoxplot: any = {}
  form = this.fb.group({
    title: [null, Validators.required],
    current_lab_group: [[],],
    lab_group: [[],],
    current_organism: ["",],
    organism: [[],],
    current_organism_part: ["",],
    organism_part: [[],],
    current_cell_type: ["",],
    cell_type: [[],],
    current_tissue_type: ["", ],
    tissue_type: [[],],
    current_keyword: ["", ],
    keyword: [[],],
    current_experiment_type: ["", ],
    experiment_type: [[],],
    current_quantification_method: ["", ],
    quantification_method: [[],],
    current_instrument: ["", ],
    instrument: [[],],
    current_disease: ["", ],
    disease: [[],],
    current_associated_authors: ["",],
    associated_authors: [[], Validators.required],
    first_authors: [[],],
    sample_processing_protocol: [[],],
    data_processing_protocol: [[],],
    description: [[],],
    comparisons: [[], Validators.required],
    enable: [false, Validators.required]
  })
  listProperties: any[] = [
    {current: "current_organism", control: "organism", label:"Organisms",  results: [], apiPath: "organisms",},
    {current: "current_organism_part", control: "organism_part", label:"Organism Parts",  results: [], apiPath: "organism_parts"},
    {current: "current_cell_type", control: "cell_type", label:  "Cell Types", results: [], apiPath: "cell_types"},
    {current: "current_tissue_type", control: "tissue_type", label: "Tissue Types", results: [], apiPath: "tissue_types",},
    {current: "current_disease", control: "disease", label: "Diseases", results: [], apiPath: "diseases",},
    {current: "current_instrument", control: "instrument", label: "Instruments", results: [], apiPath: "instruments",},
    {current: "current_quantification_method", control: "quantification_method", label: "Quantification Methods", results: [], apiPath: "quantification_methods"},
    {current: "current_experiment_type", control: "experiment_type", label: "Experiment Types", results: [], apiPath: "experiment_types"},
    {current: "current_keyword", control: "keyword", label: "Keywords", results: [], apiPath: "keywords"},
    {current: "current_associated_authors", control: "associated_authors", label: "Authors", results: [], apiPath: "authors"},
    {current: "current_lab_group", control: "lab_group", label: "Lab Groups", results: [], apiPath: "lab_groups"}
  ]
  currentControl: any = {}
  modalVisible: boolean = false
  boxPlotData: any[] = []
  boxPlotLineChart: any[] = []
  boxPlotForm = this.fb.group({
    "searchTypes": ["gene_names",],
    "current_accession_id": ["",],
    "current_gene_names": ["",],
    "current_primary_id": ["",],
    "gene_names": ["",],
    "accession_id": ["",],
    "primary_id": ["",]
  })

  boxPlotControl: any[] = [
    {current: "current_accession_id", control: "accession_id", label:"Accession IDs",  results: [], apiPath: "genenamemap", parameterName:  "accession_id"},
    {current: "current_gene_names", control: "gene_names", label:"Gene Names",  results: [], apiPath: "genenamemap", parameterName: "gene_names"},
    //{current: "current_primary_id", control: "primary_id", label: "Primary IDs", results: [], apiPath: "/raw_data", parameterName: "primary_id"}
  ]

  constructor(public accounts: AccountsService, private route: ActivatedRoute, private web: WebService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form.controls["comparisons"].valueChanges.subscribe(data => {
      if (data.length >0) {
        this.web.getDifferentialAnalysisData(data.map((a: any) => a.id)).subscribe((res:any) => {
          this.countDA = res.count
          this.web.getDifferentialAnalysisData(data.map((a: any) => a.id), res.count).subscribe((res: any) => {
            this.allDAData = res.results
          })
        })
      }
    })
    this.route.params.subscribe(data => {
      if (data["id"]) {
        this.otherFiles = []
        this.web.getProject(data["id"]).subscribe((projectData: any) => {
          this.project = projectData
          for (const i in this.project.default_settings.data) {
            if (i in this.projectSettings) {
              // @ts-ignore
              this.projectSettings[i] = this.project.default_settings.data[i]
            }
          }
          for (const i in this.project) {
            if (i in this.form.controls) {
              this.form.controls[i].setValue(this.project[i])
            }
          }

          this.form.controls["enable"].valueChanges.subscribe(data => {
            this.web.updateProject(this.project.id, "enable", data).subscribe(data => {
              console.log(data)
            })
          })
          for (const f of projectData["files"]) {
            if (f["file_type"] === "DA") {
              this.daFile = f
              this.comparisons = f["comparisons"]
              if (this.comparisons.length > 0) {
                this.form.controls["comparisons"].setValue([this.comparisons[0]])
              }
            } else if (f.file_type === "R") {
              this.rawFile = f
              const boxPlotRequest: any[] = []
              for (const c of this.rawFile.raw_sample_columns) {
                boxPlotRequest.push(this.web.getBoxplotParameters(c.id))
              }
              forkJoin(boxPlotRequest).subscribe(data => {
                this.boxPlotData = data
              })
            } else {
              this.otherFiles.push(f)
            }
          }
          for (let i = 0; i < this.listProperties.length; i ++) {
            this.listProperties[i].autocomplete = new AutocompleteDatabase(this.listProperties[i].control, this.web, this.form.controls[this.listProperties[i].current].valueChanges, this.listProperties[i].apiPath)
            this.listProperties[i].autocomplete.valueObservable.subscribe((data:any) => {
              this.listProperties[i].results = data.results
            })
          }
          for (let i = 0; i < this.boxPlotControl.length; i ++) {
            if (this.boxPlotControl[i].parameterName === "primary_id") {
              this.boxPlotControl[i].autocomplete = new AutocompleteDatabase(
                this.boxPlotControl[i].control,
                this.web,
                this.boxPlotForm.controls[this.boxPlotControl[i].current].valueChanges,
                this.boxPlotControl[i].apiPath, this.boxPlotControl[i].parameterName,
                {file_id: [this.rawFile.id]}
              )
            } else {
              this.boxPlotControl[i].autocomplete = new AutocompleteDatabase(
                this.boxPlotControl[i].control,
                this.web,
                this.boxPlotForm.controls[this.boxPlotControl[i].current].valueChanges,
                this.boxPlotControl[i].apiPath, this.boxPlotControl[i].parameterName,
                {project_id: this.project.id}
              )
            }

            this.boxPlotControl[i].autocomplete.valueObservable.subscribe((data:any) => {
              this.boxPlotControl[i].results = data.results
              console.log(this.boxPlotControl[i].results)
            })
          }
        })
      }
    })
  }
  ngOnInit(): void {
  }

  openModal(controller: string) {
    this.modalVisible = true
    this.currentEdit = controller
    const a = this.listProperties.filter(a => a.control === this.currentEdit)
    if (a.length > 0) {
      this.currentControl = a[0]
    }
    console.log(this.project.id)
  }

  closeModal() {
    this.modalVisible = false
    this.projectSettingsVisible = false
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

  processOK() {
    if (!this.currentEdit.startsWith('files')) {

      this.web.updateProject(this.project.id, this.currentEdit, this.form.value[this.currentEdit]).subscribe(data => {
        this.project = data
        for (const i in this.project) {
          if (i in this.form.controls) {
            if (this.project[i] !== this.form.value[i]) {
              this.form.controls[i].setValue(this.project[i])
            }
          }
        }
        this.modalVisible = false
      })
    } else if (this.currentEdit === "filesR") {
      if (this.rawFile !== undefined) {
        this.web.deleteFile(this.rawFile.id).subscribe(data => {
          if (data.status === 204) {
            this.fileRAWUpdateTrigger.next(true)
          }
        })
      } else {
        this.fileRAWUpdateTrigger.next(true)
      }
    } else if (this.currentEdit === "filesDA") {
      if (this.daFile !== undefined) {
        this.web.deleteFile(this.daFile.id).subscribe(data => {
          if (data.status === 204) {
            this.fileDAUpdateTrigger.next(true)
          }
        })
      } else {
        this.fileDAUpdateTrigger.next(true)
      }
    } else if (this.currentEdit === "filesO") {
      this.updateFinish(true)
    }

  }

  updateFinish(e: any) {
    if (e) {
      this.otherFiles = []
      this.modalVisible = false
      this.web.getProject(this.project.id).subscribe((projectData: any) => {
        this.project = projectData
        for (const i in this.project.default_settings.data) {
          if (i in this.projectSettings) {
            // @ts-ignore
            this.projectSettings[i] = this.project.default_settings.data[i]
          }
        }
        for (const i in this.project) {
          if (i in this.form.controls) {
            this.form.controls[i].setValue(this.project[i])
          }
        }

        for (const f of projectData["files"]) {
          if (f["file_type"] === "DA") {
            this.daFile = f
            this.comparisons = f["comparisons"]
            if (this.comparisons.length > 0) {
              this.form.controls["comparisons"].setValue([this.comparisons[0]])
            }
          } else if (f.file_type === "R") {
            this.rawFile = f
          } else {
            this.otherFiles.push(f)
          }
        }
      })
    }
  }

  deleteFile(fileID: number) {
    this.web.deleteFile(fileID).subscribe(data => {
      if (data.status === 204) {
        this.updateFinish(true)
      }
    })
  }

  handleVolcanoSelection(e: any[]) {
    console.log(e)
    this.selectedData = e.slice()
    console.log(this.selectedData)
    this.changePage(0)
    //this.web.getDifferentialAnalysisData([], 20, e).subscribe(data => {
    //  this.selectedData = data
    //})
  }

  changePage(e: any) {
    this.web.getDifferentialAnalysisData([], 20, this.selectedData, e).subscribe(data => {
      this.data = data
      this.cdr.detectChanges()
    })
  }

  clearBoxplotLineChart() {
    this.boxPlotLineChart = []
    this.selectedBoxplot = {}
    console.log(this.selectedBoxplot)
  }

  getBoxplotValue(control: string, obj: any) {
    if (!(obj.id in this.selectedBoxplot)) {
      this.selectedBoxplot[obj.id] = obj
      switch (control) {
        case "primary_id":
          break
        case "gene_names":
          this.web.getRawDataFromGeneNames(obj[control],0,999999,true, [this.rawFile.id],false).subscribe(
            (data:any) => {
              data.results.forEach((d:any) => {
                d.value = Math.log2(d.value)
                this.boxPlotLineChart.push(d)
              })
              this.boxPlotLineChart = [...this.boxPlotLineChart]
              console.log(this.boxPlotLineChart)
            }
          )
          break
        case "accession_id":
          this.web.getRawDataFromAccessionId(obj[control], 0,999999,true, [this.rawFile.id],false).subscribe(
            (data:any) => {
              data.results.forEach((d:any) => {
                d.value = Math.log2(d.value)
                this.boxPlotLineChart.push(d)
              })

              this.boxPlotLineChart = [...this.boxPlotLineChart]
            }
          )
          break
      }
    }
  }

  handleBoxPlotSelection(e: any) {
    this.getBoxplotValue(e.control, e.obj)
  }

  handleVolcanoSearch(e: any) {
    switch (e.control) {
      case "gene_names":
        this.volcanoSelection = {title: e.obj.gene_names, value: e.obj, selection_type: "gene_names"}
        break
      case "accession_id":
        this.volcanoSelection = {title: e.obj.gene_names, value: e.obj, selection_type: "accession_id"}
        break
    }
    console.log(e)
  }

  handleVolcanoSettings(e: any) {
    this.volcanoSettings = e
  }

  openProjectSetings() {
    this.projectSettingsVisible = true
  }

  updateProjectSettings() {
    for (const i in this.projectSettingsForm.value) {
      // @ts-ignore
      this.projectSettings.data[i] = this.projectSettingsForm.value[i]
    }
    this.closeModal()
  }
}
