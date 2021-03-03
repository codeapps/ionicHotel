import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingPage } from './booking.page';
import { RoomRegisterComponent } from './room-register/room-register.component';

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
  declarations: [BookingPage, RoomRegisterComponent],
  providers: []
})
export class BookingPageModule {}
