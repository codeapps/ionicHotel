import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-dialogues-salesman',
  templateUrl: './dialogues-salesman.component.html',
  styleUrls: ['./dialogues-salesman.component.scss'],
})
export class DialoguesSalesmanComponent implements OnInit {
  baseApiUrl: any;
  searchSalesmanResult: any;
  salesManId: any;
  branchId: string = '0';
  constructor(public modalCtrl: ModalController,private appService: AppService, private storage: Storage,) {
    this.storage.forEach((val, key) => {
      if (key == 'SessionBranchId')
        this.branchId = String(val);
      else if (key == 'mainurllink')
        this.baseApiUrl = val;
    }).finally(() => {
      this.Salesman_Get();
    })
 
   }

  ngOnInit() {}
  
  OnClose() {
    this.modalCtrl.dismiss({
      salesid: ''
    });
  }

  OnChecked() {
    this.modalCtrl.dismiss({
      salesid:  this.salesManId
    });
  }
  async Salesman_Get() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Salesman_Gets';

    let oProcParams = [];


    let ProcParams = {};
    ProcParams['strKey'] = 'strSearch';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);


    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
   
     await this.appService.post(this.baseApiUrl + '/CommonQuery/fnGetDataReportNew', body)
      .subscribe(result => {

        this.searchSalesmanResult = JSON.parse(result);
        this.salesManId = this.searchSalesmanResult[0].AC_Id;
      });
  }

  fnchecked(event) {
    this.salesManId = event.target.value;
  }
}
