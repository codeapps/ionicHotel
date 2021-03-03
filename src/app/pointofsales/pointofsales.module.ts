import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TableorderComponent } from './tableorder/tableorder.component';
import { DialoguesSalesmanComponent } from './dialogues-salesman/dialogues-salesman.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { BillPrintComponent } from '../print/bill-print/bill-print.component';
import { KotPrintComponent } from '../print/kot-print/kot-print.component';
import { KotListComponent } from '../list-pages/kot-list/kot-list.component';
import { BillListComponent } from '../list-pages/bill-list/bill-list.component';


const routes: Routes = [
  {
    path: '',
    component: TableorderComponent
  }, {
    path: 'order',
    component: OrderdetailsComponent
  },
  {
    path: 'kotlist',
    component: KotListComponent,
    
  },
  {
    path: 'billList',
    component: BillListComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TableorderComponent,
    DialoguesSalesmanComponent,
    OrderdetailsComponent,
    BillPrintComponent,
    KotPrintComponent,
    KotListComponent,
    BillListComponent
  ],
  entryComponents: [
    DialoguesSalesmanComponent,
    BillPrintComponent,
    KotPrintComponent
  ]
})
export class PointofsalesPageModule {}
