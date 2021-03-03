import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RoomRegisterService } from './room-register.service';

@Component({
  selector: 'app-room-register',
  templateUrl: './room-register.component.html',
  styleUrls: ['./room-register.component.scss'],
})
export class RoomRegisterComponent implements OnInit {
  dBranchId: string = '';
  basicUrl: string = '';
  constructor(private storage: Storage, private roomService: RoomRegisterService) {
   
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
      console.log(res);
      
    })
  }
}
