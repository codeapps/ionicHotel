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
      if (key == "mainurllink") {
        this.basicApi = val;
      } else if (key == "SessionBranchId") {
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
        let dataSource = JSON.parse(res);
        
        let itemObj = {
          Amount: 0,
          BillDate: "",
          BillNo: "",
          Qty: 0,
          TableDetail_Name: "",
          child: []
        }
       
        let bill = false
        for (const res of dataSource) {
          if (!res.BillNo && !res.ProductName && res.TableDetail_Name) {
            itemObj.TableDetail_Name = res.TableDetail_Name
            bill = true
          } else if (res.BillNo && res.ProductName && !res.TableDetail_Name) {
            itemObj.BillNo = res.BillNo;
            itemObj.BillDate = res.BillDate;
            if (bill) {
              itemObj.child.push(res);
            }

          } else if (res.ProductName == 'Total') {
            itemObj.Qty = res.Qty;
            itemObj.Amount = res.Amount;
            
            this.onPushed(itemObj);
            itemObj = {
              Amount: 0,
              BillDate: "",
              BillNo: "",
              Qty: 0,
              TableDetail_Name: "",
              child: []
            }
            
            bill = false;
           
          }

        }

      })

  }

  onPushed(items) {
    this.kotSource.push(items);
    
  }
}
