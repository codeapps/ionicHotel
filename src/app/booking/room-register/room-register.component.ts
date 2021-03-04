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
  roomSource: any[] = [];
  floorSource: any[] = [];
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
        let json = JSON.parse(res);
        this.roomSource = JSON.parse(json[0]);
        this.roomSource.map(x => x.selected = false);
        this.floorSource = JSON.parse(json[1]);
        
    })
  }
  disable = false;
  onClick(index) {
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
}
