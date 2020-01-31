import { Component, OnInit } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ActionSheetController, LoadingController, ToastController } from '@ionic/angular';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'charset=utf-8'
  })
};

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.scss'],
})
export class OrderdetailsComponent implements OnInit {
  baseApiUrl: any;
  category: any;
  product: any;
  active: boolean;
  orderlist = [];
  lish_show: boolean;
  search: boolean;
  searchresult: any;
  tableId: any;
  tableDetailId: any;
  SalesmanId: any;
  custName: any;
  Mobile: any;
  selectType: any;
  dBranchId: any;
  strKotPrintType: any;
  strInclusiveCalRoom: any;
  constructor(
    private storage: Storage,
    public http: HttpClient,
    private router: Router,
    private activeroute: ActivatedRoute,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController) {
    activeroute.params.subscribe(params => {
      this.tableId = params.tblid;
      this.tableDetailId = params.tbldetailId;
      this.SalesmanId = params.SalesmanId;
      this.custName = params.custName;
      this.Mobile = params.Mobile;
      this.selectType = params.selectType;
    })
    this.storage.get('mainurllink').then((val) => {
      this.baseApiUrl = val;
      this.getCategory();
      this.fnSettings();
    });
    this.storage.get('SessionBranchId').then((val) => {
      this.dBranchId = val;
    });

  }

  ngOnInit() { }


  async fnSettings() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Setting_GetValues';

    let oProcParams = [];

    let body = JSON.stringify(ServiceParams);

