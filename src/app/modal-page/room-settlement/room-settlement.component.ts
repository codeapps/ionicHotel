import { RoomRegisterService } from './../../booking/room-register/room-register.service';
import { Storage } from '@ionic/storage';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-room-settlement',
  templateUrl: './room-settlement.component.html',
  styleUrls: ['./room-settlement.component.scss'],
})
export class RoomSettlementComponent implements OnInit {
  @Input() roomId: any; 
  basicUrl: string = '';
  dBranchId: any = '';
  roomsMain: any = {billsericeID: '', payTerms: ''};
  billserice: any[];
  roomView: boolean = true;
  roomSource: any[] = [];
  selectedRooms: any[] = [];
  staffId: number = 0;
  constructor(
    public modalController: ModalController,
    private appService: AppService,
    storage: Storage,
    private roomService: RoomRegisterService,
    public toastController: ToastController
  ) { 
    storage.forEach((val, key) => {
      if (key == 'mainurllink') {
        this.basicUrl = val
      } else if (key == 'SessionStaffId') { 
        this.staffId = val
      } else if (key == 'SessionBranchId') 
        this.dBranchId = val;
    }).finally(() => {
      this.fnGetBillSeries();
    })
  }

  ngOnInit() {
    
   }
  
  fnGetBillSeries() {
    this.appService.getBillSerice(this.basicUrl)
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
          this.roomsMain.billsericeID = this.billserice[0].BillSerId;
          this.roomsMain.payTerms = 'CASH';
          this.roomsMain.discount = 0;
          this.fnRoomsGets();
        }
        
    })
  }

  fnRoomsGets() {
    this.roomService.ongetRoomDetails(this.roomsMain.RoomRegistration_Id, this.dBranchId, this.basicUrl)
      .toPromise().then(res => {
        this.roomSource = JSON.parse(res);
        this.roomSource.map(x => x.checked = true);
        this.selectedRooms = JSON.parse(res);
        this.fngetTaxableAmout();
    })
  }
 
  selectRM(eve, item) {
    const eventFlag: boolean = eve.target.checked;
    if (eventFlag) 
      this.selectedRooms.push(item);
    else {
      const index = this.selectedRooms.indexOf(item);
      this.selectedRooms.splice(index, 1);
    }
    this.fngetTaxableAmout();
  }

  fngetTaxableAmout() {
    this.roomsMain.billAmount = 0;
    this.roomsMain.totalAmount = 0;
    this.roomsMain.netAmount = 0;
    if (!this.selectedRooms.length) {
      
      return
    };
    let TaxPerc = 0, RentAmt = 0, billTotal = 0, Advance = 0;

      for (const room of this.selectedRooms) {
        let TaxPercentage = room.RoomType_Tax;
        let RentAmts = room.RoomType_Rent;
        Advance = room.Registration_AdvanceAmt;

        TaxPerc = TaxPercentage;
        RentAmt = RentAmt + RentAmts;
      }
      
      billTotal = RentAmt + ((RentAmt * TaxPerc) / 100);
      this.roomsMain.netAmount = billTotal;
      this.roomsMain.Registration_AdvanceAmt = Advance;
      this.roomsMain.totalAmount = billTotal;
      this.roomsMain.billAmount = this.roomsMain.netAmount - this.roomsMain.Registration_AdvanceAmt;

    let disc = this.roomsMain.discount;
    if (disc) {
      this.roomsMain.billAmount = this.roomsMain.billAmount - disc;
      this.roomsMain.totalAmount = this.roomsMain.totalAmount - disc;
    }
    
  }

  onClose() {
    this.modalController.dismiss()
  }

  fnsaveBill() {
    if (!this.selectedRooms.length) {
        this.alertToast('Rooms Not Avilable', 'warning!')
        return
      }
    this.roomService.roomSettlement(this.roomsMain, this.selectedRooms,
      this.dBranchId,this.staffId, this.basicUrl)
      .toPromise().then(res => {
        this.successToast('Room Checkout Successfully!')
      
        this.modalController.dismiss(true);
    })
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
