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
  selector: 'app-ptm-position-visualization',
  templateUrl: './ptm-position-visualization.component.html',
  styleUrls: ['./ptm-position-visualization.component.less']
})
export class PtmPositionVisualizationComponent implements OnInit, AfterViewInit, OnDestroy {
  divName = "barChart"

  private root!: am5.Root;

  height = 600

  private _data: any = {}
  allData: any[] = []
  @Input() set data(value: any[]) {
    this.updatePlot(value)
  }

  @Input() title: string = "PTMChart"
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
  }

  updatePlot(value: any[]) {

  }
}
