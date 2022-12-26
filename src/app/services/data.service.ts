import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  submittedProject: any ={}
  selectedMap: any = {}
  selected: string[] = []
  constructor() { }
}
