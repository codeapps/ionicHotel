import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TableorderComponent } from './tableorder/tableorder.component';
import { DialoguesSalesmanComponent } from './dialogues-salesman/dialogues-salesman.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { DialogueBillComponent } from './dialogue-bill/dialogue-bill.component';



const routes: Routes = [
  {
    path: '',
    component: TableorderComponent
  } , {
    path: 'order',
    component: OrderdetailsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TableorderComponent, DialoguesSalesmanComponent, OrderdetailsComponent, DialogueBillComponent],
  entryComponents: [DialoguesSalesmanComponent, DialogueBillComponent]
})
export class PointofsalesPageModule {}
