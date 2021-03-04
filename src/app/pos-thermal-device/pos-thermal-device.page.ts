import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from '../app.service';
import { AddCustomerComponent } from '../modal-page/add-customer/add-customer.component';
import { PaymentComponent } from '../modal-page/payment/payment.component';
import { ThermalPrintService } from '../print/thermal-print/thermal-print.service';
import { PosAllService } from '../services/pos-all.service';

@Component({
  selector: 'app-pos-thermal-device',
  templateUrl: './pos-thermal-device.page.html',
  styleUrls: ['./pos-thermal-device.page.scss'],
})
export class PosThermalDevicePage implements OnInit {
  posTypeset = {
    id: '',
    detailId: '0',
    name: '',
    BillSerId: '0',
    BillNo: '0',
    UniqueNo: '0',
    type: ''
  }
  codeFlag: boolean = false;
  focusIndexed: number = 0;
  listProducts: any[] = [];
  user = {
    accId: '',
    accName: 'cash',
    phone: ''
  }
  billPrev = {
    id: 0,
    productId: 0,
    code: '',
    name: '',
    qty: '1',
    disc: '0',
    rate: '0.00',
    PurRate: '0.00',
    SGSTTaxPers: '0.00',
    IGSTTaxPers: '0.00',
    CGSTTaxPers: '0.00',
    TaxId: 0,
    tax: '0',
    mrp: '',
    total: '0.00'
  }

  baseApiUrl: string = '';
  dBranchId: string = '';

  strInclusiveCalRoom: any;
  qtyFlag: boolean;
  editFlag: boolean;
  loading: boolean;
  anchor: boolean;

  constructor(private appService: AppService, private posService: PosAllService,
    public modalController: ModalController,
    private printService: ThermalPrintService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage, private toastControl: ToastController) {
    this.storage.forEach((value, key) => {
      if (key == 'mainurllink') {
        this.baseApiUrl = value;
      } else if (key == 'SessionBranchId') {
        this.dBranchId = value;
      }
    }).finally(() => {
      this.fnSettings();
    })

  }

  ngOnInit() {
    const Id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('name');
    const type = this.route.snapshot.paramMap.get('type');
    const detailId = this.route.snapshot.paramMap.get('detailId');
    
    const BillSerId = this.route.snapshot.paramMap.get('BillSerId');
    let BillNo = this.route.snapshot.paramMap.get('BillNo');
    let UniqueNo = this.route.snapshot.paramMap.get('UniqueNo');
    if (!BillNo) {
      BillNo = '0';
      UniqueNo = '0';
    }
    // 
    this.posTypeset = {
      id: Id,
      detailId: detailId,
      name: name,
      BillSerId: BillSerId,
      BillNo: BillNo,
      UniqueNo: UniqueNo,
      type: type
    }

  }
 

  async fnSettings() {
    await this.appService.onSettings(this.baseApiUrl)
      .subscribe(data => {
        let settingGet = JSON.parse(data);
        settingGet.forEach(element => {
          if (element.KeyValue == 'MRPINCLUSIVESALES') {
            this.strInclusiveCalRoom = element.Value;
          }

        });
        // this.fnBillTotal();
        if (this.posTypeset.type == 'Edit Bill') {
          this.onAnchorClick()
        }
      }, error => console.error(error));
  }

  async onAnchorClick() {
    this.listProducts = [];
    
    this.posService.onPosThermalGet(this.baseApiUrl, this.posTypeset.BillSerId, this.posTypeset.BillNo,
      this.posTypeset.UniqueNo, this.posTypeset.name)
      .subscribe(res => {
        const json = JSON.parse(res);
        const main = JSON.parse(json[0])[0];
        const sub = JSON.parse(json[1]);
        this.anchor = true;
        if (main) {
        this.user = {
          accId: main.AcId ? main.AcId: '0',
          accName: main.Issues_CustName ? main.Issues_CustName: '',
          phone: ''
        }
        this.posTypeset.id = main.Table_Id
        this.posTypeset.detailId = main.TableDetail_Id
        }
        
        sub.forEach((ele, index) => {
         let billPrev = {
            id: index,
            productId: ele.ProductId,
            code: ele.ItemCode,
            name: ele.ProductName,
            qty: ele.IssuesSub_Qty,
            disc: '0',
            rate: ele.IssuesSub_ActualRate,
            PurRate: ele.IssuesSub_PurRate,
            SGSTTaxPers: ele.IssuesSub_SGSTTaxPercent,
            IGSTTaxPers: ele.IssuesSub_IGSTTaxPercent,
            CGSTTaxPers: ele.IssuesSub_CGSTTaxPercent,
            TaxId: ele.IssuesSub_TaxId,
            tax: ele.IssuesSub_TaxPercent,
            mrp: ele.IssuesSub_MRP,
            total: ele.IssuesSub_Amt
         }
          this.listProducts.push(billPrev);
        });

        

      });
  }

