import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'charset=utf-8'
  })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  slideOneForm: FormGroup;
  UrlForms: FormGroup;
  urlactive: boolean;
  branchInfo: any;
  apiUrl: any;

  constructor(public formBuilder: FormBuilder, public http: HttpClient,
    private storage: Storage, public toastController: ToastController,
    public loadingController: LoadingController,private actionSheetController:ActionSheetController,
    private router: Router) {

    this.slideOneForm = formBuilder.group({
      username: '',
      password: '',
      branch: ''
    });
    this.UrlForms = formBuilder.group({
      urllinks: '',
    });

    this.storage.get('mainurllink').then((val) => {
      if (val == null) {
        this.urlactive = true;
      } else {
        this.apiUrl = val;
        this.getBranch(this.apiUrl);
      }
    });
  }


  ngOnInit() {

  }
  async presentActionSheet(value) {
    if (!value.form.valid) {
      // let domainUrl = 'https://' + value.form.value.urllinks + '/WebApi/Api';
      // this.getBranch(domainUrl);
      this.presentToast('Please fill out all details accurately.');
      return;
    } 

    const actionSheet = await this.actionSheetController.create({
      header: 'Connection is',
      buttons: [{
        text: 'Secure',
        icon: 'lock',
        handler: () => {
          let domainUrl = 'https://' + value.form.value.urllinks + '/WebApi/Api';
          this.getBranch(domainUrl);
        }
      }, {
        text: 'Un Secure',
        icon: 'unlock',
        handler: () => {
          let domainUrl = 'http://' + value.form.value.urllinks + '/WebApi/Api';
          this.getBranch(domainUrl);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async onUrlLogin(value) {
    if (value.form.valid) {

      let domainUrl = 'https://' + value.form.value.urllinks + '/WebApi/Api';
      this.getBranch(domainUrl);

    } else {
      this.presentToast('Please fill out all details accurately.');
    }

  }

  onLogin(value) {

    let strUserName = value.form.value.username;
    let strpassword = value.form.value.password;
    let dBranchId = value.form.value.branch;
    if (value.form.valid) {
      let AccountHeadInfo = {};
      AccountHeadInfo['UserName'] = strUserName;
      AccountHeadInfo['Pwd'] = strpassword;
      AccountHeadInfo['BranchId'] = dBranchId;
      let body = JSON.stringify(AccountHeadInfo);
      this.http.post<any>(this.apiUrl + '/Master/StaffLogin', body, httpOptions).toPromise()
        .then(async data => {
          let dataReport = JSON.parse(data);
          if (dataReport.length > 0) {
            this.storage.set('SessionBranchId', dBranchId);
            this.storage.set('SessionStaffId', dataReport[0].StaffId);
            this.router.navigate(['pointofsales']);
          } else {
            this.presentToast('Invalid Username Or Password!');
          }
        }, error => console.error(error));
    } else {
      this.presentToast('Please fill out all details accurately.');
    }

  }


  async getBranch(domainUrl) {
    const loading = await this.loadingController.create({
      message: 'Loading',
    });
    await loading.present();
    this.http.get(domainUrl + '/branchGet').subscribe(result => {
      this.branchInfo = result;
      this.storage.clear();
      loading.dismiss();
      this.storage.set('mainurllink', domainUrl);
      this.apiUrl = domainUrl;
      this.urlactive = false;
      this.slideOneForm.setValue({ username: '', password: '', branch: this.branchInfo[0].BranchId });
    }, error => {
      this.presentToast('Not Found Please Contact Branch !');
      loading.dismiss();
    });
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
