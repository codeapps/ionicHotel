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

  getIdentfications(url):Observable<any>  {
    return this.appService.get(url + '/GetRepository/getIdentfications?terms=' + '')
  }

  onRoomInsert(roomMain, sub, branchId, url):Observable<any>  {
    let RoomReg = {};

    RoomReg['RoomRegistrationId'] = roomMain.id;
    RoomReg['CustomerName'] = roomMain.custName;
    RoomReg['CustAddress'] = roomMain.address;
    RoomReg['Email'] = roomMain.mail;
    RoomReg['Phone'] = String(roomMain.mobile);
    RoomReg['IdentificationId'] = parseFloat(<any>roomMain.idProof || 0);
    RoomReg['Identification'] = roomMain.idDescription;
    RoomReg['CheckInDate'] = roomMain.checkInDate;
    RoomReg['CheckoutDate'] = roomMain.checkOutDate;
    RoomReg['Childs'] = parseFloat(<any>roomMain.child || 0);
    RoomReg['Adults'] = parseFloat(<any>roomMain.adult || 0);
    RoomReg['NoOfDays'] = parseFloat(<any>roomMain.noofDays || 0);
    RoomReg['RoomBookingId'] = parseFloat(<any>roomMain.bookingId || 0);
    RoomReg['RegistrationAdvanceAmt'] = parseFloat(<any>roomMain.preAmount || 0);
    RoomReg['BranchId'] = parseFloat(branchId || 0);

    let ListRoomRegDtl = [];
    for (const iterator of sub) {
      let RoomregDtl = {};
      RoomregDtl['RoomId'] = parseFloat((iterator.Room_Id) || 0);
      RoomregDtl['Rate'] = parseFloat((iterator.RoomType_Rent) || 0);
      RoomregDtl['RegistrationFlag'] = 'No';
      ListRoomRegDtl.push(RoomregDtl);
    }
    RoomReg['RoomRegistrationDetails'] = ListRoomRegDtl;
        
    let body = JSON.stringify(RoomReg);
    
   return this.appService.post(url + '/Master/fnSaveRoomRegistration', body)
  }

  ongetBookedRooms(keyword, branchId, url):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'RoomSettlment_Gets';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'strSearch';
    ProcParams['strArgmt'] = keyword;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = branchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    return this.appService.post(`${url}/CommonQuery/fnGetDataReportNew`, body)
  }

  getBillSerice(url):Observable<any> {
    return this.appService.get(url + '/GetRepository/GetBillSerice');
  }
}
