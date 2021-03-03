import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { DialoguesSalesmanComponent } from '../dialogues-salesman/dialogues-salesman.component';
import { Router, NavigationEnd } from '@angular/router';
import { DialogueBillComponent } from '../dialogue-bill/dialogue-bill.component';
import { BillPrintComponent } from 'src/app/print/bill-print/bill-print.component';
import { PosAllService } from 'src/app/services/pos-all.service';


@Component({
  selector: 'app-tableorder',
  templateUrl: './tableorder.component.html',
  styleUrls: ['./tableorder.component.scss'],
})
export class TableorderComponent implements OnInit {
  baseApiUrl: any;
  tabDetail = [];
  jsonItems: any[];
  
  TableDetail_Id: any;
  Table_Id: any = 0;
  Kot_CustName: any;
  Kot_Mobile: any;
  strKotSalesmanId: any;
  strKotSalesman: any;
  dReportBill: any;
  Kot_TempOrderNo: any;
  selectType = "Table";
  search: boolean;
  branchId: string = '0';
  roomSource: any;
  Room_Id: any = 0;
  tables: any[] = [];
  constructor(
    private storage: Storage,
    private posService: PosAllService,
    public modalController: ModalController,
    private router: Router,
    private loadingController: LoadingController,
    public toastController: ToastController
  ) {
   
    this.storage.forEach((val, key) => {
      if (key == 'SessionBranchId')
        this.branchId = String(val);
      else if (key == 'mainurllink')
        this.baseApiUrl = val;
    }).finally(() => {
      this.getTables();
    })
   
    
  }

  ngOnInit() { }
  
  doRefresh(event) {
    this.getTables();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async testPrintModal() {
    
    const billSerId = 1;
    const billNo = 493;
    const uniqueNo = 503;
    const printType = 'Table';
    const modal = await this.modalController.create({
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

  async getTables() {
    await this.posService.onGetTable(this.baseApiUrl, this.branchId)
      .subscribe(async res => {
        this.tables = res;
        await this.getTableDtl();
    })
 }

  async getTableDtl() {
    this.tabDetail = [];
    const loading = await this.loadingController.create({
      message: 'Loading',
    });
    await loading.present();
   
    await this.posService.onGetTableDtls(this.baseApiUrl, this.branchId)
      .subscribe(data => {
        let dataJson = JSON.parse(data);
         this.tables.map(x => {
         x.child = dataJson.filter(y => y.Table_Id == x.TableId)
        })
       
        this.jsonItems = this.tables;
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
        this.onRoomGets();
      }, error => {
        loading.dismiss();
        console.error(error)
      });

  }

  onRoomGets() {
    this.posService.onGetRooms(this.baseApiUrl, this.branchId)
      .subscribe(result => {
        this.roomSource = result;
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
      let id = 0;
    if (this.selectType == 'Table') {
     id = this.Table_Id;
    } else {
      id = this.Room_Id;
      this.TableDetail_Id = 0;
    }
      let queryParam = {tblid: id, tbldetailId: this.TableDetail_Id, 
        selectType: this.selectType, custName: this.Kot_CustName, Mobile: this.Kot_Mobile,
         SalesmanId: select_id}
          this.router.navigate(['pointofsales/order', queryParam]);
    }
  }

  async BillsModal() {
    let id = 0;
    if (this.selectType == 'Table') {
     id = this.Table_Id;
    } else {
      id = this.Room_Id;
      this.TableDetail_Id = 0;
      this.Kot_TempOrderNo = 0

    }
    const modal = await this.modalController.create({
      component: DialogueBillComponent,
      componentProps: [
        this.dReportBill,
         {tblid: id, tbldetailId: this.TableDetail_Id, 
          selectType: this.selectType, Kot_CustName: this.Kot_CustName,
           Kot_Mobile: this.Kot_Mobile, Kot_SalesmanId: this.strKotSalesmanId,
           Kot_TempOrderNo: this.Kot_TempOrderNo}]
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.getTableDtl();
  }
  
  async selectTableDetail(TableDtailId) {

   await this.posService.onSelectTableDetail(this.baseApiUrl, TableDtailId.TableDetails_Id)
      .subscribe(result => { 
        let jsonTable = result;
        
        this.Table_Id = jsonTable[0].Table_Id;
        this.TableDetail_Id = jsonTable[0].TableDetails_Id;
         this.Kot_TempOrderNo = jsonTable[0].BillNo;

        this.fnKotBillGetOnTableDetailId(jsonTable);
      }, error => console.error(error));

  }

  roomClick(item, idx) {
   
    this.posService.onRoomGet(this.baseApiUrl, item.Room_Id)
      .subscribe(async res => {
        let dataRep = JSON.parse(res);
       
        if (!dataRep.length) {
          const toast = await this.toastController.create({
            message: 'Rooms Not avilable!!',
            duration: 2000
          });
          toast.present();
          return
        }
          
          this.Table_Id =
        this.Kot_Mobile = dataRep[0].Phone
        this.Kot_CustName = dataRep[0].CustomerName;
        this.Room_Id = item.Room_Id;
        this.fnKotBillGetOnRoomId(item.Room_Id)
    })
  }

  fnKotBillGetOnRoomId(roomId) {
    this.posService.onKotBillGetOnRoomId(this.baseApiUrl, roomId)
      .subscribe(res => {
        const billDetailed = JSON.parse(res);
        this.dReportBill = billDetailed;
       
        if (this.dReportBill.length) {
          this.BillsModal();
        } else {
          // this.myModal = 'block';
          this.SalesmanModal();
        }
    })

  }

  fnKotBillGetOnTableDetailId(jsonTable) {
    this.posService.onKotBillGetOnTableDetailId(this.baseApiUrl, String(jsonTable[0].TableDetails_Id))
      .subscribe(data => {
        let dataReport = JSON.parse(data);
        this.dReportBill = dataReport;
        //  this.fnBillTotal();
        // this.strKotSalesman = dataReport[0].AC_Name;
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
