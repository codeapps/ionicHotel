import { RoomRegisterService } from './../../booking/room-register/room-register.service';
import { Storage } from '@ionic/storage';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-room-dtails',
  templateUrl: './room-dtails.component.html',
  styleUrls: ['./room-dtails.component.scss'],
})
export class RoomDtailsComponent implements OnInit {
  @Input() params: any[];

  roomMain = {
    id: 0,
    bookingId: 0,
    custName: '',
    address: '',
    mail: '',
    mobile: '',
    idProof: 'aadhar',
    idDescription: '',
    checkInDate: '',
    checkInTime: '',
    checkOutDate: '',
    checkOutTime: '',
    child: 0,
    adult: 0,
    noofDays: 0,
    preAmount: 0,

  }
  identification: any[] = [];
  dBranchId: any = '';
  basicUrl: string = '';
  constructor(public modalController: ModalController,
    storage: Storage,
    private roomService: RoomRegisterService,
    public toastController: ToastController) {
    let nowDate = new Date().toISOString();
    let nowTime = new Date().toLocaleString();
    this.roomMain.checkInDate = nowDate;
    this.roomMain.checkInTime = nowTime;
    this.roomMain.checkOutDate = nowDate;
    this.roomMain.checkOutTime = nowTime;
    storage.forEach((val, key) => {
      if (key == 'mainurllink') {
        this.basicUrl = val
      } else if (key == 'SessionBranchId') 
        this.dBranchId = val;
    }).finally(() => {
      this.getIdentification();
    })
   }

  ngOnInit() {
  
  }

  onClose() {
    this.modalController.dismiss();
  }

  totalAmt() {
    if (this.params.length)
      return this.params.map(x => parseFloat(x.RoomType_Rent)).reduce((a, b) => a + b);
  }

  getIdentification() {
    this.roomService.getIdentfications(this.basicUrl)
      .subscribe(result => {
        this.identification = result;
        this.roomMain.idProof = this.identification[0].IdentificationId
      }, error => console.error(error));
  }

  fnSave() {
  
    if (!this.roomMain.custName) {
      this.alertToast('Please Enter The Customer Name', 'Warning');
      return;
    }
    if (!this.roomMain.address) {
      this.alertToast('Please Enter The Customer Address', 'Warning');
      return;
    }
    if (!this.roomMain.idDescription) {
      this.alertToast('Please Select Identification Desc', 'Warning');
      return;
    }
    if (!this.roomMain.adult) {
      this.alertToast('Please Enter The No Of Adults..', 'Warning');
      return;
    }
    if (!this.roomMain.noofDays) {
      this.alertToast('Invalid Date Entry', 'Warning');
      return;
    }
   
    this.roomService.onRoomInsert(this.roomMain, this.params, this.dBranchId, this.basicUrl)
      .subscribe(data => {
        this.successToast('Saved Successfully');
        this.modalController.dismiss(true)
    });
  }

  async alertToast(msg, header) {
    const toast = await this.toastController.create({
      header:header,
      message: msg,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async successToast(msg) {
    const toast = await this.toastController.create({
      header:'Success',
      message: msg,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

}
