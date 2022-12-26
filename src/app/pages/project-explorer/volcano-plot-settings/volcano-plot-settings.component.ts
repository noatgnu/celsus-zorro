import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-volcano-plot-settings',
  templateUrl: './volcano-plot-settings.component.html',
  styleUrls: ['./volcano-plot-settings.component.less']
})
export class VolcanoPlotSettingsComponent implements OnInit {
  @Output() output: EventEmitter<FormGroup> = new EventEmitter<FormGroup>()

  form = this.fb.group({
    pCutoff: [1.5, Validators.required],
    fcCutoff: [0.5, Validators.required],
    minX: [null, ],
    maxX: [null, ],
    minY: [null, ],
    maxY: [null, ]
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  provideSettings() {
    const form = this.fb.group({
      pCutoff: [1.5, Validators.required],
      fcCutoff: [0.5, Validators.required],
      minX: [null, ],
      maxX: [null, ],
      minY: [null, ],
      maxY: [null, ]
    })
    for (const c in this.form.controls) {
      form.controls[c].setValue(this.form.value[c])
    }
    this.output.emit(form)
  }
}
