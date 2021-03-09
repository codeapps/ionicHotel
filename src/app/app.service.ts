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
export class AppService {

  constructor( public http: HttpClient) { }

  public post(url: string, body: string | object):Observable<any> {
    return this.http.post(url, body, httpOptions);
  }

  public get(url?: string):Observable<any> {
    return this.http.get(url);
  }

  onSettings(url):Observable<any> {

      let ServiceParams = {};
      ServiceParams['strProc'] = 'Setting_GetValues';
  
      let oProcParams = [];
  
      let body = JSON.stringify(ServiceParams);
  
      return this.post(url + '/CommonQuery/fnGetDataReportNew', body)
  }

  getBillSerice(url):Observable<any> {
    return this.get(url + '/GetRepository/GetBillSerice');
  }
}
