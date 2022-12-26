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
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.less']
})
export class BarChartComponent implements OnInit, AfterViewInit, OnDestroy {
  divName = "barChart"

  private root!: am5.Root;

  height = 600

  private _data: any = {}
  allData: any[] = []
  @Input() set data(value: any[]) {
    this.updatePlot(value)
  }

  @Input() title: string = "Bar Chart"

  conditions: string[] = []
  samples: string[] = []
  sampleToBeShow: string[] = []


  updatePlot(value: any[] = []){
    console.log(value)
    this._data = {}
    this.allData = value
    this.allData.forEach((a: any) => {
      const res = a.raw_sample_column.name.split(".")
      if (!(res[0] in this._data)) {
        this._data[res[0]] = []
      }
      a["sample"] = a.raw_sample_column.name
      a["condition"] = res[0]
      this._data[res[0]].push(a)
    })
    let result: any[] = []
    for (const d in this._data) {
      result = result.concat(this._data[d])
      const position = Math.ceil(this._data[d].length/2)
      this.sampleToBeShow.push(this._data[d][position]["sample"])
    }
    this.conditions = Object.keys(this._data)

    this.dataSubject.next(result)
  }
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

  drawData(data: any[]) {
    this.browserOnly(()=> {
      let root: am5.Root
      if (this.root !== undefined) {
        root = this.root
        root.container.children.clear()
      } else {
        root = am5.Root.new(this.divName)
      }
      root.setThemes([am5themes_Kelly.new(root)])

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX:true,
        layout: root.verticalLayout
      }));
      chart.children.unshift(am5.Label.new(root, {
        text: this.title,
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

      let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
      xRenderer.labels.template.setAll({
        //rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {
        }),
        min: 0
      }));
      yAxis.children.unshift(am5.Label.new(root, {
        rotation: -90,
        text: "Intensity",
        y: am5.p50,
        centerX: am5.p50
      }))
      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "sample",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));
      xAxis.children.push(am5.Label.new(root, {
        text: "Samples",
        x: am5.p50,
        centerX: am5.p50
      }))
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Data",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "sample",
        tooltip: am5.Tooltip.new(root, {
          labelText:"{valueY}"
        })
      }));

      series.data.setAll(data)
      xAxis.data.setAll(data);

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });

      series.columns.template.adapters.add("fill", (fill, target) => {
        // @ts-ignore
        return chart.get("colors").getIndex(this.conditions.indexOf(target.dataItem.dataContext["condition"]));
      });

      series.columns.template.adapters.add("stroke", (stroke, target) => {
        // @ts-ignore
        return chart.get("colors").getIndex(this.conditions.indexOf(target.dataItem.dataContext["condition"]));
      });

      // @ts-ignore
      xRenderer.labels.template.adapters.add("text", (label, target:any, key) => {
        if (target.dataItem) {
          if (target.dataItem.dataContext) {
            if (this.sampleToBeShow.includes(target.dataItem.dataContext["sample"])) {
              return target.dataItem.dataContext["condition"]
            }
          }
        }
      })

      chart.appear(1000, 100)
      this.root = root

    })
  }
}
