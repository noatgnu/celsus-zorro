import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpXsrfTokenExtractor} from "@angular/common/http";
import {forkJoin, Observable, Subscription} from "rxjs";
import {AccountsService} from "../pages/accounts/accounts.service";
import {exp} from "@amcharts/amcharts5/.internal/core/util/Ease";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebService {
  host = environment.apiURL
  currentFileType: string = "DA"
  keyMap: any = {
    "organisms": "organism",
    "organismParts": "organism_part",
    "diseases": "disease",
    "instruments": "instrument",
    "cellTypes": "cell_type",
    "tissueTypes": "tissue_type",
    "keywords": "keyword",
    "quantificationMethods": "quantification_method",
    "title": "title",
    "experimentTypes": "experiment_type",
    "sampleProcessingProtocol": "sample_processing_protocol",
    "dataProcessingProtocol": "data_processing_protocol",
    "description": "description",
    "authors": "associated_authors",
    "firstAuthors": "first_authors",
    "ptmData": "ptm_data",
    "enable": "enable",
    "labGroups": "lab_group",
    "projectType": "project_type"
  }

  keyMapDA: any = {
    "primaryId": "primary_id",
    "foldChange": "fold_change",
    "significant": "significant",
    "comparison": "comparison",
    "probabilityScore": "probability_score",
    "sequenceWindow": "sequence_window",
    "ptmPosition": "ptm_position",
    "ptmPositionInPeptide": "ptm_position_in_peptide",
    "accessionId": "accession_id",
    "peptideSequence": "peptide_sequence"
  }

  uploadedContent: any = {}

  constructor(private http: HttpClient, private accounts: AccountsService, private xsrf: HttpXsrfTokenExtractor) {


  }

  autoLogin() {
    let headers = new HttpHeaders()
    headers = headers.append("withCredentials", "true")
    this.http.get(this.host + "/csrf/", {observe: "response", responseType: "text", headers}).subscribe(data => {

    })

  }


  getApiData(query: any, apiPart: string = "") {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    let params = new HttpParams()
    for (const i in query) {
      params = params.append(i, `${query[i]}`)
    }
    if (query["name"]) {
      if (query["name"] !== "") {
      }
    }

    return this.http.get(
      this.host + apiPart + "/",
      {observe: "body", responseType: "json", headers: headers, params})
  }

  getProjects(term: string = "", limit: number = 20, offset: number = 0, extraParameters: any = {}) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    let params = new HttpParams().append("limit", `${limit}`)
    const searchIn: string[] = []
    for (const i in extraParameters) {
      if (extraParameters[i] !== false && i !== "term") {
        searchIn.push(i)
      }
    }
    if (term !== "") {
      params = params.append("search_query", `${term}`)
    }

    if (searchIn.length > 0) {
      params = params.append("search_in", `${searchIn.join(",")}`)
    }


    if (offset > 0) {
      params = params.append("offset", `${offset*limit}`)
    }
    return this.http.get(this.host + "/projects/", {headers, params})
  }

  submitProject(data: any) {
    const payload: any = {}
    for (const k in this.keyMap) {
      payload[this.keyMap[k]] = data[k]
    }
    let headers = new HttpHeaders()
    headers = headers.set("Content-Type", "application/json")
    return this.http.post(this.host + "/projects/", JSON.stringify(payload), {observe: "body", responseType: "json", headers})
  }

  submitDifferentialAnalysisFile = (file: any) => {
    return this.submitFile(file, this.currentFileType)
  }

  submitFile(file: any, fileType: string) {
    let form = new FormData()
    form.append("file_type", fileType)
    form.append("comparisons", "")
    form.append("file", file.file, file.file.name)
    return this.http.post(this.host + "/files/", form).subscribe(data => {
      this.uploadedContent[file.file.name] = data
      file.onSuccess(file.file)
    }, error => {
      file.onError(error, file.file)
    })
  }

  getFileColumns(fileId: number) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    return this.http.get(this.host + "/files/" + fileId + "/get_columns/", {responseType: "json", observe: "body", headers})
  }

  setFileToProject(projectId: number, fileId: number) {
    let headers = new HttpHeaders()
    headers = headers.set("Content-Type", "application/json")
    const payload = {project_id: projectId, file_id: fileId}
    return this.http.post(this.host + "/projects/" + projectId + "/set_file/", JSON.stringify(payload), {observe: "body", responseType: "json", headers})
  }

  submitDAColumns(fileId: number, data: any, comparisons: any, projectId: any){
    const payload: any = {}
    for (const k in this.keyMapDA) {
      payload[this.keyMapDA[k]] = data[k]
    }
    payload["comparisons"] = comparisons
    if (projectId) {
      payload["project_id"] = projectId
    }
    let headers = new HttpHeaders()
    headers = headers.set("Content-Type", "application/json")
    return this.http.post(this.host + "/files/" + fileId + "/add_differential_analysis_data/", JSON.stringify(payload), {responseType: "json", observe: "body", headers})
  }

  submitRawColumns(fileId: number, data: any, projectId: any) {

    const payload: any = {primary_id: data["primaryId"], samples: data["samples"]}
    if (projectId) {
      payload["project_id"] = projectId
    }
    if (data["accessionId"]) {
      payload["accession_id"] = data["accessionId"]
    }
    let headers = new HttpHeaders()
    headers = headers.set("Content-Type", "application/json")
    return this.http.post(this.host + "/files/" + fileId + "/add_raw_data/", JSON.stringify(payload), {responseType: "json", observe: "body", headers})
  }

  createComparison(data: any) {
    let headers = new HttpHeaders()
    headers = headers.set("Content-Type", "application/json")
    return this.http.post(this.host + "/comparisons/", JSON.stringify(data), {responseType: "json", observe: "body", headers})
  }

  submitOther = (fileList: any[]): Observable<any> => {
    const operations: any = []
    for (const f of fileList) {
      operations.push(this.submitFile(f, "O"))
    }
    return forkJoin(operations)
  }

  getFileDAData(projectId: any) {

  }

  getProject(projectId: any) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    let params = new HttpParams().append("expand", "default_settings")
    return this.http.get(this.host + "/projects/" + projectId + "/", {responseType: "json", observe: "body", headers, params})
  }

  getDifferentialAnalysisData(comparisonId: any = [], count: number = 20, ids: string[] = [], offset: number = 0,) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    let path = "/differential_data/"
    let params = new HttpParams()
      .append("limit", `${count}`)
    if (offset > 0) {
      params = params.append("offset", `${offset*count}`)
    }
    if (ids.length > 0) {
      params = params.append("ids", ids.join(","))
    }

    if (comparisonId.length > 0) {
      params = params.append("comparison", comparisonId.join(","))
    }

    params = params.append("expand", "comparison")

    return this.http.get(this.host + path, {responseType: "json", observe: "body", headers, params})
  }

  getDifferentialAnalysisFromGeneNames(query: string, offset: number = 0, limit: number = 20, exact: boolean = false, id: string = "", ptmData: any = null, includeProject: boolean=false, significantCutoff: number = 0, fcCutoff: number = 0) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    let params = new HttpParams()
      .append("limit", `${limit}`).append("ordering", "-significant")
    if (offset > 0) {
      params = params.append("offset", `${offset*limit}`)
    }
    if (id !== "") {
      params = params.append("id", id)
    } else {
      if (exact) {
        params = params.append("gene_names_exact", query)
      } else {
        params = params.append("gene_names", query)
      }
    }

    if (ptmData) {
      params = params.append("ptm_data", `${ptmData}`)
    }
    const expand: string[] = []
    const omit: string[] = []
    if (includeProject) {
      expand.push("comparison.file.project")
      omit.push("comparison.file.comparisons")
    }

    if (expand.length > 0) {
      params = params.append("expand", `${expand.join(",")}`)
    }

    if (omit.length > 0) {
      params = params.append("omit", `${omit.join(",")}`)
    }

    if (significantCutoff != 0) {
      params = params.append("significant_cutoff", `${significantCutoff}`)
    }
    if (fcCutoff != 0) {
      params = params.append("fc_cutoff", `${fcCutoff}`)
    }
    return this.http.get(this.host + "/differential_data/", {responseType: "json", observe: "body", headers, params})
  }

  getRawDataFromGeneNames(query: string, offset: number = 0, limit: number = 20, exact: boolean = false, file_id: string[] = [], primaryId: boolean = false, ptmData: boolean = false) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    let params = new HttpParams()
      .append("limit", `${limit}`).append("ordering", "-significant")
    if (offset > 0) {
      params = params.append("offset", `${offset*limit}`)
    }
    if (exact) {
      if (primaryId) {
        params = params.append("primary_id_exact", query)
      } else {
        params = params.append("gene_names_exact", query)
      }
    } else {
      if (primaryId) {
        params = params.append("primary_id", query)
      } else {
        params = params.append("gene_names", query)
      }
    }
    if (file_id.length > 0) {
      params = params.append("file_id", file_id.join(","))
    }

    if (ptmData) {
      params = params.append("ptm_data", `${ptmData}`)
    }
    return this.http.get(this.host + "/raw_data/", {responseType: "json", observe: "body", headers, params})
  }

  getRawDataFromAccessionId(query: string, offset: number = 0, limit: number = 20, exact: boolean = false, file_id: string[] = [], primaryId: boolean = false) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    let params = new HttpParams()
      .append("limit", `${limit}`).append("ordering", "-significant")
    if (offset > 0) {
      params = params.append("offset", `${offset*limit}`)
    }
    if (exact) {
      if (primaryId) {
        params = params.append("primary_id_exact", query)
      } else {
        params = params.append("accession_id_exact", query)
      }
    } else {
      if (primaryId) {
        params = params.append("primary_id", query)
      } else {
        params = params.append("accession_id", query)
      }
    }
    if (file_id.length > 0) {
      params = params.append("file_id", file_id.join(","))
    }
    return this.http.get(this.host + "/raw_data/", {responseType: "json", observe: "body", headers, params})
  }

  getData(url: string, pageIndex:  number, pageSize: number, sortField: string | null, sortOrder: string | null, filter: Array<{ key: string; value: string[] }>): Observable<any> {
    let params = new HttpParams()
      .append("offset", `${(pageIndex-1) *pageSize}`)
      .append("limit", `${pageSize}`)
    if (sortField) {
      params = params.append("ordering", sortField)
    }
    for (const k of filter) {
      params = params.append(k.key, k.value.join(","))
    }
    return this.http.get(this.host + "/" + url, {params})
  }

  getUniprotRecord(queryId: any) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    return this.http.get(this.host + "/uniprot_record/" + queryId + "/", {responseType: "json", observe: "body", headers})
  }

  getUniprotSingle(accessionId: string) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    return this.http.get("https://rest.uniprot.org/uniprotkb/"+accessionId, {responseType: "json", observe: "body", headers})
  }

  getComparison(comparisonId: string) {
    let headers = new HttpHeaders()
    let params = new HttpParams().append("expand", "file.project")

    headers = headers.set("Accept", "application/json")
    return this.http.get(this.host + "/comparisons/" + comparisonId + "/", {responseType: "json", observe: "body", headers})
  }

  getProjectFromFile(fileId: number) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    return this.http.get(this.host + "/files/" + fileId + "/get_project/", {responseType: "json", observe: "body", headers})
  }

  updateProject(projectId: number, key: string, value: any) {
    let headers = new HttpHeaders()
    headers = headers.set("Content-Type", "application/json")
    const payload: any = {}
    payload[key] = value
    return this.http.patch(this.host + "/projects/" + projectId + "/", payload, {responseType: "json", observe: "body", headers})
  }

  deleteFile(id: number) {
    return this.http.delete(this.host + "/files/" + id +"/", {observe: "response"})
  }

  getBoxplotParameters(id: number) {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    return this.http.get(this.host + "/raw_sample_column/" + id + "/get_boxplot_parameters/", {responseType: "json", observe: "body", headers})
  }

  getOverview() {
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    return this.http.get(this.host + "/overview/", {responseType: "json", observe: "body", headers})
  }

  refreshUniprot() {
    return this.http.post(this.host + "/genemap-refresh/", {})
  }

  getUserData() {
    return this.http.post(this.host + "/user/", {})
  }

  getProjectCountData(apiPath: string, includeProjectCount: boolean = false) {
    let params: HttpParams = new HttpParams()
    if (!includeProjectCount) {
      params = params.append("omit", "project_count")
    } else {
      params = params.append("ordering", "-project_count").append("project_count", `1`)
    }
    let headers = new HttpHeaders()
    headers = headers.set("Accept", "application/json")
    return this.http.get(this.host + apiPath, {responseType: "json", observe: "body", headers, params})
  }
}