  onKeyboard(eve) {

    if (eve == 'backspace') {
      this.onBackSpace();
      return
    }
    if (eve == '+') {
      this.onIncrease();
      return
    }

    if (this.focusIndexed == 0) {
      this.billPrev.code += eve;
      this.codeFlag = true;
    } else if (this.focusIndexed == 1) {
      if (!this.qtyFlag) {
        this.billPrev.qty = eve;
        this.qtyFlag = true;
        this.rowTotal();
        return
      }
      this.billPrev.qty += eve;
      this.rowTotal();
    } else if (this.focusIndexed == 2) {
      if (this.billPrev.disc == '0') {
        this.billPrev.disc = eve;
        this.rowTotal();
        return
      }
      this.billPrev.disc += eve;
      this.rowTotal();
    }
  }

  onIncrease() {
    if (this.focusIndexed == 1) {
      this.qtyFlag = true;
      let oldnumber = this.billPrev.qty ? parseFloat(this.billPrev.qty) : 0;
      this.billPrev.qty = (oldnumber + 1).toString();
      this.rowTotal();
    } else if (this.focusIndexed == 2) {
      let oldnumber = this.billPrev.disc ? parseFloat(this.billPrev.disc) : 0;
      this.billPrev.disc = (oldnumber + 1).toString();
      this.rowTotal();
    }
  }

  onBackSpace() {
    if (this.focusIndexed == 0) {
      const editedText = this.billPrev.code.slice(0, -1);
      this.billPrev.code = editedText;
      this.codeFlag = true;
    } else if (this.focusIndexed == 1) {
      const editedText = this.billPrev.qty.slice(0, -1);
      this.billPrev.qty = editedText;
      this.rowTotal();
    } else if (this.focusIndexed == 2) {
      const editedText = this.billPrev.disc.slice(0, -1);
      this.billPrev.disc = editedText;
      this.rowTotal();
    }
  }

  onClear() {
    this.billPrev = {
      id: 0,
      productId: 0,
      code: '',
      name: '',
      qty: '1',
      disc: '0',
      rate: '0.00',
      PurRate: '0.00',
      SGSTTaxPers: '0.00',
      IGSTTaxPers: '0.00',
      CGSTTaxPers: '0.00',
      TaxId: 0,
      tax: '0',
      mrp: '',
      total: '0.00'
    };
    this.editFlag = false;
    this.focusIndexed = 0;
  }
  onNewBill() {
    if (this.anchor) {
      this.router.navigate(['/pos-table']);
      return
    }
    this.listProducts = [];
    this.posTypeset.BillNo = '0';
    this.posTypeset.UniqueNo = '0';
    
    this.onClear();
    this.user = {
      accId: '',
      accName: 'cash',
      phone: ''
    }
  }



  onSelectionChange(index: number) {
    this.focusIndexed = index;
    if (this.codeFlag) {
      this.loading = true;
      this.productCode()

    }
    this.codeFlag = false;
  }

  productCode() {

    let promise = new Promise((resolve, reject) => {

      this.posService.onProductCodeGet(this.baseApiUrl, this.dBranchId, this.billPrev.code)
        .toPromise()
        .then(
          res => { // Success
            let productCode = JSON.parse(res.JsonDetails[0]);

            if (!productCode.length) {
              this.toastAlert('Product code is not avilable !!');
              this.onClear();
              this.focusIndexed = 0;
              this.loading = false;
              return
            } else {
              const dataItems = productCode[0];
              if (this.billPrev.code == dataItems.ItemCode) {
                this.billPrev.code = dataItems.ItemCode;
                this.posService.onProductGet(this.baseApiUrl, dataItems.ProductId, this.dBranchId)
                  .toPromise()
                  .then(res => {
                    const product = res[0];
                    this.billPrev.name = product.ProductName;
                    this.billPrev.rate = product.Sel_Rate.toFixed(2);
                    if (product.TaxPercent) {
                      this.billPrev.tax = product.TaxPercent;
                    }
                    this.billPrev.mrp = product.MRP_Rate;
                    this.billPrev.productId = product.ProductId;
                    this.billPrev.PurRate = product.Pur_Rate;
                    this.billPrev.SGSTTaxPers = product.SGSTTaxPers;
                    this.billPrev.IGSTTaxPers = product.CGSTTaxPers;
                    this.billPrev.CGSTTaxPers = product.CGSTTaxPers;
                    this.billPrev.TaxId = product.TaxId;
                    this.rowTotal();
                    this.qtyFlag = false;
                    this.loading = false;
                    resolve(res);
                  });
              } else {
                this.toastAlert('Enter valid Product code !!');
                this.onClear();
                this.loading = false;
              }
            }


          },
          msg => { // Error
            reject(msg);
            this.loading = false;
          }
        );
    });
    return promise;
  }


