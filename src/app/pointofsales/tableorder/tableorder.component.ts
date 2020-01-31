import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController, LoadingController } from '@ionic/angular';
import { DialoguesSalesmanComponent } from '../dialogues-salesman/dialogues-salesman.component';
import { Router, NavigationEnd } from '@angular/router';
import { DialogueBillComponent } from '../dialogue-bill/dialogue-bill.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'charset=utf-8'
  })
};

@Component({
  selector: 'app-tableorder',
  templateUrl: './tableorder.component.html',
  styleUrls: ['./tableorder.component.scss'],
})
export class TableorderComponent implements OnInit {
  baseApiUrl: any;
  tabDetail = [];
  jsonItems: any[];
  selectType: string;
  TableDetail_Id: any;
  Table_Id: any;
  Kot_CustName: any;
  Kot_Mobile: any;
  strKotSalesmanId: any;
  strKotSalesman: any;
  dReportBill: any;
  Kot_TempOrderNo: any;
  search:boolean;
  constructor(
    private storage: Storage,
    public http: HttpClient,
    public modalController: ModalController,
    private router: Router,
    private loadingController: LoadingController
  ) {
   
    this.storage.get('mainurllink').then((val) => {
      this.baseApiUrl = val;
      this.getTableDtl();
    });
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (ev.id !== 1) {
          setTimeout(() => {
            this.getTableDtl();
            // console.log('42524')
          }, 1000);
        }

      }
    });
  }

  ngOnInit() { }

  async getTableDtl() {
    this.tabDetail = [];
    const loading = await this.loadingController.create({
      message: 'Loading',
    });
    await loading.present();
    let ServiceParams = {};
    ServiceParams['strProc'] = 'TableDetails_GetOnAll';

    let body = JSON.stringify(ServiceParams);

    await this.http.post<any>(this.baseApiUrl + '/fnGetDataReportNew', body, httpOptions)
      .subscribe(data => {
        let dataJson = JSON.parse(data);
        this.jsonItems = dataJson;
        let totalLegth = this.jsonItems.length;
        loading.dismiss();
        if (totalLegth >= 100) {
          for (let i = 0; i < 100; i++)
            this.tabDetail.push(this.jsonItems[i]);
        } else {
          this.tabDetail = this.jsonItems;
        }

        if (this.tabDetail.length == 0) {

        } 

      }, error => {
        loading.dismiss();
        console.error(error)
      });

  }

  Oncancel() {
    this.tabDetail = [];
    this.search = false;
    this.tabDetail = this.jsonItems;
  }

  fnSearch(event) {
    let keyword = event.target.value;
    //  let datasearch = this.product.map(data => data.ProductName).includes(keyword);
    let datadearch = this.jsonItems.filter((data) => {
      return data.TableDetails_Name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
    });

    this.tabDetail = datadearch;
  }

  loadData(event) {
    let prevlength = this.tabDetail.length;
    let nextlength = prevlength + 100;

    let totalLegth = this.jsonItems.length;
    if (nextlength > totalLegth) {
      nextlength = totalLegth;
    }

    setTimeout(() => {
      for (let i = prevlength; i < nextlength; i++)
        this.tabDetail.push(this.jsonItems[i]);
      // this.numTimesLeft -= 1;
      event.target.complete();
    }, 2000);

  }

  
  async SalesmanModal() {
    const modal = await this.modalController.create({
      component: DialoguesSalesmanComponent
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    let select_id = data.salesid;
    if (select_id == '') {
      return;
    } else {
      let queryParam = {tblid: this.Table_Id, tbldetailId: this.TableDetail_Id, 
        selectType: this.selectType, custName: this.Kot_CustName, Mobile: this.Kot_Mobile,
         SalesmanId: select_id}
          this.router.navigate(['pointofsales/order', queryParam]);
    }
  }

  async BillsModal() {
    const modal = await this.modalController.create({
      component: DialogueBillComponent,
      componentProps: [this.dReportBill,
         {tblid: this.Table_Id, tbldetailId: this.TableDetail_Id, 
          selectType: this.selectType, Kot_CustName: this.Kot_CustName,
           Kot_Mobile: this.Kot_Mobile, Kot_SalesmanId: this.strKotSalesmanId,
           Kot_TempOrderNo: this.Kot_TempOrderNo}]
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.getTableDtl();
  }
  
  selectTableDetail(TableDtailId) {

    this.http.get(this.baseApiUrl + '/TableDetailsGet_OnName?TableDtailId=' + TableDtailId.TableDetails_Id)
      .subscribe(result => {
        let jsonTable = result;

        
        this.Table_Id = jsonTable[0].Table_Id;
        this.TableDetail_Id = jsonTable[0].TableDetails_Id;
       this.Kot_TempOrderNo = jsonTable[0].BillNo;

        this.selectType = 'Table';
        this.fnKotBillGetOnTableDetailId(jsonTable);
      }, error => console.error(error));

  }

  fnKotBillGetOnTableDetailId(jsonTable) {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Kot_GetOnTempInvoiceNo';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'TableDetails_Id';
    ProcParams['strArgmt'] = jsonTable[0].TableDetails_Id;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this.http.post<any>(this.baseApiUrl + '/fnGetDataReportNew', body, httpOptions)
      .subscribe(data => {
        let dataReport = JSON.parse(data);
        this.dReportBill = dataReport;
        //  this.fnBillTotal();
        // this.strKotSalesman = dataReport[0].AC_Name;
        // this.strKotSalesmanId    =  dataReport[0].Kot_SalesmanId;
        if (dataReport.length > 0) {
          this.strKotSalesmanId    =  dataReport[0].Kot_SalesmanId;
          for (let i = 0; i < dataReport.length; i++) {
            if (dataReport[i].Kot_CustName != null && dataReport[i].Kot_CustName != '') {
              this.Kot_CustName = dataReport[i].Kot_CustName;
            }

            if (dataReport[i].Kot_Mobile != null && dataReport[i].Kot_Mobile != '') {
              this.Kot_Mobile = dataReport[i].Kot_Mobile;

            }


          }

          this.BillsModal();

        } else {
          // this.myModal = 'block';
          this.SalesmanModal();

        }


      }, error => console.error(error));
  }

}
