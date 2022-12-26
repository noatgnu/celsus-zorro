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
  selector: 'app-boxplot',
  templateUrl: './boxplot.component.html',
  styleUrls: ['./boxplot.component.less']
})
export class BoxplotComponent implements OnInit, AfterViewInit, OnDestroy {
  divName = "boxPlot"

  private root!: am5.Root;

  height = 600

  private _data: any = {}
  allData: any[] = []
  conditions: string[] = []
  samples: string[] = []
  sampleToBeShow: string[] = []
  lineChartColor: string[] = []

  @Input() set data(value: any[]) {
    this.updatePlot(value)
  }

  private _lineChartData: any = {}

  @Input() set lineChartData(value: any[]) {
    if (value.length > 0) {
      for (const i of value) {
        i["sample"] = i["raw_sample_column"]["name"]

        if (i.gene_names) {
          if (!(i.gene_names.gene_names in this._lineChartData)) {
            this._lineChartData[i.gene_names.gene_names] = []
          }
          this._lineChartData[i.gene_names.gene_names].push(i)
        } else {
          if (!(i.primary_id in this._lineChartData)) {
            this._lineChartData[i.primary_id] = []
          }
          this._lineChartData[i.primary_id].push(i)
        }
      }
      this.lineChartColor = Object.keys(this._lineChartData)
    } else {
      this.lineChartColor = []
      this._lineChartData = {}
    }

    this.updatePlot()
  }

  get lineChartData(): any {
    return this._lineChartData
  }

  updatePlot(value: any[] = []){
    if (value.length > 0) {
      this.allData = value
      this.allData.forEach((a: any) => {
        const res = a.name.split(".")
        if (!(res[0] in this._data)) {
          this._data[res[0]] = []
        }
        a["sample"] = a.name
        a["condition"] = res[0]
        this._data[res[0]].push(a)
      })
    }

    let result: any[] = []
    for (const d in this._data) {
      result = result.concat(this._data[d])
      const position = Math.ceil(this._data[d].length/2)
      this.sampleToBeShow.push(this._data[d][position]["sample"])
    }
    this.conditions = Object.keys(this._data)
    this.dataSubject.next(result)
  }

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
        this.drawData(data, this.lineChartData)
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

  drawData(data: any, lineChartData: any) {
    this.browserOnly(() => {
      let root: am5.Root
      if (this.root !== undefined) {
        root = this.root
        root.container.children.clear()
        root.dispose()
      }
      root = am5.Root.new(this.divName)
      root.setThemes([am5themes_Animated.new(root), am5themes_Kelly.new(root)])
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout
      }));

      chart.children.unshift(am5.Label.new(root, {
        text: "Profile plot",
        fontSize: 25,
        fontWeight: "500",
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0
      }))

      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );
      yAxis.children.unshift(am5.Label.new(root, {
        rotation: -90,
        text: "log2(Intensity)",
        y: am5.p50,
        centerX: am5.p50
      }))
      let xRenderer = am5xy.AxisRendererX.new(root, {minGridDistance: 10})
      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "sample",
        renderer: xRenderer
      }));
      xAxis.children.push(am5.Label.new(root, {
        text: "Samples",
        x: am5.p50,
        centerX: am5.p50
      }))
      let series = chart.series.push(
        am5xy.CandlestickSeries.new(root, {
          name: "Intensity",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "q1",
          openValueYField: "q3",
          lowValueYField: "low",
          highValueYField: "high",
          //sequencedInterpolation: true,
          categoryXField: "sample",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "vertical",
            labelText: "q3: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nq1: {valueY},\nmedian: {med}"
          })
        })
      );
      series.columns.template.adapters.add("fill", (fill, target) => {
        // @ts-ignore
        return chart.get("colors").getIndex(this.conditions.indexOf(target.dataItem.dataContext["condition"]));
      });
      let medianSeries = chart.series.push(
        am5xy.StepLineSeries.new(root, {
          stroke: root.interfaceColors.get("background"),
          xAxis: xAxis,
          yAxis: yAxis,
          categoryXField: "sample",
          valueYField: "med",
          noRisers: true
        })
      )
      series.data.setAll(data)
      if (this.lineChartColor.length > 0) {

        for (const l of this.lineChartColor) {
          let lineSeries = chart.series.push(am5xy.LineSeries.new(root,{
            name: l,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            categoryXField: "sample",
            tooltip: am5.Tooltip.new(root, {
              pointerOrientation: "horizontal",
              labelText: "{name} in {categoryX}: {valueY}"
            })
          }))
          lineSeries.strokes.template.setAll({
            strokeWidth: 3,
            templateField: "strokeSettings"
          })
          lineSeries.data.setAll(lineChartData[l])
          lineSeries.bullets.push(() => {
            return am5.Bullet.new(root, {
              sprite: am5.Circle.new(root, {
                strokeWidth: 3,
                stroke: lineSeries.get("stroke"),
                radius: 5,
                fill: root.interfaceColors.get("background")
              })
            })
          })
          lineSeries.appear(1000)
        }
      }


      xAxis.data.setAll(data)
      xRenderer.labels.template.adapters.add("text", (label, target:any, key) => {
        if (target.dataItem) {
          if (target.dataItem.dataContext) {
            if (this.sampleToBeShow.includes(target.dataItem.dataContext["sample"])) {
              return target.dataItem.dataContext["condition"]
            }
          }
        }
      })
      medianSeries.data.setAll(data)
      series.appear(1000)
      chart.appear(1000, 100)
      this.root = root
    })
  }
}