  onAddRow() {

    if (this.focusIndexed == 0) {
      this.loading = true;
      this.productCode().then(res => {
        this.onrowValidAdd()
      });
    }

    else this.onrowValidAdd();

  }


  onrowValidAdd() {

    if (!this.billPrev.code || !this.billPrev.name) {
      this.toastAlert('Enter Product Code !!');
      return
    }

    if (!this.billPrev.qty || this.billPrev.qty == '0') {
      this.toastAlert('Enter Valid Quantity !!');
      return
    }
    if (!this.billPrev.rate || this.billPrev.rate == '0') {
      this.toastAlert('Product Rate is zero !!');
      return
    }
    if (this.editFlag) {
      this.onClear();
      return
    }
    let flagReplace = true;
    this.listProducts.map(x => {
      if (x.code == this.billPrev.code) {
        let oldQty = parseFloat(x.qty || 0);
        let oldRate = parseFloat(x.rate || 0)
        x.qty = oldQty + parseFloat(this.billPrev.qty);
        x.total = (x.qty * oldRate).toFixed(2);
        flagReplace = false
      }
    });

    if (flagReplace)
      this.listProducts.push(this.onAddItem(this.listProducts.length));

    this.listProducts.sort(sortByProperty('id')); //sort according to pId 

    this.onClear();
  }

  onAddItem(id) {
    this.billPrev.id = id;
    return this.billPrev;
  }

