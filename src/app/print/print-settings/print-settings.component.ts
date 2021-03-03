import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ThermalPrintService } from '../thermal-print/thermal-print.service';

@Component({
  selector: 'app-print-settings',
  templateUrl: './print-settings.component.html',
  styleUrls: ['./print-settings.component.scss'],
})
export class PrintSettingsComponent implements OnInit {
  
  printerOption = {
      defaultPrint: false,
      btName:'', 
      btId:'',
      btAddress:'',
      pageSize: '2inch',
      extraLine: 0,
      textSize: 'regular',
      numCopies: 1,
      cmpName: true,
      address: true,
      email:true,
      phoneNo:true,
      gstIn:true,
      totalQty:true,
      decimal:true,
      rcvedAmount:true,
      balAmount:true,
      taxDetail:true,
      description: ['Thank you for doing business with us.', 'Powered By www.codeapps.in'],
      tandc: true,
  } 
  
  constructor(private print: ThermalPrintService,
    public modalController: ModalController,
    private storage: Storage) { 
      this.storage.get('printer').then(res => {
        if (res) {
          setTimeout(() => {
            this.printerOption = res;
          });
          
        }
      })
    }

  ngOnInit() {
    
  }

  addDesc() {
    this.printerOption.description.push('');
  }

  removeDesc(index) {
    this.printerOption.description.splice(index, 1);
    this.setPrinter();
  }

  selectPrinter(macAddress) {
    //Selected printer macAddress stored here
    this.printerOption.btAddress = macAddress;
    }
  
    printStuff() {
      //The text that you want to print
      
      var myText="Star Clothing Boutique\n" +
      "             123 Star Road\n" +
      "           City, State 12345\n" +
      "\n" +
      "Date:MM/DD/YYYY          Time:HH:MM PM\n" +
      "--------------------------------------\n" +
      "SALE\n" +
      "SKU            Description       Total\n" +
      "300678566      PLAIN T-SHIRT     10.99\n" +
      "300692003      BLACK DENIM       29.99\n" +
      "300651148      BLUE DENIM        29.99\n" +
      "300642980      STRIPED DRESS     49.99\n" +
      "30063847       BLACK BOOTS       35.99\n" +
      "\n" +
      "Subtotal                        156.95\n" +
      "Tax                               0.00\n" +
      "--------------------------------------\n" +
      "Total                          $156.95\n" +
      "--------------------------------------\n" +
      "\n" +
      "Charge\n" +
      "156.95\n" +
      "Visa XXXX-XXXX-XXXX-0123\n" +
      "Refunds and Exchanges\n" +
      "Within 30 days with receipt\n" +
        "And tags attached\n";
      this.print.sendToBluetoothPrinter(this.printerOption.btAddress,myText);
    }
    async pairedDeviceModal() {
      const modal = await this.modalController.create({
        component: BtModalPage,
        componentProps: {
          btOption: this.printerOption
        }
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
     
      if (data) {
        this.printerOption.btName = data.name;
        this.printerOption.btId = data.id;
        this.printerOption.btAddress = data.address;
        this.setPrinter();
      }
    
    }
  
 lineIncrease() {
    if (this.printerOption.extraLine < 10) {
      this.printerOption.extraLine += 1;
      this.setPrinter();
    }
  }

  lineDecrease() {
    if (this.printerOption.extraLine > 0) {
      this.printerOption.extraLine -= 1;
      this.setPrinter();
    }
  }

  pageIncrease() {
    if (this.printerOption.numCopies < 9) {
      this.printerOption.numCopies += 1;
      this.setPrinter();
    }
  }

  pageDecrease() {
    if (this.printerOption.numCopies > 1) {
      this.printerOption.numCopies -= 1;
      this.setPrinter();
    }
  }

  setPrinter() {
    setTimeout(() => {
      this.storage.set('printer', this.printerOption); 
      this.print.onPrinterSet(this.printerOption);
    });
    
    }
  
}

@Component({
  selector: 'btmodal-page',
  templateUrl: './btmodal-page.component.html'
})
export class BtModalPage { 
  bluetoothList: any = [];
  defaultBtItem: any;
  btloading: boolean;
  constructor(private print: ThermalPrintService,
    navParams: NavParams,
    public modalController: ModalController) {
      this.defaultBtItem = navParams.get('btOption')
    this.searchPrinter();
  }
  searchPrinter() {
    // UBXi9100
    this.btloading = true;
    this.print.searchBluetoothPrinter()
      .then(resp => {
        //List of bluetooth device list
        this.bluetoothList = resp;
        this.bluetoothList.map(x => {
          if (x.address == this.defaultBtItem.btAddress &&
            x.name ==  this.defaultBtItem.btName &&
            x.id ==  this.defaultBtItem.btId) {
            return x.active = true;
          }
        })
        
        this.btloading = false;
      }).catch((err) => {
        console.error(err);
        
        this.btloading = false;
      });
  }

  setDefault(bt) {
    this.modalController.dismiss(bt);
  }

  close() {
    this.modalController.dismiss();
  }
}