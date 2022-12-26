import {AfterViewInit, Component, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent"
import {BehaviorSubject} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import am5themes_Kelly from "@amcharts/amcharts5/themes/Kelly";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.less']
})
export class PieChartComponent implements OnInit, AfterViewInit, OnDestroy {
  divName = "pieChart"

  private root!: am5.Root;

  @Input() height: number = 300
  @Input() width: number = 600
  allData: any[] = []
  @Input() set data(value: any[]) {
    this.updatePlot(value)
  }
  dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  @Input() title: string = "Pie Chart"
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
      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          endAngle: 270
        })
      );
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
      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "label",
          endAngle: 270
        })
      )
      series.states.create("hidden", {
        endAngle: -90
      });
      this.root = root
      series.data.setAll(data)
      series.appear(1000,100)
    })
  }
}
