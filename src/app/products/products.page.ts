import { Storage } from '@ionic/storage';
import { Component, Input, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { ModalController, ToastController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  branchId: string;
  baseApiUrl: string;
  productSource: any[] = [];
  
  constructor(private productService: ProductsService,
    public modalController: ModalController,
    private storage: Storage) {
    this.storage.forEach((val, key) => {
      if (key == 'SessionBranchId')
        this.branchId = String(val);
      else if (key == 'mainurllink')
        this.baseApiUrl = val;
    }).finally(() => {
      this.getProducts('')
    });
   }

  ngOnInit() {

  }

  getProducts(keyword) {
    this.productService.onGetProduct(keyword, this.branchId, this.baseApiUrl)
      .subscribe(res => {
        this.productSource = res;
      
    })
  }

  async productModal(eve) {
   
    const modal = await this.modalController.create({
      component: ProductsModal,
      componentProps: {products: eve},
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
   if (data) {
      this.getProducts('');
    }
  }

}

@Component({
  selector: 'app-products-modal',
  templateUrl: './product-modal.html',
  styleUrls: ['./products.page.scss'],
})
  
export class ProductsModal  {
  
  branchId: string;
  baseApiUrl: string;
  manufacture: any[] = [];
  taxSource: any[] = [];
  category: any[] = [];
  product: any[] = [];
  loading: boolean;
  productSource = {
    ProductId: 0, ProductName: '', ItemCode: '', HsnCode: '', Qty: '', HsnCode_Id: '', CategoryID: '',
    PurRate: '', Discount: '', SelRate: '', MrpRate: '', PackageId: '', ManufacturingId: '',
    TaxGroupId: '', ManufacturingDes: '', TaxPercent: '', Amound: '', Active: true, BranchId: '',
    Stock_Check: false
  }

  constructor(public modalController: ModalController,
    private productService: ProductsService,
    public toastController: ToastController,
    private navparams: NavParams,
    private storage: Storage) {
    this.storage.forEach((val, key) => {
      if (key == 'SessionBranchId')
        this.branchId = String(val);
      else if (key == 'mainurllink')
        this.baseApiUrl = val;
    }).finally(() => {
      this.getManufacture();
     
    })
  }
  
  getManufacture() {
    this.productService.onGetManufacture(this.baseApiUrl)
      .toPromise().then(res => {
        this.manufacture = JSON.parse(res);
        this.productSource.ManufacturingId = this.manufacture[0].Manufacture_Id;
      }).finally(() => {
        this.productService.onGetTax(this.baseApiUrl)
          .toPromise().then(res => {
            this.taxSource = res;
            this.productSource.TaxGroupId = this.taxSource[0].TaxGroupId;
          }).finally(() => {
            this.productService.onGetCategory(this.baseApiUrl)
              .toPromise().then(res => {
                this.category = res;
                this.productSource.CategoryID = this.category[0].CategoryId;
                
              }).finally(() => {
                this.productService.onGetProduct('', this.branchId, this.baseApiUrl)
                  .toPromise().then(res => {
                    this.product = res;
                    
                  }).finally(() => {
                    const params = this.navparams.get('products');
                if (params) {
                  this.productSource = params;
                  this.productSource.CategoryID = params.CategoryId
                }
                  })
               
                
                
              });
        })
    })
  }

  onDissmiss() {
    this.modalController.dismiss()
  }

  fnSave() {
   
    for (const product of this.product) {
      if (product.ProductId != this.productSource.ProductId) {
        if (product.ItemCode == this.productSource.ItemCode) {
          this.alertToast('The Given Item Code Is Already Exist...!', 'Warning');
          return;
        }

        if (product.ProductName.toLocaleLowerCase() == this.productSource.ProductName.toLocaleLowerCase() ) {
          this.alertToast('The Given Product Name Is Already Exist', 'Warning');
          return;
        }
      }
    }

    if (!this.productSource.ItemCode) {
      this.alertToast('Please Enter The ItemCode...', 'Warning');
      return;
    }

    if (!this.productSource.ProductName) {
      this.alertToast('Please Enter The Product Name....', 'Warning');
      return;
    }

    if (this.productSource.SelRate == null || this.productSource.SelRate == '') {
      this.alertToast('Please Enter The Selling Rate....', 'Warning');
      return;
    }

    if (this.productSource.ManufacturingId == null || this.productSource.ManufacturingId == '') {
      this.alertToast('Please Select The Company....', 'Warning');
      return;
    }

    if (this.productSource.CategoryID == null || this.productSource.CategoryID == '') {
      this.alertToast('Please Select The Category....', 'Warning');
      return;
    }

    if (this.productSource.TaxGroupId == null || this.productSource.TaxGroupId == '') {
      this.alertToast('Please Select The Tax Percentage....', 'Warning');
      return;
    }

    if (this.productSource.TaxGroupId == null || this.productSource.TaxGroupId == '') {
      this.alertToast('Please Select The Tax Percentage....', 'Warning');
      return;
    }

    let dataSource = {
      ProductId: this.productSource.ProductId,
      ProductName: this.productSource.ProductName,
      ItemCode: String(this.productSource.ItemCode),
      HsnCode: this.productSource.HsnCode,
      Qty: parseFloat(<any>this.productSource.Qty || 0),
      HsnCodeId: parseFloat(<any>this.productSource.HsnCode_Id || 0),
      CategoryId: parseFloat(<any>this.productSource.CategoryID || 0),
      PurRate: parseFloat(<any>this.productSource.PurRate || 0),
      Discount: parseFloat(<any>this.productSource.Discount || 0),
      SelRate: parseFloat(<any>this.productSource.SelRate || 0),
      MrpRate: parseFloat(<any>this.productSource.MrpRate || 0),
      PackageId: parseFloat(<any>this.productSource.PackageId || 0),
      ManufacturingId: parseFloat(<any>this.productSource.ManufacturingId || 0),
      TaxGroupId: parseFloat(<any>this.productSource.TaxGroupId || 0),
      ManufacturingDes: this.productSource.ManufacturingDes,
      TaxPercent: parseFloat(<any>this.productSource.TaxPercent || 0),
      Amound: parseFloat(<any>this.productSource.Amound || 0),
      Active: true,
      BranchId: Number(this.branchId || 0),
      StockCheck: false,
    }
    let body = JSON.stringify(dataSource);
    this.loading = true;
    this.productService.onSave(body, this.baseApiUrl)
      .subscribe(res => {
        let jsonData = res;
        if (jsonData && jsonData.ProductId == 0) {
          this.alertToast('ItemCode or Product Name is Already Exists ', 'Success');
          return;
        }
        this.alertToast('Saved Successfully', 'Success');
        this.loading = false;
        this.modalController.dismiss(true);
      }, () => {
        this.alertToast('Server Busy..', 'Warning');
    })
  }

  async alertToast(msg, alert) {
    const toast = await this.toastController.create({
      header:alert,
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}