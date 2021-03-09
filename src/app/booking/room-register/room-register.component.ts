import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RoomDtailsComponent } from 'src/app/modal-page/room-dtails/room-dtails.component';
import { RoomSettlementComponent } from 'src/app/modal-page/room-settlement/room-settlement.component';
import { RoomRegisterService } from './room-register.service';

@Component({
  selector: 'app-room-register',
  templateUrl: './room-register.component.html',
  styleUrls: ['./room-register.component.scss'],
})
export class RoomRegisterComponent implements OnInit {
  dBranchId: string = '';
  basicUrl: string = '';
  roomSource: any[] = [];
  floorSource: any[] = [];
  disable = false;
  constructor(storage: Storage,
    private toastController: ToastController,
    public modalController: ModalController,
    private roomService: RoomRegisterService) {
   
    storage.forEach((val, key) => {
      if (key == 'mainurllink') {
        this.basicUrl = val
      } else if (key == 'SessionBranchId') 
        this.dBranchId = val;
    }).finally(() => {
      this.getFloor();
    })
   
   
  }

  ngOnInit() {
    
  }

  getFloor() {
    this.roomService.onGetFloor(this.basicUrl, this.dBranchId)
      .subscribe(res => {
        let json = JSON.parse(res);
        this.roomSource = JSON.parse(json[0]);
        this.roomSource.map(x => x.selected = false);
        this.floorSource = JSON.parse(json[1]);
        
    })
  }
  
  onClick(room, index) {
    if (room.Room_IsBook == 'Yes') {
      this.roomSettleModal(room.Room_Id);
      // this.alertToast('Already Booked The Enter Room', 'warning')
      return
    }
    const item = this.roomSource[index];
    item.selected = !item.selected;
    this.disable = this.roomSource.map(x => x.selected).some(x => x)
  }
  
 
  onColor(selected) {
   
    if (selected) {
      return 'success';
    } else {
      return 'secondary';
    }
  }

  async roomRegModal() {
    let filterProps = this.roomSource.filter(x => x.selected);
    const modal = await this.modalController.create({
      component: RoomDtailsComponent,
      componentProps: { params: filterProps },
      animated: false
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) 
      this.getFloor();
   
  }

  async roomSettleModal(id) {
  
    const modal = await this.modalController.create({
      component: RoomSettlementComponent,
      componentProps: { roomId: id },
      animated: false
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) 
      this.getFloor();
     
    
     
  }

  
  
  async alertToast(msg:string, header:string) {
    const toast = await this.toastController.create({
      header:header,
      message: msg, 
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}
