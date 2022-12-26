import {AfterViewInit, Component, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import {BehaviorSubject} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import am5themes_Kelly from "@amcharts/amcharts5/themes/Kelly";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
  selector: 'app-bar-chart-simple',
  templateUrl: './bar-chart-simple.component.html',
  styleUrls: ['./bar-chart-simple.component.less']
})
export class BarChartSimpleComponent implements OnInit, AfterViewInit, OnDestroy {
  private _divName = "simpleBarChart"

  @Input() set divName(value: string) {
    this._divName = value
  }
  get divName(): string {
    return this._divName
  }

  private root!: am5.Root;

  height = 600
  width = 600
  allData: any[] = []
  @Input() set data(value: any[]) {
    this.updatePlot(value)
  }
  dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  @Input() title: string = "Bar Chart"

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSubject.asObservable().subscribe(data => {
      if (Object.keys(data).length > 0) {
        this.drawData(data)
      }
    })
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

  updatePlot(value: any[] = []){
    this.allData = value
    this.dataSubject.next(this.allData)
  }

  drawData(data: any[]) {
    this.browserOnly(() => {
      let root: am5.Root
      if (this.root !== undefined) {
        root = this.root
        root.container.children.clear()
      } else {
        root = am5.Root.new(this.divName)
      }
      root.setThemes([am5themes_Animated.new(root), am5themes_Kelly.new(root)])

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
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
      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomX"
      }));
      cursor.lineY.set("visible", false);

      let xRenderer = am5xy.AxisRendererX.new(root, {minGridDistance: 10})
      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "id",
        renderer: xRenderer
      }));

      xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );

      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Data",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "id",
        tooltip: am5.Tooltip.new(root, {
          labelText:"{valueY}"
        })
      }));
      let tooltip = series.set("tooltip", am5.Tooltip.new(root, {}))

      tooltip.label.adapters.add("text", (text, target: any) => {
        let t: string = ""
        // @ts-ignore
        if (target.dataItem) {
          if (target.dataItem.dataContext.data) {
            if (target.dataItem.dataContext.data["gene_names"]) {
              t = t + target.dataItem.dataContext.data["gene_names"]["gene_names"] + "\n"
            } else {
              t = t + target.dataItem.dataContext.data["primary_id"] + "\n"
            }
            t = t + "FC: " + target.dataItem.dataContext.data["fold_change"] + '\nSignificant: ' + target.dataItem.dataContext.data["significant"] + '\nComparison: ' + target.dataItem.dataContext.data["comparison"]["name"]
            return t
          }
        }
        return text
      })
      xRenderer.labels.template.adapters.add("text", (label, target:any, key) => {
        if (target.dataItem) {
          if (target.dataItem.dataContext) {
            if (target.dataItem.dataContext.data["selected"]) {
              return "Selected"
            }
          }
        }
        return ""
      })
      series.data.setAll(data)
      xAxis.data.setAll(data);

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, templateField: "columnSettings" });
      chart.appear(1000, 100)
      this.root = root
    })
  }
}
