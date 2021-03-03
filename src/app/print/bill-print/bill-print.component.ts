import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/app.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { ModalController } from '@ionic/angular';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx';
// import { File, IWriteOptions } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-bill-print',
  templateUrl: './bill-print.component.html',
  styleUrls: ['./bill-print.component.scss'],
})
export class BillPrintComponent implements OnInit {
  @Input() billSerId: string;
  @Input() billNo: string;
  @Input() uniqueNo: string;
  @Input() printType: string;
  JsonIssueSubDetailsInfo: any = [];
  JsonIssueTaxInfo: any = [];
  JsonBranchInfo: any = [];
  JsonIssueInfo: any = [];
  
  constructor(private appService: AppService,
    
    private modalCtrl: ModalController,
    private printer: Printer, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('mainurllink')
      .then(res => {
        this.fnBillPrint(res)
    })
  }

  fnBillPrint(url) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Issues_CopyBillNoProductGroupwise';
  
    let oProcParams = [];
    
    let ProcParams = {};
    ProcParams['strKey'] = 'BillSerId';
    ProcParams['strArgmt'] = this.billSerId.toString();
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'Issues_BillNo';
    ProcParams['strArgmt'] = this.billNo.toString();
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'Unique_No';
    ProcParams['strArgmt'] = this.uniqueNo.toString();
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'Issues_OrderFrom';
    ProcParams['strArgmt'] = this.printType.toString();
    oProcParams.push(ProcParams);
  
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post(`${url}/CommonQuery/fnGetDataReportReturnMultiTable`, body)
      .toPromise().then(res => {
        let jsonobj = JSON.parse(res);
        
        this.JsonIssueSubDetailsInfo = JSON.parse(jsonobj[1]);
        this.JsonIssueTaxInfo =JSON.parse(jsonobj[2]);
        this.JsonBranchInfo = JSON.parse(jsonobj[3])[0];
        this.JsonIssueInfo = JSON.parse(jsonobj[0])[0];
    })
  }
  
  onPrint() {
    // this.printer.isAvailable().then(onSuccess);
    let options: PrintOptions = {
      name: 'MyDocument',
      duplex: true,
      orientation: 'portrait',
      monochrome: true
    }
    const content = document.getElementById('print-content').innerHTML;
    
      const page = `<html>
    <head>
    <link rel="stylesheet" type="text/css" href="assets/css/billlist-print.css" />
    </head>
    <body>
    ${content}
    </body>
    </html>`;
    this.printer.print(page, options)
      .then((onSuccess) => {
        console.log(onSuccess);
    });
  }

  onShare() {
    // const content = document.getElementById('print-content').innerHTML;
    // let buffer = new Blob([content], {type:'Buffer'});

    // const directory = this.file.cacheDirectory;
    // let date = new Date().getTime();
    // const fileName = `bill_${date}.pdf`;

    // let options: IWriteOptions = { replace: true };

    // this.file.checkFile(directory, fileName)
    //   .then((success) => {
    //     this.socialSharing.share('bills', null, directory + fileName, null)
    //   }).catch((error) => {
    //     this.file.writeFile(directory, fileName, buffer)
    //       .then((success) => {
    //         setTimeout(() => {
    //           this.socialSharing.share('invoiceBill', null, directory + fileName, null);
    //         });
    //       }).catch((err) => {
    //         console.log(err);
    //       });
    // })
    
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  onTotalQty() { 
   return this.JsonIssueSubDetailsInfo.map(x => parseFloat(x.IssuesSub_Qty || 0)).reduce((a, b) => a + b);
  }
  
  onTotalAmount() {
    return this.JsonIssueSubDetailsInfo.map(x => parseFloat(x.IssuesSub_Amt || 0)).reduce((a, b) => a + b);
  }
}