  rowTotal() {
    let qty: any = this.billPrev.qty;
    let rate: any = this.billPrev.rate;
    let disc: any = this.billPrev.disc;
    let taxpers: any = this.billPrev.tax;
    let dTotal: any = parseFloat(qty || 0) * parseFloat(rate || 0);
    let dTaxPers = parseFloat(taxpers || 0);
    let dTaxAmt = 0;
    dTaxAmt = (dTotal * dTaxPers) / 100;
    let dAmount = dTotal + dTaxAmt;
    dAmount = dAmount - parseFloat(disc || 0);
    this.billPrev.total = dAmount.toFixed(2);
  }
  async toastAlert(msg) {
    const toast = await this.toastControl.create({
      position: 'top',
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  onEditItems(items) {
    this.billPrev = items;
    this.focusIndexed = 1;
    this.qtyFlag = false;
    this.editFlag = true;
  }

  onDelete() {
    let index = this.listProducts.indexOf(this.billPrev);
    this.listProducts.splice(index, 1);
    this.onClear();
  }


  getTotalAmount() {
    if (!this.listProducts.length) {
      return 0
    }
    return this.listProducts.map(data => parseFloat(data.total || 0)).reduce((toal, current) => toal + current);
  }

  async onAddCustomer() {
    const modal = await this.modalController.create({
      component: AddCustomerComponent,
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {

      this.user.accId = data.AC_Id;
      this.user.accName = data.AC_Name;
      this.user.phone = data.Phone
    }
  }

  async onPayment() {
   
    const modal = await this.modalController.create({
      component: PaymentComponent,
      componentProps: {
        activeType: this.posTypeset,
        main: {
          IssuesBillNo: this.posTypeset.BillNo,
          UniqueNo: this.posTypeset.UniqueNo,
          paid: this.getTotalAmount(),
          discount: '0.00',
          taxableAmt: '0.00',
          cusName: this.user.accName,
          custId: this.user.accId,
          phone: this.user.phone
        },
        issueSub: this.listProducts

      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      if (this.posTypeset.type == 'Direct Bill') {
        this.onNewBill();
      } else {
        this.router.navigate(['/pos-table']);
      }
    }

  }

  demoPrint() {
    let main = {
      IssuePayTerms: "CASH",
      IssuesAtotal: 585,
      IssuesBillNo: 529,
      IssuesCustName: "cash",
      IssuesDate: "2021-02-19T08:47:09.6629741+00:00",
      IssuesDisAmt: 0,
      IssuesDisPers: 0,
      IssuesMobile: "",
      IssuesOrderFrom: "Table",
      IssuesTotal: 585,
      billseriesName: "BB"
    }

    let sub = [{
      BillSerId: 1,
      IssuesSubActualRate: 25,
      IssuesSubAmt: 25,
      IssuesSubCgsttaxAmt: 0,
      IssuesSubCgsttaxPercent: 0,
      IssuesSubDiscAmnt: 0,
      IssuesSubDiscPerc: 0,
      IssuesSubIgsttaxAmt: 0,
      IssuesSubIgsttaxPercent: 0,
      IssuesSubMrp: 25,
      IssuesSubPurRate: 25,
      IssuesSubQty: 1,
      IssuesSubSgsttaxAmt: 0,
      IssuesSubSgsttaxPercent: 0,
      IssuesSubTaxAmt: 0,
      IssuesSubTaxId: 1,
      IssuesSubTaxPercent: 0,
      ItemName: "Mint Lime"
    },
    {
      BillSerId: 1,
      IssuesSubActualRate: 80,
      IssuesSubAmt: 160,
      IssuesSubCgsttaxAmt: 0,
      IssuesSubCgsttaxPercent: 0,
      IssuesSubDiscAmnt: 0,
      IssuesSubDiscPerc: 0,
      IssuesSubIgsttaxAmt: 0,
      IssuesSubIgsttaxPercent: 0,
      IssuesSubMrp: 80,
      IssuesSubPurRate: 80,
      IssuesSubQty: 2,
      IssuesSubSgsttaxAmt: 0,
      IssuesSubSgsttaxPercent: 0,
      IssuesSubTaxAmt: 0,
      IssuesSubTaxId: 1,
      IssuesSubTaxPercent: 0,
      ItemName: "Chicken Clear Soup",
    }
    ]
    let branch = {
      AcId: 0,
      Active: true,
      BarCodeHeaderName: "SURAT TEXTILES WIN3",
      BarCodeName: "happyshopy",
      BranchAdr1: "WholeSale & Retail Sales",
      BranchAdr2: "T.C.27/252/2 AARYA KODOOR LANE KUNNUKUZHI TVPM-37",
      BranchAdr3: "GSTIN-7845692 PAN:7841254",
      BranchBankAcNo: null,
      BranchBankAddr1: null,
      BranchBankAddr2: null,
      BranchBankName: null,
      BranchCode: "LLBAGS",
      BranchField1: null,
      BranchField2: null,
      BranchField3: null,
      BranchFtr1: "Thank You",
      BranchFtr2: "10% Discount",
      BranchFtr3: "Palavankadi   Tvm",
      BranchId: 9,
      BranchIfsccode: null,
      BranchName: "DIGIT COMPUTERS  ..",
      BranchNoField: 0,
      BranchPanCardNo: null,
      BranchStateCode: null,
      BranchStateName: null,
      ComImage: "Branch9.png",
      ConSlNo: 1,
      Cstno1: null,
      Currency: "fssai:11315001000994",
      DcInNextBillNo: 1,
      DcInUniqueNo: -1,
      DcSlNo: 1,
      Dlno1: null,
      Dlno2: null,
      DnslNo: 27,
      EdslNo: 9,
      EndDate: "2016-03-31T00:00:00",
      EodDate: "2018-08-01T00:00:00",
      ErslNo: 12,
      EshopOrderNo: 1,
      Fax: "0471-3210530",
      GoldExchangeNo: 4,
      LastCustNo: 1,
      Mail: "senthil.rvk@gmail.com",
      MailId: "senthil.rvk@gmail.com",
      MailPwd: null,
      MobileNo: "9962475108",
      NextBillNo: 543,
      NextDcSlNo: 1,
      NextDebitNoteNo: 1,
      NextReturnNo: 12,
      OrderNo: 14,
      PerformaSlNo: 1,
      Phone: "0471-4000780",
      PurConsignmentSlNo: 1,
      PurReturnNo: 11,
      PurSlNo: 1,
      QuoSlNo: 2,
      RawMaterialBatchSlNo: 1,
      RawMaterialPurSlNo: 1,
      SettelmentBillNo: 33,
      SrslNo: 12,
      StartDate: "2015-04-01T00:00:00",
      TaxId: 1,
      TempInvoiceNo: 322,
      TinNo1: null,
      TinNo2: null
    }

    let option = {
      address: true,
      balAmount: true,
      btAddress: "",
      btId: "",
      btName: "",
      cmpName: true,
      decimal: true,
      defaultPrint: true,
      description: [
        "Thank you for doing business with us.",
        "Powered By www.codeapps.in"
      ],

      email: true,
      extraLine: 0,
      gstIn: true,
      numCopies: 1,
      pageSize: "2inch",
      phoneNo: true,
      rcvedAmount: true,
      tandc: true,
      taxDetail: true,
      textSize: "regular",
      totalQty: true
    }
    this.printService.onprintThermal(main, sub, branch, option);
  }

}
function sortByProperty(property) {
  return function (a, b) {
    if (a[property] < b[property])
      return 1;
    else if (a[property] > b[property])
      return -1;

    return 0;
  }


}