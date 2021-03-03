import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PosThermalDevicePage } from './pos-thermal-device.page';

const routes: Routes = [
  {
    path: '',
    component: PosThermalDevicePage
  },
  { path: ':id:name:type',      component: PosThermalDevicePage },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PosThermalDevicePage]
})
export class PosThermalDevicePageModule {}
