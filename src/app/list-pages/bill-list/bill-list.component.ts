import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ThermalPrintComponent } from 'src/app/print/thermal-print/thermal-print.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss'],
})
export class BillListComponent implements OnInit {
  basicApi: string = "";
  branchId: string = "";
  billserice: any[] = [];
  billSource: any[] = [];
  strBillSerId: any = 0;
  fromDate = new Date(new Date().setDate(1)).toISOString();
  toDate = new Date().toISOString();
  constructor(
    private appService: AppService,
    
    private modalController: ModalController,
    private router:Router,
     storage: Storage, private datePipe:DatePipe) {
    storage.forEach((val, key) => {
      if (key=="mainurllink") {
        this.basicApi = val;
      } else if (key=="SessionBranchId") {
        this.branchId = val;
      }
    }).finally(() => {
      this.getBillSerice();
    })
   }

  ngOnInit() {}

  getBillSerice() {
    this.appService.getBillSerice(this.basicApi)
      .subscribe(result => {
        this.billserice = result;
        this.strBillSerId = this.billserice[0].BillSerId;
        this.onBillGets('')
      }, error => console.error(error));
  }

  onBillGets(keyword) {
    const bookFromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    const bookToDateDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    let ServiceParams = {};
    ServiceParams['strProc'] = 'IssuesGetOn_Search';

    let oProcParams = [];

    let ProcParams = {};

    ProcParams['strKey'] = 'Fromdate';
    ProcParams['strArgmt'] = bookFromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = bookToDateDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'search';
    ProcParams['strArgmt'] = keyword;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSerId';
    ProcParams['strArgmt'] = this.strBillSerId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
   
    
    this.appService.post(this.basicApi + "/CommonQuery/fnGetDataReportNew", body)
      .subscribe(res => {
        this.billSource = JSON.parse(res);
        // console.log(this.billSource);
      }, err => console.error(err));
  }

  onPrint(bill) {
    
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Issues_CopyBillNoProductGroupwise';
  
    let oProcParams = [];
    
    let ProcParams = {};
    ProcParams['strKey'] = 'BillSerId';
    ProcParams['strArgmt'] = bill.BillSerId.toString();
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'Issues_BillNo';
    ProcParams['strArgmt'] = bill.Issues_BillNo.toString();
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'Unique_No';
    ProcParams['strArgmt'] = bill.Unique_No.toString();
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'Issues_OrderFrom';
    ProcParams['strArgmt'] = bill.Issues_OrderFrom.toString();
    oProcParams.push(ProcParams);
  
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post(`${this.basicApi}/CommonQuery/fnGetDataReportReturnMultiTable`, body)
      .toPromise().then(res => {
        let jsonobj = JSON.parse(res);
       
        let JsonIssueSubDetailsInfo = JSON.parse(jsonobj[1]);
        let JsonIssueTaxInfo =JSON.parse(jsonobj[2]);
        let JsonBranchInfo = JSON.parse(jsonobj[3])[0];
        let JsonIssueInfo = JSON.parse(jsonobj[0]);
      
        this.onPrintThermal(bill, JsonIssueSubDetailsInfo);
    })
  }


  async onPrintThermal(items, itemSub) {
   
    
    let billseries = this.billserice.find(x => x.BillSerId == items.BillSerId);
    let billseriesName = '';
    if (billseries)
      billseriesName = billseries.BillSerPrefix;
    
    let issuemain = {
      billseriesName: billseriesName,
      IssuePayTerms: items.Issue_PayTerms,
      IssuesAtotal: items.Issues_ATotal,
      IssuesBillNo: items.Issues_BillNo,
      IssuesCustName: items.Issues_CustName,
      IssuesDate: items.Issues_Date,
      IssuesDisAmt: items.Issues_DisAmt,
      IssuesDisPers: items.Issues_DisPers,
      IssuesMobile: items.Issues_Mobile,
      IssuesOrderFrom: items.Issues_OrderFrom,
      IssuesTotal: items.Issues_Total,
    }
    let listSubAll = [];
    for (const sub of itemSub) {
      let issueSub = {
        ItemName: sub.ProductName,
        IssuesSubQty: sub.IssuesSub_Qty,
        IssuesSubActualRate: sub.IssuesSub_ActualRate,
        IssuesSubTaxPercent: sub.IssuesSub_TaxPercent,
        IssuesSubPurRate: sub.IssuesSub_PurRate,
        IssuesSubMrp: sub.IssuesSub_MRP,
        IssuesSubTaxAmt: sub.IssuesSub_TaxAmt,
        IssuesSubAmt: sub.IssuesSub_Amt,
        BillSerId: sub.BillSerId,
        IssuesSubTaxId: sub.IssuesSub_TaxId,
        IssuesSubSgsttaxPercent: sub.IssuesSub_SGSTTaxPercent,
        IssuesSubCgsttaxPercent: sub.IssuesSub_IGSTTaxPercent,
        IssuesSubIgsttaxPercent: sub.IssuesSub_CGSTTaxPercent,
        IssuesSubSgsttaxAmt: sub.IssuesSub_SGSTTaxAmt,
        IssuesSubCgsttaxAmt: sub.IssuesSub_CGSTTaxAmt,
        IssuesSubIgsttaxAmt: sub.IssuesSub_IGSTTaxAmt,
        IssuesSubDiscPerc: sub.IssuesSub_DiscPerc,
        IssuesSubDiscAmnt: sub.IssuesSub_DiscAmnt
      }
      listSubAll.push(issueSub)
    }
    
    const modal = await this.modalController.create({
      component: ThermalPrintComponent,
      cssClass: 'thermal-print',
      backdropDismiss: false,
      componentProps: {
        printMain: issuemain,
        printSub: listSubAll
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    
  }

  onAnchorClick(bill) {
   
    
    this.router.navigate(['/posdevice',
      {
        BillSerId: bill.BillSerId, BillNo: bill.Issues_BillNo,
        UniqueNo: bill.Unique_No, name: bill.Issues_OrderFrom,  type: 'Edit Bill'
      }]);
  }
}