    await this.http.post<any>(this.baseApiUrl + '/fnGetDataReportNew', body, httpOptions)
      .subscribe(data => {
        let settingGet = JSON.parse(data);
        settingGet.forEach(element => {

          if (element.KeyValue == 'KotPrintType') {
            this.strKotPrintType = element.Value;
          } else if (element.KeyValue == 'MRPINCLUSIVESALES') {
            this.strInclusiveCalRoom = element.Value;
          }


        });
        // this.fnBillTotal();
      }, error => console.error(error));
  }

  getCategory() {
    this.http.get(this.baseApiUrl + '/SerchCategory?term=' + '').subscribe(result => {
      this.category = result;
      this.getProduct(this.category[0], 0);
    }, error => console.error(error));

  }

  async getProduct(category, strIndex) {
    const loading = await this.loadingController.create({
      message: 'Loading',
    });
    await loading.present();
    this.active = category.CategoryID;
    // this.GetImage();
    let CategorySelect = strIndex;
    this.http.get(this.baseApiUrl + '/Product_GetOnCategoryId?dCategoryId=' + category.CategoryID)
      .subscribe(result => {
        // console.log(result);
        this.product = result;
        this.searchresult = this.product;
        loading.dismiss();
      }, error => {
        loading.dismiss();
      });

  }

  fnSearch(event) {
    let keyword = event.target.value;
    //  let datasearch = this.product.map(data => data.ProductName).includes(keyword);
    let datadearch = this.searchresult.filter((data) => {
      return data.ProductName.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
    });

    this.product = datadearch;
  }

  

  // getImage(img) {
  //   console.log(img);
  //   let image = 'http://themes.potenzaglobalsolutions.com/html/the-zayka/images/gallery/08.jpg';
  //   // console.log(image);
  //   return image;
  // }
  Oncancel() {
    this.product = [];
    this.search = false;
    this.product = this.searchresult;
  }
  async presentAlertPrompt(Id, name, qty) {
    const alert = await this.alertController.create({
      subHeader: name,
      inputs: [
        {
          name: 'Qty',
          type: 'number',
          placeholder: 'type quantity..',
          value: qty
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.OnProductDetails(Id, data.Qty);
          }
        }
      ],
      backdropDismiss: false,
    });
    setTimeout(() => {
      alert.present().then(() => {
        const firstInput: any = document.querySelector('ion-alert input');
        firstInput.focus();
        return;
      });
    }, 300);
    // await alert.present();
  }
  getProductDetails(Id, Name) {
    let sameId = true;
    let qty = 1;
    if (this.orderlist.length !== 0) {
      this.orderlist.forEach(data => {
        if (data.ProductId == Id) {
          qty = data.KotSub_Qty;
          this.presentAlertPrompt(Id, Name, qty);
          sameId = false;
        }
      });
    }
    if (sameId) {
      this.presentAlertPrompt(Id, Name, qty);
    }

  }

  async presentActionSheet(data) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change Order',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.OnRemove(data);
        }
      }, {
        text: 'Edit',
        icon: 'create',
        handler: () => {
          this.presentAlertPrompt(data.ProductId, data.ProductName, data.KotSub_Qty);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  getTotalQty() {
    return this.orderlist.map(data => data.KotSub_Qty).reduce((toal, current) => parseFloat(toal) + parseFloat(current));
  }
  getTotalAmount() {
    return this.orderlist.map(data => data.KotSub_Qty * data.KotSub_ActualRate).reduce((toal, current) => toal + current);
  }
  OnRemove(data) {
    const index: number = this.orderlist.indexOf(data);
    if (index !== -1) {

      this.orderlist.splice(index, 1);
    }
  }

  OnProductDetails(Id, Qty) {
    let newAttribute = {};
    let sameId = true;
    if (this.orderlist.length !== 0) {
      this.orderlist.forEach(data => {
        if (data.ProductId == Id) {
          this.OnUpdateList(data, Qty);
          sameId = false;
        }
      });
    }

    if (sameId) {
      this.http.get(this.baseApiUrl + '/Product_GetOnProductId?dProductId=' + Id)
        .subscribe(result => {
          let jsonData = <any>result;
          newAttribute = {
            ProductId: jsonData[0].ProductId, ProductName: jsonData[0].ProductName,
            KotSub_ActualRate: jsonData[0].Sel_Rate, KotSub_TaxPercent: jsonData[0].TaxPercent,
            KotSub_MRP: jsonData[0].MRP_Rate, KotSub_Qty: Qty
          };
          this.orderlist.push(newAttribute);
        });
    }


  }

  OnUpdateList(data, qty) {

    const index: number = this.orderlist.indexOf(data);
    let ListProducts = [];
    let newAttribute = {};
    for (let i = 0; i < this.orderlist.length; i++) {
      if (i == index) {
        newAttribute = {
          ProductId: data.ProductId, ProductName: data.ProductName,
          KotSub_ActualRate: data.KotSub_ActualRate, KotSub_TaxPercent: data.KotSub_TaxPercent,
          KotSub_MRP: data.KotSub_MRP, KotSub_Qty: qty
        };
      } else {
        newAttribute = this.orderlist[i];
      }
      ListProducts.push(newAttribute);
    }
    this.orderlist = ListProducts;
  }

  OnBack() {
    this.router.navigate(['/pointofsales']);
  }

  async fnkotSave() {

    const loading = await this.loadingController.create({
      message: 'Loading',
    });
    await loading.present();

    let ListKotMain = [];
    let ListKotSub = [];
    let KotMain = {};
    let KotSub = {};
    let Kot_CustName = '';
    let Kot_Mobile = '';

    if (this.selectType == 'Room') {
      KotMain['Room_Id'] = 0;
    } else {
      KotMain['Table_Id'] = this.tableId;
      KotMain['TableDetail_Id'] = this.tableDetailId;
    }
    if (this.custName == undefined || this.custName == null) {

      Kot_CustName = '';
    }
    if (this.Mobile == undefined || this.Mobile == null) {

      Kot_Mobile = '';
    }
    KotMain['Kot_CustName'] = Kot_CustName;
    KotMain['Kot_Mobile'] = Kot_Mobile;
    KotMain['Kot_Total'] = this.fnKotTotal();
    KotMain['Kot_BranchId'] = this.dBranchId;
    KotMain['Kot_SalesmanId'] = this.SalesmanId;
    KotMain['Kot_OrderFrom'] = this.selectType;

    let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
      totAmt = 0, dfinalTotal = 0, dBeforeTaxtotal = 0, dRowAmtBeforeTax = 0, dtotal = 0;

    for (let j = 0; j < this.orderlist.length; j++) {

      dSelRate = 0, dAmount = 0; dfinalTotal = 0;
      dQty = 0, dSelRate = 0, dAmount = 0;
      dtotal = 0; dTaxAmt = 0;

      dQty = parseFloat((this.orderlist[j].KotSub_Qty) || 0);

      dSelRate = parseFloat((this.orderlist[j].KotSub_ActualRate) || 0);
      dTaxPers = parseFloat((this.orderlist[j].KotSub_TaxPercent) || 0);
      if (this.strInclusiveCalRoom == 'Yes') {
        dtotal = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));

      }
      dRowAmtBeforeTax = dQty * dtotal;
      dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
      dAmount = dRowAmtBeforeTax + dTaxAmt;

      this.orderlist[j].KotSub_Amt = dAmount.toFixed(3);
      this.orderlist[j].KotSub_TaxAmt = dTaxAmt.toFixed(3);
      dfinalTotal = dAmount + dfinalTotal;

      KotSub = {};
      KotSub['KotSub_Qty'] = dQty;
      KotSub['KotSub_ActualRate'] = dSelRate;
      KotSub['KotSub_TaxPercent'] = dTaxPers;
      KotSub['ProductId'] = parseFloat((this.orderlist[j].ProductId) || 0);
      KotSub['KotSub_PurRate'] = parseFloat((this.orderlist[j].KotSub_ActualRate) || 0);
      KotSub['KotSub_MRP'] = parseFloat((this.orderlist[j].KotSub_MRP) || 0);
      KotSub['KotSub_TaxAmt'] = dTaxAmt;
      KotSub['KotSub_Amt'] = dfinalTotal;
      ListKotSub.push(KotSub);
    }

    KotMain['KotSubDetails'] = ListKotSub;

    ListKotMain.push(KotMain);

    let body = JSON.stringify(KotMain);
    this.http.post(this.baseApiUrl + '/KOT/fnSaveKotPost', body, httpOptions)
      .subscribe(result => {
        let Kot_Id = result;
        this.presentToast();
        loading.dismiss();
        this.orderlist = [];
        this.router.navigate(['/pointofsales']);
      }, error => {
        console.log(error);
        loading.dismiss();
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Kot Save Successfully!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  fnKotTotal() {


    let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
      dTotal = 0, dRowAmtBeforeTax = 0, dtotal = 0;
    for (let j = 0; j < this.orderlist.length; j++) {
      dSelRate = 0, dAmount = 0;
      dQty = parseFloat((this.orderlist[j].KotSub_Qty) || 0);

      dSelRate = parseFloat((this.orderlist[j].KotSub_ActualRate) || 0);
      dTaxPers = parseFloat((this.orderlist[j].KotSub_TaxPercent) || 0);
      if (this.strInclusiveCalRoom == 'Yes') {
        dtotal = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));

      }
      dRowAmtBeforeTax = dQty * dtotal;
      dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
      dAmount = dRowAmtBeforeTax + dTaxAmt;
      this.orderlist[j].KotSub_Amt = dAmount.toFixed(3);
      this.orderlist[j].KotSub_TaxAmt = dTaxAmt.toFixed(3);
      dTotal = dAmount + dTotal;

    }
    // console.log(dTotal);
    return dTotal.toFixed(2);
  }
}
