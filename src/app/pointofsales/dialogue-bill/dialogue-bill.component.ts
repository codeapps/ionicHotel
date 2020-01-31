import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'charset=utf-8'
  })
};

@Component({
  selector: 'app-dialogue-bill',
  templateUrl: './dialogue-bill.component.html',
  styleUrls: ['./dialogue-bill.component.scss'],
})
export class DialogueBillComponent implements OnInit {
  salesman: string;
  reportItems: any;
  Kotdetails: any;
  showSettled: boolean;
  billserice: any;
  baseApiUrl: any;
  billSerId: any;
  payments: any;
  Months: any;
  years = [];
  BankID: any;
  accoundHedGetData: any;
  CardNumber: any;
  CardName: any;
  dBranchId: any;
  staffId: any;

  constructor(navParams: NavParams, public http: HttpClient, private storage: Storage, private router: Router,
    public modalctl: ModalController,private toastController:ToastController) {
    this.reportItems = navParams.data[0];
    this.Kotdetails = navParams.data[1];
    this.storage.get('mainurllink').then((val) => {
      this.baseApiUrl = val;
      this.AccoundHeadGet();
    });
    this.storage.get('SessionBranchId').then((val) => {
      this.dBranchId = val;
    });
    this.storage.get('SessionStaffId').then((val) => {
      this.staffId = val;
    });
   
  }

  ngOnInit() {
    this.getFullyear();
    this.salesman = this.reportItems[0].AC_Name;
    this.payments = 'CASH';
    this.Months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  }

  getFullyear() {
    let date = new Date();
    let year = date.getFullYear().toString();
    let YY = parseFloat(year.slice(-2));;

    for (let i = YY; i < 50; i++) {
      let yearString = i.toString();
      this.years.push(yearString)
    }

  }
  async getBillSerice() {

    this.http.get(this.baseApiUrl + '/KOT/GetBillSerice').subscribe(result => {
      this.billserice = result;
      this.billSerId = this.billserice[0].BillSerId;
    }, error => console.error(error));
  }

  AccoundHeadGet() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'AccoundHead_GetOnBank';

