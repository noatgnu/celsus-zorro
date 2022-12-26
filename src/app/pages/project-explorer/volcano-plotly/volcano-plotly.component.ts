import {AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, identity, takeUntil} from "rxjs";

@Component({
  selector: 'app-volcano-plotly',
  templateUrl: './volcano-plotly.component.html',
  styleUrls: ['./volcano-plotly.component.less']
})
export class VolcanoPlotlyComponent implements OnInit, AfterContentInit {
  graphData: any[] = []
  graphLayout: any = {
    height: 700, width: 900, xaxis: {title: "Log2FC", automargin: true,},
    yaxis: {title: "-log10(p-value)", automargin: true,},
    annotations: [],
    showlegend: true, legend: {
      orientation: 'h'
    },
    title: {
      text: "Differrential Analysis Volcano Plot",
      font: {
        size: 24
      },
    }
  }
  nameToID: any = {}
  divName = "volcanoPlot"

  private _data: any = {}
  allData: any[] = []
  @Input() set data(value: any[]) {
    this.updatePlot(value)
  }

  @Input() allowSelection: boolean = true

  @Input() set parameters(value: FormGroup) {
    this.form = value
    this.updatePlot()
  }
  @Input() set externalSelection(value: any) {
    let change = false
    if (value.selection_type === "gene_names"|| value.selection_type === "accession_id") {
      for (const i in this.nameToID) {
        if (this.nameToID[i].gene_names) {
          if (this.nameToID[i].gene_names.gene_names.startsWith("PPM1H")) {
            console.log(this.nameToID[i])
          }
          if (this.nameToID[i].gene_names.id === value.value.id) {
            if (!(this.nameToID[i].id in this.selectedMap)) {
              this.selectedMap[this.nameToID[i].id] = []
            }
            this.selectedMap[this.nameToID[i].id].push(value.title)
            change = true
          }
        }
      }
    }

    if (change) {
      this.updatePlot()
      this.selected.emit(Object.keys(this.selectedMap))
    }
  }

  xSettings: any = {min: null, max: null}
  ySettings: any = {min: null, max: null}
  selectedMap: any = {}

