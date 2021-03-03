import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'charset=utf-8'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AccountHeadService {

  constructor(public http: HttpClient) { }

  onAccountGets(url, searchText, branchId):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'AccountHead_GetsNew';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = String(branchId);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "TypeFlag";
    ProcParams["strArgmt"] = 'Customer';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "Search";
    ProcParams["strArgmt"] = searchText;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams)
    
    return this.http.post(url +'/CommonQuery/fnGetDataReport', body, httpOptions)

  }
}
