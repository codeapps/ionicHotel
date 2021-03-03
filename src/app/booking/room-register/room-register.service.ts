import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class RoomRegisterService {
  
  constructor( private appService: AppService) { 
  }

  onGetFloor(url, branchid):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Rooms_GetsAll';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = branchid.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    return this.appService.post(url + '/CommonQuery/fnGetDataReportReturnMultiTable', body)
  }
}
