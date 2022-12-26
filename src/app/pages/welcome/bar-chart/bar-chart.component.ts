import {AfterViewInit, Component, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import {BehaviorSubject} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import am5themes_Kelly from "@amcharts/amcharts5/themes/Kelly";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.less']
})
export class BarChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private _divName = "barChart"

  @Input() set divName(value: string) {
    this._divName = value
  }

  get divName(): string {
    return this._divName
  }
  private root!: am5.Root;

  @Input() height: number = 300
  @Input() width: number = 600
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
    this.browserOnly(()=> {
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
      let colors: any = chart.get("colors");
      data.forEach((d:any) => {
        d.columnSettings = {fill: colors.next()}
      })
      let circleTemplate = am5.Template.new({})
      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "label",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30
        }),
        // bullet: (root, axis, dataItem: any) => {
        //   return am5xy.AxisBullet.new(root, {
        //     location: 0.5,
        //     sprite: am5.Picture.new(root, {
        //       width: 24,
        //       height: 24,
        //       centerY: am5.p50,
        //       centerX: am5.p50,
        //       src: dataItem.dataContext.icon
        //     })
        //   });
        //}
      }));
      xAxis.get("renderer").labels.template.setAll({
        paddingTop: 20,
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      xAxis.data.setAll(data);
      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        min: 0
      }));

      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "label"
      }));

      series.columns.template.setAll({
        tooltipText: "{categoryX}: {valueY}",
        tooltipY: 0,
        strokeOpacity: 0,
        cornerRadiusTR: 10,
        cornerRadiusTL: 10,
        fillOpacity: 0.8,
        templateField: "columnSettings"
      });

      series.data.setAll(data);
      series.appear();
      chart.appear(1000, 100);

      this.root = root
    })
  }
}
