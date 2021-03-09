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


  ongetRoomDetails(id, branchId, url):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'RoomDetails_GetOnRoomRegId';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'RoomRegistration_Id';
    ProcParams['strArgmt'] = id.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = branchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    return this.appService.post(url + '/CommonQuery/fnGetDataReportNew', body);
  }

  roomSettlement(main,roomSource,branchId,staffId, url):Observable<any> {
    let ListIssueSub = [];
    let Issue = {};
    let ListSettlmentSub = [];
    let Settlment = {};
    let SettlmentSub = {};

    Issue['IssuesCustName'] = main.CustomerName;
    Issue['IssuesMobile'] = main.Phone;
    Issue['IssuesTotal'] = main.totalAmount;
    Issue['BillSerId'] = main.billsericeID;
    Issue['BranchId'] = parseFloat(branchId || 0);
    Issue['IssuesSalesmanId'] = 0;
    Issue['IssuesTempOrderNo'] = 0;
    Issue['RoomRegistrationId'] = main.RoomRegistration_Id;
    Issue['IssuesOrderFrom'] = '';

    Settlment = {};
    Settlment['BillSerId'] = main.billsericeID;
    Settlment['AdvanceAmt'] = main.Registration_AdvanceAmt;
    Settlment['RestaurantTotal'] = 0;
    Settlment['HotalTotal'] = main.netAmount;
    Settlment['SettlementPayTerms'] = main.payTerms;
    Settlment['StaffId'] = parseFloat(staffId || 0);
    Settlment['SettlmentTotal'] = main.totalAmount;
    Settlment['NoOfDays'] = main.NoOfDays;

    // if (main.payTerms == 'CARD') {
    //   Settlment['CardNumber'] = this.cardSource.cardNo;
    //   Settlment['CardName'] = this.cardSource.holdername;
    //   Settlment['CardAmt'] = this.cardSource.cardAmt;
    //   Settlment['BankId'] = this.cardSource.bankId;
    // }
    Settlment['BranchId'] = parseFloat(branchId || 0);
    Settlment['DiscountAmt'] = main.discount;
    Settlment['SettlementBalaceAmt'] = main.billAmount;

   

    for (let i = 0; i < roomSource.length; i++) {

      SettlmentSub = {};
      SettlmentSub['RoomId'] = roomSource[i].RoomId;
      SettlmentSub['RoomRegistrationId'] = main.RoomRegistration_Id;
      SettlmentSub['RoomRent'] = roomSource[i].Rate;
      SettlmentSub['SettlmentSubAmount'] = roomSource[i].Rate + ((roomSource[i].Rate * roomSource[i].RoomType_Tax) / 100);
      SettlmentSub['RoomPerRentBeforeTax'] = roomSource[i].Rate;
      SettlmentSub['RoomRegistrationId'] = main.RoomRegistration_Id;
      SettlmentSub['SettlmentSubTaxPers'] = roomSource[i].RoomType_Tax;
      SettlmentSub['SettlmentSubTaxAmt'] = (roomSource[i].Rate * roomSource[i].RoomType_Tax) / 100;

      SettlmentSub['SettlmentSubSgsttaxPers'] = roomSource[i].RoomType_Tax / 2;
      SettlmentSub['SettlmentSubSgsttaxAmt'] = ((roomSource[i].Rate * roomSource[i].RoomType_Tax) / 100) / 2
      SettlmentSub['SettlmentSubCgsttaxPers'] = roomSource[i].RoomType_Tax / 2;
      SettlmentSub['SettlmentSubCgsttaxAmt'] = ((roomSource[i].Rate * roomSource[i].RoomType_Tax) / 100) / 2
      SettlmentSub['SettlmentSubIgsttaxPers'] = roomSource[i].RoomType_Tax
      SettlmentSub['SettlmentSubIgsttaxAmt'] = 0;

      ListSettlmentSub.push(SettlmentSub);

    }
    Settlment['Issue'] = Issue;
    Issue['IssueSubDetail'] = ListIssueSub;
    Settlment['SettlmentSubDetail'] = ListSettlmentSub;
    let body = JSON.stringify(Settlment);

    return this.appService.post(url + '/Master/fnSettlmentBill', body);
  }
}
