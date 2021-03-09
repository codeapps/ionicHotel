import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './login/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }, {
      
      title: 'Room Booking',
      url: '/booking/roomregister',
      icon: 'bed'
    },
    {
      
      title: 'Products',
      url: 'products',
      icon: 'wine'
    },
    {
      title: 'Kot List',
      url: '/pointofsales/kotlist',
      icon: 'list-box'
    },
    {
      title: 'Bill List',
      url: '/pointofsales/billList',
      icon: 'book'
    },
    {
      title: 'POS New',
      url: '/pos-table',
      icon: 'phone-portrait'
      
    },
    {
      title: 'Point of Sales',
      url: '/pointofsales',
      icon: 'restaurant'
      
    },
    {
      title: 'Printer Settings',
      url: '/print-settings',
      icon: 'print'
      
    },
    
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authenticationService.authState.subscribe(state => {
        if (state) {
          this.router.navigate(['userpincode']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }

  logOut() {
    this.authenticationService.logout();
  }
}
