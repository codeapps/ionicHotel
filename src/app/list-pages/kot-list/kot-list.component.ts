import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-kot-list',
  templateUrl: './kot-list.component.html',
  styleUrls: ['./kot-list.component.scss'],
})
export class KotListComponent implements OnInit {
  kotSource: any[] = [];
  basicApi: string = '';
  branchId: number = 0;
  constructor(private appService: AppService,
    private storage: Storage) {
      storage.forEach((val, key) => {
        if (key=="mainurllink") {
          this.basicApi = val;
        } else if (key=="SessionBranchId") {
          this.branchId = val;
        }
      }).finally(() => {
        this.onKotBillGetOnTableDetailId();
      })
     }

  ngOnInit() { }
  
  onKotBillGetOnTableDetailId() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Kot_PendingBillGetOnAll';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this.appService.post(this.basicApi + '/CommonQuery/fnGetDataReportNew', body)
      .subscribe(res => {
      this.kotSource = JSON.parse(res)
      
    })

  }

}
