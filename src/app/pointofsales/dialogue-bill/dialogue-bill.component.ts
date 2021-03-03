import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/app.service';
import { BillPrintComponent } from 'src/app/print/bill-print/bill-print.component';


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

  constructor(navParams: NavParams, private appService: AppService,
    storage: Storage,
    private router: Router,
    public modalctl: ModalController,
    private toastController: ToastController) {
    this.reportItems = navParams.data[0];
    this.Kotdetails = navParams.data[1];
   
    storage.forEach((val, key) => {
      if (key == 'mainurllink') 
      this.baseApiUrl = val;
      else if (key == 'SessionBranchId')
      this.dBranchId = val;
      else if (key == 'SessionStaffId')
      this.staffId = val;
    }).finally(() => {
      this.AccoundHeadGet();
    })
    
   
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

    this.appService.get(this.baseApiUrl + '/GetRepository/GetBillSerice')
      .subscribe(result => {
      this.billserice = result;
      this.billSerId = this.billserice[0].BillSerId;
    }, error => console.error(error));
  }

  AccoundHeadGet() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'AccoundHead_GetOnBank';

    let body = JSON.stringify(ServiceParams);
    this.appService.post(this.baseApiUrl + '/CommonQuery/fnGetDataReportNew', body)
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

    Issue['TableDetailId'] = this.Kotdetails.tbldetailId;
    Issue['TableId'] = this.Kotdetails.tblid;
    Issue['IssuesCustName'] = this.Kotdetails.Kot_CustName;
    Issue['IssuesMobile'] = this.Kotdetails.Kot_Mobile;
    Issue['IssuesTotal'] = Number(this.fnBillTotal());
    Issue['BillSerId'] = this.billSerId;
    Issue['BranchId'] = this.dBranchId;
    Issue['IssuesTempOrderNo'] = this.Kotdetails.Kot_TempOrderNo;
    Issue['KotId'] = 0;
    Issue['RoomId'] = this.Kotdetails.tblid;
    Issue['IssuesOrderFrom'] = this.Kotdetails.selectType;
    Issue['IssuesSalesmanId'] = this.Kotdetails.Kot_SalesmanId;
    Issue['IssuePayTerms'] = this.payments;
    
    Issue['IssuesDisPers'] = 0;
    Issue['IssuesDisAmt'] = 0;
    Issue['IssuesRof'] = 0;
    Issue['IssuesAtotal'] = this.fnBillTotal;
    Issue['IssuesBillNo'] = 0;
    Issue['UniqueNo'] = 0;
   
    // Issue['StaffId'] = this.staffId;

    // if (this.payments == 'CARD') {
    //   Issue['Issue_CardNo'] = this.CardNumber;
    //   Issue['Issue_CardName'] = this.CardName;
    //   Issue['Issue_CardAmt'] = this.fnBillTotal();
    //   Issue['Issue_Banker'] = this.BankID;
    // }
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
      IssueSub['IssuesSubQty'] = dQty;
      IssueSub['IssuesSubActualRate'] = dSelRate;
      IssueSub['IssuesSubTaxPercent'] = dTaxPers;
      IssueSub['ProductId'] = parseFloat((this.reportItems[j].ProductId) || 0);
      IssueSub['IssuesSubPurRate'] = parseFloat((this.reportItems[j].KotSub_ActualRate) || 0);
      IssueSub['IssuesSubMrp'] = parseFloat((this.reportItems[j].KotSub_MRP) || 0);
      IssueSub['BillSerId'] = this.billSerId;
      IssueSub['IssuesSubTaxAmt'] = dTaxAmt;
      IssueSub['IssuesSubAmt'] = dAmount;
      IssueSub['IssuesSubTaxId'] = parseFloat((this.reportItems[j].TaxId) || 0);
      IssueSub['IssuesSubSgsttaxPercent'] = parseFloat((this.reportItems[j].SGSTTaxPers) || 0);
      IssueSub['IssuesSubCgsttaxPercent'] = parseFloat((this.reportItems[j].CGSTTaxPers) || 0);
      IssueSub['IssuesSubIgsttaxPercent'] = parseFloat((this.reportItems[j].IGSTTaxPers) || 0);
      IssueSub['StoreBatchSlNo'] = 0;
      IssueSub['BranchId'] = this.dBranchId;

      IssueSub['IssuesSubSgsttaxAmt'] = dTaxAmt / 2;
        IssueSub['IssuesSubCgsttaxAmt'] = dTaxAmt / 2;
       
        IssueSub['StoreBatchSlNo'] = 0;
        IssueSub['IssuesSubFeildNo1'] = 0;
        IssueSub['IssuesSubFeildNo2'] = 0;
        IssueSub['IssuesSubDiscPerc'] = 0;
        IssueSub['IssuesSubDiscAmnt'] = 0;
        IssueSub['IssuesAtotal'] = dAmount;
        IssueSub['IssuesRof'] = 0;
      ListIssueSub.push(IssueSub);
      
    }

    Issue['IssueSubDetail'] = ListIssueSub;

    ListIssue.push(Issue);

    let body = JSON.stringify(Issue);


    var headers = new Headers();
    
    headers.append('Content-Type', 'application/json; charset=utf-8');
    this.appService.post(this.baseApiUrl + '/Master/fnSaveBill', body)
      .subscribe(
        result => {
          let report = result;

          this.payments = 'CASH';
          this.presentToast();
          this.printModal(report);
          this.modalctl.dismiss();
        }, error => {
          console.log(error);
        });
  }

  async printModal(report) {
    
    const billSerId =  report.BillSerId; // 1
    const billNo = report.IssuesBillNo; //493
    const uniqueNo = report.UniqueNo; // 503
    const printType = this.Kotdetails.selectType;
    const modal = await this.modalctl.create({
      component: BillPrintComponent,
      componentProps: {
        billSerId: billSerId,
        billNo:billNo,
        uniqueNo: uniqueNo,
        printType: printType,
      } 
      
    });
    return await modal.present();
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
