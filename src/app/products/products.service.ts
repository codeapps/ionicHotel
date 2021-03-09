import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'charset=utf-8'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(public http: HttpClient) { }

  public onGetProduct(keyword, branchId, url):Observable<any> {
    return this.http.get(`${url}/GetRepository/GetProductList?terms=${keyword}&branchId=${branchId}`)
  }

  public onGetCategory(url):Observable<any> {
    return this.http.get(`${url}/GetRepository/SearchCategory?terms`)
  }

  public onGetTax(url):Observable<any> {
    return this.http.get(`${url}/GetRepository/GetTaxGroups`)
  }


  public onGetManufacture(url):Observable<any> {
    var ServiceParams = {};
    ServiceParams['strProc'] = "Manufacture_Gets";

    var oProcParams = [];

    var ProcParams = {};
    ProcParams["strKey"] = "Manufacture_Name";
    ProcParams["strArgmt"] = '';
    oProcParams.push(ProcParams);

    ServiceParams["oProcParams"] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    return this.http.post(`${url}/CommonQuery/fnGetDataReport`, body, httpOptions)
  }

  onProductGet(url, productId, branchId):Observable<any> {
    return this.http.get(url + '/GetRepository/Product_GetOnProductId?dProductId=' + productId + '&branchId=' + branchId);
                
  }
  
  onSave(body, url):Observable<any>  {
    return this.http.post(`${url}/PostRepository/PostProduct`, body, httpOptions)
  }
}
