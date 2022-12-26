import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID
} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Kelly from '@amcharts/amcharts5/themes/Kelly';
import {isPlatformBrowser} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import * as am5xy from "@amcharts/amcharts5/xy";
import {WebService} from "../../../services/web.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-volcano-plot',
  templateUrl: './volcano-plot.component.html',
  styleUrls: ['./volcano-plot.component.less']
})
export class VolcanoPlotComponent implements OnInit, OnDestroy, AfterViewInit {
  divName = "volcanoPlot"
  height = 600

  private root!: am5.Root;

  selectedPK: number[] = []
  private _data: any = {}
  allData: any[] = []
  @Input() set data(value: any[]) {
    this.updatePlot(value)
  }

  @Input() allowSelection: boolean = true

  selectedMap: any = {}

  updatePlot(value: any[] = []){
    if (value.length > 0) {
      this.allData = value
    }
    this._data = {}
    this.allData.forEach((a) => {

      const label = this.getLabel(a["fold_change"], a["significant"])
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
    console.log(this._data)
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


  form = this.fb.group({
    pCutoff: [1.5, Validators.required],
    fcCutoff: [0.5, Validators.required],
    minX: [null, ],
    maxX: [null, ],
    minY: [null, ],
    maxY: [null, ]
  })

  @Output() selected: EventEmitter<string[]> = new EventEmitter<string[]>()
  dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private web: WebService, private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
  }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    this.dataSubject.asObservable().subscribe(data => {
      if (Object.keys(data).length > 0) {
        this.drawData(data)
      }
    })
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

  drawData(data: any) {
    this.browserOnly(()=> {
      let root: am5.Root
      if (this.root !== undefined) {
        root = this.root
        root.container.children.clear()
        root.dispose()
      }
      root = am5.Root.new(this.divName)
      root.fps = 10
      root.setThemes([am5themes_Kelly.new(root)])
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelY: "zoomXY",
        pinchZoomX:true,
        pinchZoomY:true,
        layout: root.verticalLayout,
        maxTooltipDistance: 0,
        maxTooltipDistanceBy: "xy",
      }))

      const xSettings: any = {
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
        tooltip: am5.Tooltip.new(root, {
          keepTargetHover: false
        }),
      }
      if (this.form.value["minX"] !== null) {
        xSettings["min"] = this.form.value["minX"]
      }
      if (this.form.value["maxX"] !== null) {
        xSettings["max"] = this.form.value["maxX"]
      }

      let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, xSettings))
      xAxis.children.push(am5.Label.new(root, {
        text: "log2(FC)",
        x: am5.p50,
        centerX: am5.p50
      }))
      const ySettings: any = {
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {
          keepTargetHover: false
        })
      }
      if (this.form.value["minY"] !== null) {
        ySettings["min"] = this.form.value["minY"]
      }
      if (this.form.value["maxY"] !== null) {
        ySettings["max"] = this.form.value["maxY"]
      }
      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, ySettings))
      yAxis.children.unshift(am5.Label.new(root, {
        rotation: -90,
        text: "-log10(p-value)",
        y: am5.p50,
        centerX: am5.p50
      }))
      for (const s in data) {
        let series0 = chart.series.push(am5xy.LineSeries.new(root, {
          calculateAggregates: true,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "significant",
          valueXField: "fold_change",
          legendLabelText: s,
          seriesTooltipTarget: "bullet"
        }))

        this.addBullet(series0, root);

        this.addTootip(series0, root);
        series0.strokes.template.set("strokeOpacity", 0);

        series0.fills.template.adapters
        series0.data.setAll(data[s])
      }

      let legend = chart.children.push(am5.Legend.new(root, {}))
      legend.data.setAll(chart.series.values);

      chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "selectXY",
      }));

      let rangeDataItemXRight = xAxis.makeDataItem({
        value: this.form.value["fcCutoff"]
      })
      xAxis.createAxisRange(rangeDataItemXRight)
      // @ts-ignore
      rangeDataItemXRight.get("grid").setAll({
        strokeOpacity: 1,
        strokeDasharray: [3,3]
      })
      let rangeDataItemXLeft = xAxis.makeDataItem({
        value: -this.form.value["fcCutoff"]
      })
      xAxis.createAxisRange(rangeDataItemXLeft)
      // @ts-ignore
      rangeDataItemXLeft.get("grid").setAll({
        strokeOpacity: 1,
        strokeDasharray: [3,3]
      })
      let rangeDataItemY = yAxis.makeDataItem({
          value: this.form.value["pCutoff"]
        })
      yAxis.createAxisRange(rangeDataItemY)
      // @ts-ignore
      rangeDataItemY.get("grid").setAll({
        strokeOpacity: 1,
        strokeDasharray: [3,3]
      })
      chart.appear(1000, 100);

      this.root = root
    })
  }

  private addBullet(series0: am5xy.LineSeries, root: am5.Root) {
    // @ts-ignore
    let bulletTemplate = am5.Template.new(root, {})

    if (this.allowSelection) {
      // @ts-ignore
      bulletTemplate.events.on("click", (ev: any) => {

        if (this.selectedMap[ev.target.dataItem.dataContext.id]) {

        } else {
          this.selectedMap[ev.target.dataItem.dataContext.id] = [ev.target.dataItem.dataContext.gene_names.gene_names]
        }
        const selected = Object.keys(this.selectedMap)
        this.selected.emit(selected)
        this.updatePlot()
      });
    }

    series0.bullets.push(() => {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          fill: series0.get("fill"),
          radius: 6,
          opacity: 1
          // @ts-ignore
        }, bulletTemplate)
      })
    });
  }

  private addTootip(series0: am5xy.LineSeries, root: am5.Root) {
    let tooltip = series0.set("tooltip", am5.Tooltip.new(root, {
      keepTargetHover: false,
      pointerOrientation: "horizontal"
    }))

    tooltip.label.adapters.add("text", (text, target: any) => {
      let t: string = ""
      // @ts-ignore
      if (target.dataItem) {
        if (target.dataItem.dataContext) {
          if (target.dataItem.dataContext["gene_names"]) {
            t = t + target.dataItem.dataContext["gene_names"]["gene_names"] + "\n"
          } else {
            t = t + target.dataItem.dataContext["primary_id"] + "\n"
          }
          t = t + "FC: " + target.dataItem.dataContext["fold_change"] + '\nSignificant: ' + target.dataItem.dataContext["significant"]
          return t
        }
      }
      return text
    })
  }

  addDataSet() {

  }
}