  defaultColorList = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf'
  ]

  updatePlot(value: any[] = []){
    if (value.length > 0) {
      this.allData = value
    }
    this._data = {}
    this.allData.forEach((a) => {

      const label = this.getLabel(a["fold_change"], a["significant"])
      if (a.gene_names) {
        a.text = `<b>Gene names:</b> ${a["gene_names"]["gene_names"]}<br><b>Primary ID:</b> ${a["primary_id"]}`
      } else {
        a.text = `<b>Primary ID:</b> ${a["primary_id"]}`
      }
      if (a.ptm_data) {
        a.text = a.text +
          `<br><b>Position in Protein: </b> ${a["ptm_position"]}<br><b>Position in Peptide:</b> ${a["ptm_position_in_peptide"]}<br><b>Peptide Sequence: ${a["peptide_sequence"]}</b>`
      }
      this.nameToID[a.text] = a
      if (this.xSettings.min) {
        if (this.xSettings.min > a["fold_change"]) {
          this.xSettings.min = a["fold_change"]
        }
      } else {
        this.xSettings.min = a["fold_change"]
      }
      if (this.xSettings.max) {
        if (this.xSettings.max < a["fold_change"]) {
          this.xSettings.max = a["fold_change"]
        }
      } else {
        this.xSettings.max = a["fold_change"]
      }
      if (this.ySettings.min) {
        if (this.ySettings.min > a["significant"]) {
          this.ySettings.min = a["significant"]
        }
      } else {
        this.ySettings.min = a["significant"]
      }
      if (this.ySettings.max) {
        if (this.ySettings.max < a["significant"]) {
          this.ySettings.max = a["significant"]
        }
      } else {
        this.ySettings.max = a["significant"]
      }

      if (!(label in this._data)) {
        this._data[label] = []
      }

      if (a.selected) {
        if (!("Current selections" in this._data)) {
          this._data["Current selections"] = []
        }
        this._data["Current selections"].push(a)
      }

      this._data[label].push(a)
      if (a["id"] in this.selectedMap) {
        for (const l of this.selectedMap[a["id"]]) {
          if (!(l in this._data)) {
            this._data[l] = []
          }
          this._data[l].push(a)
        }
      }
    })
    this.dataSubject.next(this._data)
  }

  getLabel(x: number, y: number) {
    let label = ""
    if (Math.abs(x) >= this.form.value["fcCutoff"]) {
      label = label + "FC >= " + this.form.value["fcCutoff"]
    } else {
      label = label + "FC < " + this.form.value["fcCutoff"]
    }
    label = label + "; "
    if (y >= this.form.value["pCutoff"]) {
      label = label + "Significant >= " + this.form.value["pCutoff"]
    } else {
      label = label + "Significant < " + this.form.value["pCutoff"]
    }
    return label
  }

  colorMap: any = {}

  form = this.fb.group({
    pCutoff: [1.5, Validators.required],
    fcCutoff: [0.5, Validators.required],
    minX: [null, ],
    maxX: [null, ],
    minY: [null, ],
    maxY: [null, ]
  })

  @Output() selected: EventEmitter<any[]> = new EventEmitter<any[]>()
  dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  breakColor: boolean = false
  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.dataSubject.asObservable().subscribe((data: any) => {
      this.drawVolcanoPlot()
    })
  }

  drawVolcanoPlot() {
    if (this.form.value["minY"] !== null) {
      this.ySettings["min"] = this.form.value["minY"]
    }
    if (this.form.value["maxY"] !== null) {
      this.ySettings["max"] = this.form.value["maxY"]
    }
    if (this.form.value["minX"] !== null) {
      this.xSettings["min"] = this.form.value["minX"]
    }
    if (this.form.value["maxX"] !== null) {
      this.xSettings["max"] = this.form.value["maxX"]
    }
    let currentPosition = 0
    let currentColors: string[] = []

    let temp: any = {}

    if (this.colorMap) {
      currentColors = Object.values(this.colorMap)
    }


    for (const s in this._data) {
      if (!this.colorMap[s]) {
        while (true) {
          if (this.breakColor) {
            this.colorMap[s] = this.defaultColorList[currentPosition]
            break
          }
          if (currentColors.indexOf(this.defaultColorList[currentPosition]) !== -1) {
            currentPosition ++
          } else if (currentPosition !== this.defaultColorList.length) {
            this.colorMap[s] = this.defaultColorList[currentPosition]
            break
          } else {
            this.breakColor = true
            currentPosition = 0
          }
        }
        currentPosition ++
        if (currentPosition === this.defaultColorList.length) {
          currentPosition = 0
        }
      }
      temp[s] = {
        x: [],
        y: [],
        text: [],
        type: "scattergl",
        mode: "markers",
        name: s,
        marker: {
          color: this.colorMap[s]
        }
      }
      this._data[s].forEach((d: any) => {
        temp[s].x.push(d["fold_change"])
        temp[s].y.push(d["significant"])
        temp[s].text.push(d["text"])
      })
    }
    const graphData: any[] = []

    for (const i in temp) {
      graphData.push(temp[i])
    }
    const cutOff: any[] = []
    cutOff.push({
      type: "line",
      x0: -(this.form.value["fcCutoff"]),
      x1: -(this.form.value["fcCutoff"]),
      y0: 0,
      y1: this.ySettings.max + 0.5,
      line: {
        color: 'rgb(21,4,4)',
        width: 1,
        dash: 'dot'
      }
    })
    cutOff.push({
      type: "line",
      x0: this.form.value["fcCutoff"],
      x1: this.form.value["fcCutoff"],
      y0: 0,
      y1: this.ySettings.max + 0.5,
      line: {
        color: 'rgb(21,4,4)',
        width: 1,
        dash: 'dot'
      }
    })

    cutOff.push({
      type: "line",
      x0: this.xSettings.min - 0.5,
      x1: this.xSettings.max + 0.5,
      y0: this.form.value["pCutoff"],
      y1: this.form.value["pCutoff"],
      line: {
        color: 'rgb(21,4,4)',
        width: 1,
        dash: 'dot'
      }
    })

    this.graphLayout.xaxis.range = [this.xSettings.min - 0.5, this.xSettings.max + 0.5]
    this.graphLayout.yaxis.range = [0, this.ySettings.max + 0.5]
    this.graphLayout.shapes = cutOff
    this.graphData = graphData
  }

  selectData(e: any) {
    if (this.allowSelection) {
      if ("points" in e) {
        const selected: any[] = []
        for (const p of e["points"]) {
          if (this.nameToID[p.text]) {
            let title = `${this.nameToID[p.text]["primary_id"]}`
            if (this.nameToID[p.text]["gene_names"]) {
              title = title + ` - ${this.nameToID[p.text]["gene_names"]["gene_names"]}`
            }
            selected.push(this.nameToID[p.text].id)
            if (!(this.nameToID[p.text].id in this.selectedMap)) {
              this.selectedMap[this.nameToID[p.text].id] = [title]
            } else {
              if (!this.selectedMap[this.nameToID[p.text].id].includes(title)) {
                this.selectedMap[this.nameToID[p.text].id].push(title)
              }
            }
          }
        }
        if (selected.length > 0) {
          this.selected.emit(Object.keys(this.selectedMap))
        }
        this.updatePlot()
      }
    }
  }
}
