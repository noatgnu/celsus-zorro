import {ChangeDetectorRef, Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.less']
})
export class ProjectTableComponent implements OnInit {

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
