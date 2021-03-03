import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ThermalPrintService } from './thermal-print.service';

@Component({
  selector: 'app-thermal-print',
  templateUrl: './thermal-print.component.html',
  styleUrls: ['./thermal-print.component.scss'],
})
export class ThermalPrintComponent implements OnInit {
  @Input() printMain: any;
  @Input() printSub: any[];
  
  baseApiUrl: any;
  dBranchId: number;
  thermalPrintOption: any;
  

  constructor(private storage: Storage, private modal: ModalController,
    private thermalService: ThermalPrintService) { 
    
    this.storage.forEach((value, key) => {
      if (key == 'mainurllink') {
        this.baseApiUrl = value;
      } else if (key == 'SessionBranchId') {
        this.dBranchId = Number(value);
      } else if (key == 'printer') {
        this.thermalPrintOption = value;
      }
    }).finally(() => {
      this.thermalService.onGetBranchId(this.baseApiUrl, this.dBranchId)
        .subscribe(res => {
          let branchItems: any = res;
          if (branchItems.length) {
            const printBranch = branchItems[0];
            this.thermalService.onprintThermal(this.printMain, this.printSub, printBranch, this.thermalPrintOption)
          }
         
      })
    })
  }

  onOkey() {
    this.modal.dismiss();
  }
  // modal
  ngOnInit() {}

}
