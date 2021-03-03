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
export class PosAllService {

  constructor(public http: HttpClient) { }

  onGetTable(url, branchId):Observable<any> {
    return this.http.get(url + '/GetRepository/GetTable?table&branchId=' + branchId)
  }

  onGetTableDtls(url, branchId):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'TableDetails_GetOnAll';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
   
    let body = JSON.stringify(ServiceParams);
    return this.http.post(url + '/CommonQuery/fnGetDataReportNew', body, httpOptions)
  }

  onGetRooms(url, branchId):Observable<any> {
    return this.http.get(url + '/GetRepository/getRooms?terms&branchId=' + branchId)
  }

  onSelectTableDetail(url, tableDtailId):Observable<any>  {

    return this.http.get(url + '/GetRepository/TableDetailsGet_OnName?TableDetailId=' + tableDtailId);
  }

  onRoomGet(url, roomid):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'RoomGetOn_RoomId';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'RoomId';
    ProcParams['strArgmt'] = roomid.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    return this.http.post(url + '/CommonQuery/fnGetDataReportNew', body, httpOptions)
  }

  onKotBillGetOnRoomId(url, roomId):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'KotRoom_GetOnTempInvoiceNo';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'RoomId';
    ProcParams['strArgmt'] = roomId.toString();
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.http.post(url + '/CommonQuery/fnGetDataReportNew', body, httpOptions)
  }

  onKotBillGetOnTableDetailId(url, id):Observable<any> {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Kot_GetOnTempInvoiceNo';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'TableDetails_Id';
    ProcParams['strArgmt'] = id;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.http.post(url + '/CommonQuery/fnGetDataReportNew', body, httpOptions)
  }

  onProductCodeGet(url, branchId, code):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'getProductWithoutBranchId';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptOne';
    let oProcParams = [];
    let ProcParams = {};

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsstrSearch';
    ProcParams['strArgmt'] = code;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = String(branchId);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsOrderBy';
    ProcParams['strArgmt'] = 'order by ItemCode';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    return this.http.post(url + '/CommonQuery/fnGetDataReportFromScriptJsonFile', body, httpOptions)
  }

  onProductGet(url, productId, branchId):Observable<any> {
    return this.http.get(url + '/GetRepository/Product_GetOnProductId?dProductId=' + productId + '&branchId=' + branchId);
                
  }
}
