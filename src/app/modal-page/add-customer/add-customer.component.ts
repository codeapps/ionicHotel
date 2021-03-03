import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AccountHeadService } from 'src/app/services/account-head.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  baseApiUrl: '';
  dBranchId: '9';
  accSource: any[] = [];
  constructor(private modal: ModalController,
    private storage: Storage,
    private accService: AccountHeadService) { 
    this.storage.get('mainurllink').then((val) => {
      this.baseApiUrl = val;
    });

    this.storage.get('SessionBranchId').then((val) => {
      this.dBranchId = val;
      this.fnAccHeadGets('');
    });
  }

  ngOnInit() {}

  fnAccHeadGets(keyword) {
    
    this.accService.onAccountGets(this.baseApiUrl, keyword, this.dBranchId)
      .subscribe(res => {
        this.accSource = JSON.parse(res);
      
    })
  }
  onCancel() {
    this.modal.dismiss();
  }

  onAccClick(acc) {
    this.modal.dismiss(acc)
  }
}
