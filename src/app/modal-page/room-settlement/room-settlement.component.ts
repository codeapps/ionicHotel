import { RoomRegisterService } from './../../booking/room-register/room-register.service';
import { Storage } from '@ionic/storage';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-room-settlement',
  templateUrl: './room-settlement.component.html',
  styleUrls: ['./room-settlement.component.scss'],
})
export class RoomSettlementComponent implements OnInit {
  @Input() roomId: any; 
  basicUrl: string = '';
  dBranchId: any = '';
  roomsMain: any;
  billserice: any[];
  constructor(
    public modalController: ModalController,
    storage: Storage,
    private roomService: RoomRegisterService,
    public toastController: ToastController
  ) { 
    storage.forEach((val, key) => {
      if (key == 'mainurllink') {
        this.basicUrl = val
      } else if (key == 'SessionBranchId') 
        this.dBranchId = val;
    }).finally(() => {
      this.fnGetBillSeries();
    })
  }

  ngOnInit() {
    
   }
  
  fnGetBillSeries() {
    this.roomService.getBillSerice(this.basicUrl)
      .toPromise().then(res => {
        this.billserice = res;
        this.getBookedRooms();
    })
  }
  getBookedRooms() {
    this.roomService.ongetBookedRooms('', this.dBranchId, this.basicUrl)
      .toPromise().then(res => {
        let json:any[] = JSON.parse(res);
        if (json && json.length) {
          this.roomsMain = json.find(x => x.Room_Id == this.roomId);
          console.log(this.roomsMain);
          
        }
        
        
        
    })
  }
  onClose() {
    this.modalController.dismiss()
  }
}
