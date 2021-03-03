import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserPincodePage } from './user-pincode.page';
import { PosKeybordComponent } from '../components/pos-keybord/pos-keybord.component';

const routes: Routes = [
  {
    path: '',
    component: UserPincodePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserPincodePage, PosKeybordComponent]
})
export class UserPincodePageModule {}
