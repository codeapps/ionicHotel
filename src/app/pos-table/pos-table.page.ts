import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DialogueBillComponent } from '../pointofsales/dialogue-bill/dialogue-bill.component';
import { PosAllService } from '../services/pos-all.service';

@Component({
  selector: 'app-pos-table',
  templateUrl: './pos-table.page.html',
  styleUrls: ['./pos-table.page.scss'],
})
export class PosTablePage implements OnInit {
  selectType = "Table";
  tables = [];
  tabDetail = [];
  roomSource = [];
  baseApiUrl = '';
  branchId: any = '';
  loading: HTMLIonLoadingElement;
  dReportBill: any;
  
  constructor(
    private storage: Storage,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private posService: PosAllService,
    private router: Router
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

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Loading',
    });
    await this.loading.present();
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
       
    await this.posService.onGetTableDtls(this.baseApiUrl, this.branchId)
      .subscribe(data => {
        let dataJson = JSON.parse(data);
         this.tables.map(x => {
         x.child = dataJson.filter(y => y.Table_Id == x.TableId)
        })
       
        this.tabDetail = this.tables;
        
        this.onRoomGets();
      }, error => {
          if (this.loading) 
        this.loading.dismiss()
        console.error(error)
      });

  }

  onRoomGets() {
    this.posService.onGetRooms(this.baseApiUrl, this.branchId)
      .subscribe(result => {
        this.roomSource = result;
        this.loading.dismiss()
      }, err => {
        this.loading.dismiss()
      });
  }

  
  roomClick(room, i) {
    this.router.navigate(['/posdevice', { id: room.Room_Id , name: room.Room_No, type: this.selectType}]);
  }

  async selectTableDetail(tab) {
    // TableDetails_Name
    await this.posService.onSelectTableDetail(this.baseApiUrl, tab.TableDetails_Id)
    .subscribe(result => { 
      let jsonTable = result[0];
      
        // this.Table_Id = jsonTable[0].Table_Id;
        // this.TableDetail_Id = jsonTable[0].TableDetails_Id;
        // this.Kot_TempOrderNo = jsonTable[0].BillNo;

      this.fnKotBillGetOnTableDetailId(jsonTable);
    }, error => console.error(error));
  }

  fnKotBillGetOnTableDetailId(tab) {
  
    this.posService.onKotBillGetOnTableDetailId(this.baseApiUrl, String(tab.TableDetails_Id))
      .subscribe(data => {
        let dataReport = JSON.parse(data);
        this.dReportBill = dataReport;
        if (dataReport.length > 0) {
          
        } else {
          this.router.navigate(['/posdevice', { id: tab.Table_Id,detailId: tab.TableDetails_Id, name: tab.TableDetails_Name, type: this.selectType}]);
        }
      });
  }

  onDirectBill() {
   
    
    const tab = this.tabDetail[0].child[0];
    const tabId = this.tabDetail[0].TableId;
    this.router.navigate(['/posdevice', { id: tabId,detailId: tab.TableDetails_Id, name: tab.TableDetails_Name, type: 'Direct Bill'}]);
  }
}
