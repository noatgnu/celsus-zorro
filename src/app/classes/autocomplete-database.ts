import {HttpClient} from "@angular/common/http";
import {catchError, debounceTime, distinctUntilChanged, Observable, of, OperatorFunction, switchMap, tap} from "rxjs";
import {WebService} from "../services/web.service";

export class AutocompleteDatabase {
  id: string = ""
  searching: boolean = false
  searchFailed: boolean = false
  apiPath: string = ""
  web: WebService
  valueObservable: Observable<any>
  values: any = {}
  extraParameters: any = {}
  parameterName: string = "name"
  constructor(id: string, web: WebService, value: Observable<string>, apiPath: string, parameterName:string = "name", extraParameters: any = {}) {
    this.id = id
    this.web = web
    this.apiPath = apiPath
    this.parameterName = parameterName
    this.extraParameters = extraParameters
    this.valueObservable = value.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true
      }),
      switchMap(term => {
        if (this.id) {
          const payload: any = {}
          payload[parameterName] = term
          for (const e in this.extraParameters) {
            payload[e] = this.extraParameters[e]
          }

          return this.web.getApiData(payload, apiPath).pipe(
            tap((value) => {
              this.searchFailed = false
              this.values = value
            }),
            catchError(() => {
              this.searchFailed = true
              return of("")
            })
          )
        }
        return term
      }),
      tap(() => this.searching = false)
    )

  }

}
