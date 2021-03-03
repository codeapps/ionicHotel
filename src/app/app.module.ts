import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { Printer } from '@ionic-native/printer/ngx';
import { DatePipe } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AddCustomerComponent } from './modal-page/add-customer/add-customer.component';
import { PaymentComponent } from './modal-page/payment/payment.component';
import { DialogueBillComponent } from './pointofsales/dialogue-bill/dialogue-bill.component';
import { FormsModule } from '@angular/forms';
import { ThermalPrintComponent } from './print/thermal-print/thermal-print.component';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BtModalPage, PrintSettingsComponent } from './print/print-settings/print-settings.component';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx';
// import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [
    AppComponent,
    AddCustomerComponent,
    PaymentComponent,
    DialogueBillComponent,
    ThermalPrintComponent,
    PrintSettingsComponent,
    BtModalPage],
  entryComponents: [
    AddCustomerComponent,
    PaymentComponent,
    DialogueBillComponent,
    ThermalPrintComponent,
    BtModalPage],
  imports: [
    
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Printer,
    BluetoothSerial,
    DatePipe,
    Keyboard
    // SocialSharing,
    // File
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
