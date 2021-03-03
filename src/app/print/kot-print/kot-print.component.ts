import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-kot-print',
  templateUrl: './kot-print.component.html',
  styleUrls: ['./kot-print.component.scss'],
})
export class KotPrintComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}
  onClose() {
    this.modalCtrl.dismiss();
  }
}
