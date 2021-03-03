import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-user-pincode',
  templateUrl: './user-pincode.page.html',
  styleUrls: ['./user-pincode.page.scss'],
  
})
export class UserPincodePage implements OnInit {
 
  public show: boolean = true;
  public crfocusIndex = 0;
  public focusIndex = 0;
  pinCreate = {
    newpin: '',
    repin: '',
  };

  pin = {
    a: '',
    b: '',
    c: '',
    d: ''
  };

  constructor(
    private storage: Storage,
    private router: Router,
    private toastControl: ToastController) {
    storage.get('USER_PIN').then(res => {
        if (!res) {
           this.show = false;
        } else {
          this.pinCreate.repin = res;
        }
      })
     }

  ngOnInit() {
  
  }

  
  onCreatePressed(eve) {
    
    if (eve == 'ok') {
      this.onCreatePin();
      return
    }
    if (this.crfocusIndex == 0) {
      
      if (eve == 'back') {
        const editedText = this.pinCreate.newpin.slice(0, -1);
        this.pinCreate.newpin = editedText;
        return
      }
      if (this.pinCreate.newpin.length > 3) {
        return
      }
      this.pinCreate.newpin += eve;
    } else if (this.crfocusIndex == 1) {
      if (eve == 'back') {
        const editedText = this.pinCreate.repin.slice(0, -1);
        this.pinCreate.repin = editedText;
        return
      }
      if (this.pinCreate.repin.length > 3) {
        return
      }
      this.pinCreate.repin += eve;
    }
    
    
  }

  onKeyPressed(eve) {
    if (eve == 'back') {
      this.pin.a = '';
      this.pin.b = '';
      this.pin.c = '';
      this.pin.d = ''
      this.focusIndex = 0
      return
    } 
    if (eve == 'ok') {
      this.onSubmit();
      return
    }
    
    this.fnKeyFill(eve);
    if (this.focusIndex != 3)
      this.focusIndex += 1;
    
      if (this.pin.a && this.pin.b && this.pin.c  && this.pin.d ) {
        this.onSubmit()
        return
      }
  }


  fnKeyFill(eve) {
    if (this.focusIndex == 0) {
      this.pin.a = eve;
    } else if (this.focusIndex == 1) {
      this.pin.b = eve;
    } else if (this.focusIndex == 2) {
      this.pin.c = eve;
    } else if (this.focusIndex == 3) {
      this.pin.d = eve;
    }
  }

  async onSubmit() {
  
    if (this.pin.a && this.pin.b && this.pin.c && this.pin.d) {
      const pinNumber = this.pin.a + this.pin.b + this.pin.c + this.pin.d;
      let splitNmber = this.pinCreate.repin;
      if (pinNumber == splitNmber) {
        await this.router.navigate(['pos-table']);
        return
      } else {
        const toast = await this.toastControl.create({
          position: 'top',
          message: 'Enter Valid Pin Number!!',
          duration: 2000
        });
         toast.present();
      }
      
    } else {
      
      const toast = await this.toastControl.create({
        position: 'top',
        message: 'Enter Pin Number to continue!!',
        duration: 2000
      });
       toast.present();
    }
  }
  async onCreatePin() {
    if ((!this.pinCreate.newpin || this.pinCreate.newpin.length != 4) ||
        (!this.pinCreate.repin || this.pinCreate.repin.length != 4)) {
          const toast = await this.toastControl.create({
            position: 'top',
            message: 'Enter valid Pin Number!!',
            duration: 2000
          });
      toast.present();
      return
    } 
    if (this.pinCreate.newpin == this.pinCreate.repin) {
      this.storage.set('USER_PIN', this.pinCreate.repin)
        .then(res => {
          this.show = true;
        });
    } else {
      const toast = await this.toastControl.create({
        position: 'top',
        message: 'Enter Same Pin Number',
        duration: 2000
      });
      toast.present();
      
    }
    
  }
}
