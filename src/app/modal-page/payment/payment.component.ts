import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/app.service';
import { ThermalPrintComponent } from 'src/app/print/thermal-print/thermal-print.component';
import { ThermalPrintService } from 'src/app/print/thermal-print/thermal-print.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @Input() main: any;
  @Input() issueSub: any[];
  @Input() activeType: any;

  baseApiUrl: string;
  dBranchId: string;
  salesmanId: string;
  payTerms: string = 'CASH';
  billserice: any[] = [];
  billSeriesId: any;
  showlist: boolean = false;
  thermalPrintOption: any;
  constructor(private modal: ModalController, public alertController: AlertController,
    private appService: AppService, private storage: Storage,
    private toastController: ToastController,
    private router: Router,
    private thermalService: ThermalPrintService,
    private modalController: ModalController) {
      this.thermalService.onPrinterGet()
        .subscribe(res => {
        this.thermalPrintOption = res;
        })
       
    this.storage.forEach((value, key) => {
      if (key == 'mainurllink') {
        this.baseApiUrl = value;
      } else if (key == 'SessionBranchId') {
        this.dBranchId = value;
      } else if (key == 'SessionStaffId') {
        this.salesmanId = value;
      } else if (key == 'printer') {
        this.thermalPrintOption = value;
      
      }
    }).finally(() => {
      this.getBillSerice();
     
    });
    
  }

  ngOnInit() {
    
  }

  onClose() {
    this.modal.dismiss()
  }

  async onAddCustomer() {
    const modal = await this.modalController.create({
      component: AddCustomerComponent,
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.main.custId = data.AC_Id;
      this.main.cusName = data.AC_Name;
    }
  }

  onRemove() {
    this.main.custId = '';
    this.main.cusName = 'cash';
  }
  
  onPrinterValidate() {
    
    if (this.thermalPrintOption.defaultPrint && this.thermalPrintOption.btAddress) {
      this.fnDirectBill();
    } else {
      this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      // header: 'Printer',
      subHeader: 'Warning!',
      message: 'Your Printer is offline.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'ion-text-capitalize',
        handler: () => {
         
        }
      }, {
          text: 'Continue',
          cssClass: 'ion-text-capitalize',
        handler: () => {
          this.fnDirectBill();
          },
          
        }
        ]
    });

    await alert.present();
  }

  fnDirectBill() {
     
    let Issue = {};
    Issue['TableId'] = Number(this.activeType.id);
    Issue['TableDetailId'] = Number(this.activeType.detailId);
    Issue['BillSerId'] = this.billSeriesId;
    Issue['IssuesCustName'] = this.main.cusName;
    Issue['AcId'] = Number(this.main.custId);
    Issue['IssuesMobile'] = this.main.phone.toString();
    Issue['IssuesTotal'] = this.main.paid;
    Issue['BranchId'] = Number(this.dBranchId);
    Issue['IssuesSalesmanId'] = this.salesmanId;
    Issue['IssuePayTerms'] = this.payTerms;
    Issue['IssuesOrderFrom'] = 'Table';
    Issue['IssuesDisPers'] = 0;
    Issue['IssuesDisAmt'] = 0;
    Issue['IssuesRof'] = 0;
    Issue['IssuesBillNo'] = Number(this.main.IssuesBillNo);
    Issue['UniqueNo'] = Number(this.main.UniqueNo);
    Issue['IssuesAtotal'] = this.main.paid;
    let issueSubAll = [];
    let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
      dfinalTotal = 0, dRowAmtBeforeTax = 0, dSelRateBeforeTax = 0, ProductDisc = 0, ProdDicVal = 0;
    let dDisPer = 0, dDisAmt = 0;
    let finalPers = 0;
    for (const item of this.issueSub) {
      dSelRate = 0, dAmount = 0;
      dQty = 0, dSelRate = 0, dAmount = 0;
      dSelRateBeforeTax = 0; dTaxAmt = 0;
      dQty = parseFloat((item.qty) || 0);
      dSelRate = parseFloat((item.rate) || 0);
      dTaxPers = parseFloat((item.tax) || 0);
      dDisPer = parseFloat(item.disc || 0);
      dSelRateBeforeTax = dSelRate;
      dRowAmtBeforeTax = dQty * dSelRateBeforeTax;
      dDisAmt = (dRowAmtBeforeTax * dDisPer) / 100;
      dRowAmtBeforeTax = dRowAmtBeforeTax - dDisAmt;
      let percval = (dRowAmtBeforeTax * finalPers) / 100;
      dRowAmtBeforeTax = dRowAmtBeforeTax - percval;
      dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
      dAmount = dRowAmtBeforeTax + dTaxAmt;
      dfinalTotal = (dfinalTotal + dAmount);

      let IssueSub = {};
      IssueSub['IssuesSubQty'] = dQty;
      IssueSub['IssuesSubActualRate'] = dSelRate;
      IssueSub['IssuesSubTaxPercent'] = dTaxPers;
      IssueSub['ProductId'] = parseFloat(item.productId);
      IssueSub['IssuesSubPurRate'] = parseFloat((item.rate) || 0);
      IssueSub['IssuesSubMrp'] = parseFloat((item.mrp) || 0);
      IssueSub['IssuesSubTaxAmt'] = dTaxAmt;
      IssueSub['IssuesSubAmt'] = dAmount;
      IssueSub['BillSerId'] = this.billSeriesId;
      IssueSub['IssuesSubTaxId'] = parseFloat((item.TaxId) || 0);
      IssueSub['IssuesSubSgsttaxPercent'] = parseFloat((item.SGSTTaxPers) || 0);
      IssueSub['IssuesSubCgsttaxPercent'] = parseFloat((item.CGSTTaxPers) || 0);
      IssueSub['IssuesSubIgsttaxPercent'] = parseFloat((item.IGSTTaxPers) || 0);
      IssueSub['IssuesSubSgsttaxAmt'] = dTaxAmt / 2;
      IssueSub['IssuesSubCgsttaxAmt'] = dTaxAmt / 2;
      IssueSub['IssuesSubIgsttaxAmt'] = 0;
      IssueSub['BranchId'] = parseFloat(this.dBranchId);
      IssueSub['StoreBatchSlNo'] = 0;
      IssueSub['IssuesSubFeildNo1'] = 0;
      IssueSub['IssuesSubFeildNo2'] = 0;
      IssueSub['IssuesSubDiscPerc'] = dDisPer;
      IssueSub['IssuesSubDiscAmnt'] = dDisAmt;
      issueSubAll.push(IssueSub)
    }
    Issue['IssueSubDetail'] = issueSubAll;
    // ListIssue.push(issue);
    let body = JSON.stringify(Issue);
    
    this.appService.post(this.baseApiUrl + '/Master/fnSaveBill', body)
      .subscribe(res => {
        let itemSub = res.IssueSubDetail;
        
        itemSub.map(x => {
          let findProduct = this.issueSub.find(y => y.productId == x.ProductId);
          if (findProduct)
            x.itemName = findProduct.name;
        })
        
        if (this.thermalPrintOption.defaultPrint && this.thermalPrintOption.btAddress)
          this.onPrintThermal(res, itemSub);
        else {
          this.modal.dismiss(true);
          this.presentToast(`${res.IssuesBillNo} Bill Saved Successfully !!`);
          // this.router.navigate(['/posdevice']);
        }
          
    })
    //   issueSub: any[];
    // activeType: any;
  }

  getBillSerice() {

    this.appService.getBillSerice(this.baseApiUrl).toPromise()
      .then(result => {
        this.billserice = result;
        if (this.billserice.length)
          this.billSeriesId = this.billserice[0].BillSerId;
      }, error => console.error(error));
  }

  async onPrintThermal(items, itemSub) {
   
    
    let billseries = this.billserice.find(x => x.BillSerId == items.BillSerId);
    let billseriesName = '';
    if (billseries)
      billseriesName = billseries.BillSerPrefix;
    
    let issuemain = {
      billseriesName: billseriesName,
      IssuePayTerms: items.IssuePayTerms,
      IssuesAtotal: items.IssuesAtotal,
      IssuesBillNo: items.IssuesBillNo,
      IssuesCustName: items.IssuesCustName,
      IssuesDate: items.IssuesDate,
      IssuesDisAmt: items.IssuesDisAmt,
      IssuesDisPers: items.IssuesDisPers,
      IssuesMobile: items.IssuesMobile,
      IssuesOrderFrom: items.IssuesOrderFrom,
      IssuesTotal: items.IssuesTotal,
    }
    let listSubAll = [];
    for (const sub of itemSub) {
      let issueSub = {
        ItemName: sub.itemName,
        IssuesSubQty: sub.IssuesSubQty,
        IssuesSubActualRate: sub.IssuesSubActualRate,
        IssuesSubTaxPercent: sub.IssuesSubTaxPercent,
        IssuesSubPurRate: sub.IssuesSubPurRate,
        IssuesSubMrp: sub.IssuesSubMrp,
        IssuesSubTaxAmt: sub.IssuesSubTaxAmt,
        IssuesSubAmt: sub.IssuesSubAmt,
        BillSerId: sub.BillSerId,
        IssuesSubTaxId: sub.IssuesSubTaxId,
        IssuesSubSgsttaxPercent: sub.IssuesSubSgsttaxPercent,
        IssuesSubCgsttaxPercent: sub.IssuesSubCgsttaxPercent,
        IssuesSubIgsttaxPercent: sub.IssuesSubIgsttaxPercent,
        IssuesSubSgsttaxAmt: sub.IssuesSubSgsttaxAmt,
        IssuesSubCgsttaxAmt: sub.IssuesSubCgsttaxAmt,
        IssuesSubIgsttaxAmt: sub.IssuesSubIgsttaxAmt,
        IssuesSubDiscPerc: sub.IssuesSubDiscPerc,
        IssuesSubDiscAmnt: sub.IssuesSubDiscAmnt
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
    this.modal.dismiss(true);
    
    
  }

  async presentToast(mgs) {
    const toast = await this.toastController.create({
      message: mgs,
      duration: 2000
    });
    toast.present();
  }

}