    let body = JSON.stringify(ServiceParams);
    this.http.post<any>(this.baseApiUrl + '/fnGetDataReportNew', body, httpOptions)
      .subscribe(data => {

        this.accoundHedGetData = JSON.parse(data);
        this.BankID = this.accoundHedGetData[0].AC_Id;
      }, error => console.error(error));
  }


  OnPayments() {
    // console.log(this.billSerId);
    // console.log(this.payments);
    if (this.BankID == undefined && this.payments == 'CARD') {
      alert('Please Select Bank');
      return;
    }

    let ListIssue = [];
    let ListIssueSub = [];
    let Issue = {};
    let IssueSub = {};

    Issue['TableDetail_Id'] = this.Kotdetails.tbldetailId;
    Issue['Table_Id'] = this.Kotdetails.tblid;
    Issue['Issues_CustName'] = this.Kotdetails.Kot_CustName;
    Issue['Issues_Mobile'] = this.Kotdetails.Kot_Mobile;
    Issue['Issues_Total'] = this.fnBillTotal();
    Issue['BillSerId'] = this.billSerId;
    Issue['BranchId'] = this.dBranchId;
    Issue['Issues_TempOrderNo'] = this.Kotdetails.Kot_TempOrderNo;
    Issue['Kot_Id'] = this.Kotdetails.Kot_Id;
    Issue['Room_Id'] = 0;
    Issue['Issues_OrderFrom'] = this.Kotdetails.selectType;
    Issue['Issues_SalesmanId'] = this.Kotdetails.Kot_SalesmanId;
    Issue['Issue_PayTerms'] = this.payments;
    Issue['StaffId'] = this.staffId;

    if (this.payments == 'CARD') {
      Issue['Issue_CardNo'] = this.CardNumber;
      Issue['Issue_CardName'] = this.CardName;
      Issue['Issue_CardAmt'] = this.fnBillTotal();
      Issue['Issue_Banker'] = this.BankID;
    }
    let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
      totAmt = 0, dTotal = 0;

    for (let j = 0; j < this.reportItems.length; j++) {
      dQty = 0, dSelRate = 0, dAmount = 0;
      dQty = parseFloat((this.reportItems[j].KotSub_Qty) || 0);
      dSelRate = parseFloat((this.reportItems[j].KotSub_ActualRate) || 0);
      dTaxPers = parseFloat((this.reportItems[j].TaxPercent) || 0);
      dTaxAmt = (dSelRate * dTaxPers) / 100;
      dTaxAmt = (dQty * dTaxAmt);
      dAmount = (dQty * dSelRate) + (dTaxAmt);
      dTaxAmt = parseFloat((this.reportItems[j].KotSub_TaxAmt) || 0);
      IssueSub = {};
      IssueSub['IssuesSub_Qty'] = dQty;
      IssueSub['IssuesSub_ActualRate'] = dSelRate;
      IssueSub['IssuesSub_TaxPercent'] = dTaxPers;
      IssueSub['ProductId'] = parseFloat((this.reportItems[j].ProductId) || 0);
      IssueSub['IssuesSub_PurRate'] = parseFloat((this.reportItems[j].KotSub_ActualRate) || 0);
      IssueSub['IssuesSub_MRP'] = parseFloat((this.reportItems[j].KotSub_MRP) || 0);
      IssueSub['BillSerId'] = this.billSerId;
      IssueSub['IssuesSub_TaxAmt'] = dTaxAmt;
      IssueSub['IssuesSub_Amt'] = dAmount;
      IssueSub['IssuesSub_TaxId'] = parseFloat((this.reportItems[j].TaxId) || 0);
      IssueSub['IssuesSub_SGSTTaxPercent'] = parseFloat((this.reportItems[j].SGSTTaxPers) || 0);
      IssueSub['IssuesSub_CGSTTaxPercent'] = parseFloat((this.reportItems[j].CGSTTaxPers) || 0);
      IssueSub['IssuesSub_IGSTTaxPercent'] = parseFloat((this.reportItems[j].IGSTTaxPers) || 0);
      IssueSub['Store_BatchSlNo'] = 0;
      IssueSub['BranchId'] = this.dBranchId;
      ListIssueSub.push(IssueSub);

    }

    Issue['IssueSubDetail'] = ListIssueSub;

    ListIssue.push(Issue);

    let body = JSON.stringify(Issue);


    var headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=utf-8');
    this.http.post(this.baseApiUrl + '/KOT/fnSaveBill', body, httpOptions)
      .subscribe(
        result => {
          let report = result;
          this.payments = 'CASH';
          this.presentToast();
          this.modalctl.dismiss();
        }, error => {
          console.log(error);
        });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Payments Successfully!.',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  OnClose() {
    this.modalctl.dismiss();

  }

  kotAdd() {
    // console.log(this.Kotdetails);
    this.modalctl.dismiss();
    let queryParam = {
      tblid: this.Kotdetails.tblid, tbldetailId: this.Kotdetails.tbldetailId,
      selectType: this.Kotdetails.selectType, custName: this.Kotdetails.Kot_CustName, Mobile: this.Kotdetails.Kot_Mobile,
      SalesmanId: this.Kotdetails.Kot_SalesmanId
    }
    this.router.navigate(['pointofsales/order', queryParam]);
  }



  fnBillTotal() {

    let dQty, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
      totAmt = 0, dTotal = 0, dBeforeTaxtotal = 0, dRowAmtBeforeTax = 0, dtotal = 0;

    for (let j = 0; j < this.reportItems.length; j++) {
      dSelRate = 0, dAmount = 0;

      dTotal = parseFloat((this.reportItems[j].KotSub_Amt) || 0) + dTotal;
    }

    return dTotal.toFixed(3);
  }

}
