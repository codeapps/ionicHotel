import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingPage } from './booking.page';
import { RoomRegisterComponent } from './room-register/room-register.component';
import { RoomDtailsComponent } from '../modal-page/room-dtails/room-dtails.component';
import { RoomSettlementComponent } from '../modal-page/room-settlement/room-settlement.component';

const routes: Routes = [
  {
    path: '',
    component: BookingPage,
    children: [
      {
        path: 'roomregister',
        component: RoomRegisterComponent
      }
    ]
    
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    
    RouterModule.forChild(routes)
  ],
  declarations: [BookingPage, RoomRegisterComponent, RoomDtailsComponent, RoomSettlementComponent],
  entryComponents: [RoomDtailsComponent, RoomSettlementComponent],
  providers: []
})
export class BookingPageModule {}
