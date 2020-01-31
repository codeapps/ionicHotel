import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'charset=utf-8'
  })
};

@Component({
  selector: 'app-dialogues-salesman',
  templateUrl: './dialogues-salesman.component.html',
  styleUrls: ['./dialogues-salesman.component.scss'],
})
export class DialoguesSalesmanComponent implements OnInit {
  baseApiUrl: any;
  searchSalesmanResult: any;
  salesManId: any;

  constructor(public modalCtrl: ModalController, public http: HttpClient, private storage: Storage,) {
    this.storage.get('mainurllink').then((val) => {
      this.baseApiUrl = val;
      this.Salesman_Get();
    });
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


    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
   
     await this.http.post<any>(this.baseApiUrl + '/fnGetDataReportNew', body, httpOptions)
      .subscribe(result => {

        this.searchSalesmanResult = JSON.parse(result);
        this.salesManId = this.searchSalesmanResult[0].AC_Id;
      });
  }

  fnchecked(event) {
    this.salesManId = event.target.value;
  }
}
