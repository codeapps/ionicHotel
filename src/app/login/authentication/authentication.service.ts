import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authState = new BehaviorSubject(false);
  constructor(private storage: Storage,
    private router: Router,
    public toastController: ToastController,
    private appService: AppService,
    private platform: Platform) { 
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  ifLoggedIn() {
    this.storage.get('SessionStaffId').then((response) => {
      if (response) {
        this.authState.next(true);
      }
    });
  }

  onLogin(value, url) {
    let strUserName = value.form.value.username;
    let strpassword = value.form.value.password;
    let dBranchId = value.form.value.branch;
    if (value.form.valid) {
      let AccountHeadInfo = {};
      AccountHeadInfo['UserName'] = strUserName;
      AccountHeadInfo['Pwd'] = strpassword;
      AccountHeadInfo['BranchId'] = dBranchId;

      let body = JSON.stringify(AccountHeadInfo);
      this.appService.post(`${url}/Master/StaffLogin`, body).toPromise()
        .then(async data => {
          let dataReport = JSON.parse(data);
          if (dataReport.length > 0) {
            this.storage.set('SessionBranchId', dBranchId);
            this.storage.set('SessionStaffId', dataReport[0].StaffId)
              .then((response) => {
              this.router.navigate(['userpincode']);
              this.authState.next(true);
            });
          } else {
            this.presentToast('Invalid Username Or Password!');
          }
        }, error => console.error(error));
    } else {
      this.presentToast('Please fill out all details accurately.');
    }
  }

  logout() {
    this.storage.remove('SessionBranchId');
    this.storage.remove('SessionStaffId').then(() => {
      this.router.navigate(['login']);
      this.authState.next(false);
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      header: 'Oops !',
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }
}
