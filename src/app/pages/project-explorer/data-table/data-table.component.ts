import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.less']
})
export class DataTableComponent implements OnInit, OnChanges {
  private _data: any[] = []
  loading: boolean = false
  @Input() set data(value: any) {
    this.change([...value.results])
  }

  get data(): any {
    return this._data
  }

  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

  ngOnInit(): void {
  }
  change(data: any[]): void {
    this.loading = true;
    console.log(data)
    if (data.length > 0) {
      setTimeout(() => {

        console.log(data)
        this._data = data;
        this.loading = false;
        this.cdr.detectChanges()
      }, 1000);
    } else {
      setTimeout(() => {
        console.log(data)
        this._data = []
        this.loading = false;
        this.cdr.detectChanges()
      }, 1000);
    }
  }
}
