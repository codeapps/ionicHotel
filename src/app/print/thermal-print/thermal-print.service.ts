import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ThermalPrintService {
  printerBehaviour$ = new BehaviorSubject('');
  constructor(private http: HttpClient,
    private datePipe: DatePipe,
    private toastController: ToastController,
    public btSerial: BluetoothSerial) {

  }
  onPrinterSet(value) {
    this.printerBehaviour$.next(value);
  }
  onPrinterGet() {
    return this.printerBehaviour$.asObservable()
  }
  searchBluetoothPrinter() {
    //This will return a list of bluetooth devices
    return this.btSerial.list();
  }
  connectToBluetoothPrinter(macAddress) {
    //This will connect to bluetooth printer via the mac address provided
    return this.btSerial.connect(macAddress)
  }
  disconnectBluetoothPrinter() {
    //This will disconnect the current bluetooth connection
    return this.btSerial.disconnect();
  }
  //macAddress->the device's mac address
  //data_string-> string to be printer
  async sendToBluetoothPrinter(macAddress, data_string) {

    //1. Try connecting to bluetooth printer
    this.connectToBluetoothPrinter(macAddress)
      .subscribe(_ => {
        //2. Connected successfully
        this.btSerial.write(data_string)
          .then(_ => {
            //3. Print successful 
            //If you want to tell user print is successful,
            //handle it here
            //4. IMPORTANT! Disconnect bluetooth after printing
            this.disconnectBluetoothPrinter();

          }, err => {

            this.disconnectBluetoothPrinter();
            this.presentToast('printing not Completed');
            //If there is an error printing to bluetooth printer
            //handle it here
          })
      }, err => {

        this.presentToast('printer not connecting to bluetooth');
        //If there is an error connecting to bluetooth printer
        //handle it here
      })
  }
  async presentToast(mgs) {
    const toast = await this.toastController.create({
      message: mgs,
      duration: 2000
    });
    toast.present();
  }

  onGetBranchId(url, branchId) {
    return this.http.get(`${url}/GetRepository/branchGetWithBranchId?table&branchId=${branchId}`)
  }

  async onprintThermal(main, sub, branch, printOption) {
    if (!printOption) {
      this.presentToast('Thermal print not default printer..');
      return
    }
    
      let taxAmount = 0;
      let produtItems = '';
      let totalQty = 0;
      let decimal = 0;
      if (printOption.decimal) {
        decimal = 2;
      }

      for (const item of sub) {

        let itemLength = item.ItemName.length;
        let qty = this.onQtyLength(`${item.IssuesSubQty.toFixed(decimal)}`);
        const rate = this.onRateLength(`${item.IssuesSubActualRate.toFixed(decimal)}`);
        if (10 >= itemLength) {
          let itemName = this.onTotalItemDescLength(item.ItemName);
          produtItems += `${itemName}${qty}${rate}${(item.IssuesSubQty * item.IssuesSubActualRate).toFixed(decimal)}\x0a`;
        } else {
          let lpCount = itemLength / 30;
          for (let index = 0; index < lpCount; index++) {
            produtItems += `${item.ItemName.substring(30 * index, 30 * index + 30)}\x0a`;
          }
          produtItems += `\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20`;
          produtItems += `${qty}${rate}${(item.IssuesSubQty * item.IssuesSubActualRate).toFixed(decimal)}\x0a`;
        }

        totalQty += parseFloat(item.IssuesSubQty);
        taxAmount += parseFloat(item.IssuesSubTaxAmt);
      }


      let CMD = await {
        LF: '\x0a',
        ESC: '\x1b',
        FS: '\x1c',
        GS: '\x1d',
        US: '\x1f',
        FF: '\x0c',
        DLE: '\x10',
        DC1: '\x11',
        DC4: '\x14',
        EOT: '\x04',
        NUL: '\x00',
        EOL: '\n',
        FEED_CONTROL_SEQUENCES: {
          CTL_LF: '\x0a', // Print and line feed
          CTL_FF: '\x0c', // Form feed
          CTL_CR: '\x0d', // Carriage return
          CTL_HT: '\x09', // Horizontal tab
          CTL_VT: '\x0b', // Vertical tab
        },
        LINE_SPACING: {
          LS_DEFAULT: '\x1b\x32',
          LS_SET: '\x1b\x33'
        },
        HARDWARE: {
          HW_INIT: '\x1b\x40', // Clear data in buffer and reset modes
          HW_SELECT: '\x1b\x3d\x01', // Printer select
          HW_RESET: '\x1b\x3f\x0a\x00', // Reset printer hardware
        },
        CASH_DRAWER: {
          CD_KICK_2: '\x1b\x70\x00', // Sends a pulse to pin 2 []
          CD_KICK_5: '\x1b\x70\x01', // Sends a pulse to pin 5 []
        },
        MARGINS: {
          BOTTOM: '\x1b\x4f', // Fix bottom size
          LEFT: '\x1b\x6c', // Fix left size
          RIGHT: '\x1b\x51', // Fix right size
        },
        PAPER: {
          PAPER_FULL_CUT: '\x1d\x56\x00', // Full cut paper
          PAPER_PART_CUT: '\x1d\x56\x01', // Partial cut paper
          PAPER_CUT_A: '\x1d\x56\x41', // Partial cut paper
          PAPER_CUT_B: '\x1d\x56\x42', // Partial cut paper
        },
        TEXT_FORMAT: {
          TXT_NORMAL: '\x1b\x21\x00', // Normal text
          TXT_2HEIGHT: '\x1b\x21\x10', // Double height text
          TXT_2WIDTH: '\x1b\x21\x20', // Double width text
          TXT_4SQUARE: '\x1b\x21\x30', // Double width & height text

          TXT_CUSTOM_SIZE: function (width, height) { // other sizes
            var widthDec = (width - 1) * 16;
            var heightDec = height - 1;
            var sizeDec = widthDec + heightDec;
            return '\x1d\x21' + String.fromCharCode(sizeDec);
          },

          TXT_HEIGHT: {
            1: '\x00',
            2: '\x01',
            3: '\x02',
            4: '\x03',
            5: '\x04',
            6: '\x05',
            7: '\x06',
            8: '\x07'
          },
          TXT_WIDTH: {
            1: '\x00',
            2: '\x10',
            3: '\x20',
            4: '\x30',
            5: '\x40',
            6: '\x50',
            7: '\x60',
            8: '\x70'
          },

          TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF
          TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON
          TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON
          TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF
          TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON
          TXT_ITALIC_OFF: '\x1b\x35', // Italic font ON
          TXT_ITALIC_ON: '\x1b\x34', // Italic font ON

          TXT_FONT_A: '\x1b\x4d\x00', // Font type A //normal font
          TXT_FONT_B: '\x1b\x4d\x01', // Font type B //small font
          TXT_FONT_C: '\x1b\x4d\x02', // Font type C //normal font

          TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification
          TXT_ALIGN_CT: '\x1b\x61\x01', // Centering
          TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification
        },

      };
      let date = this.datePipe.transform(main.IssuesDate, 'dd/MM/yyyy')

      let branchName = '';
      if (printOption.cmpName) {
        branchName = CMD.TEXT_FORMAT.TXT_BOLD_ON +
          branch.BranchName +
          CMD.FEED_CONTROL_SEQUENCES.CTL_LF;
      }
      let branchAddress = '';
      if (printOption.address) {
        branchAddress = branch.BranchAdr1 +
          CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
          CMD.TEXT_FORMAT.TXT_BOLD_OFF +
          branch.BranchAdr2 +
          CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
          CMD.TEXT_FORMAT.TXT_BOLD_OFF +
          branch.BranchAdr3 +
          CMD.FEED_CONTROL_SEQUENCES.CTL_LF;
      }
      let taxAmountVisible = '';
      if (printOption.taxDetail) {
        taxAmountVisible = CMD.TEXT_FORMAT.TXT_BOLD_ON +
          "Tax\x20Amount\x20:\x20\x20\x20" +
          CMD.TEXT_FORMAT.TXT_BOLD_ON +
          taxAmount.toFixed(decimal) +
          CMD.FEED_CONTROL_SEQUENCES.CTL_LF;
      }

      let description = '';

      if (printOption.tandc) {
        for (const desc of printOption.description) {
          description += desc +
            CMD.FEED_CONTROL_SEQUENCES.CTL_LF;
        }

      }

      let content =
        // CMD.TEXT_FORMAT.TXT_ALIGN_CT +
        // CMD.TEXT_FORMAT.TXT_BOLD_ON +
        // CMD.TEXT_FORMAT.TXT_NORMAL +
        // CMD.TEXT_FORMAT.TXT_FONT_A +
        CMD.TEXT_FORMAT.TXT_ALIGN_CT +
        branchName +
        branchAddress +
        CMD.TEXT_FORMAT.TXT_BOLD_ON +
        "Tax Invoice" +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.TEXT_FORMAT.TXT_BOLD_OFF +
        CMD.TEXT_FORMAT.TXT_ALIGN_LT +
        main.IssuesCustName + "\x20\x20" +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.TEXT_FORMAT.TXT_ALIGN_RT +
        "Date:\x20" +
        date +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        // CMD.TEXT_FORMAT.TXT_ALIGN_LT +
        // mainSource.Addr1+"\x20\x20" +
        // CMD.MARGINS.RIGHT +
        // "GSTIN:\x20" +
        // mainSource.Tin1 +
        // CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.TEXT_FORMAT.TXT_ALIGN_RT +
        "Invoice No:" +
        CMD.TEXT_FORMAT.TXT_WIDTH[3] +
        main.billseriesName + '-' + main.IssuesBillNo +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        "--------------------------------" +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.TEXT_FORMAT.TXT_ALIGN_LT +
        "Name\x20\x20\x20\x20\x20\x20\x20Qty\x20\x20\x20Price\x20\x20\x20\x20Amount" +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        "--------------------------------" +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.TEXT_FORMAT.TXT_ALIGN_LT +
        
        produtItems +
        "--------------------------------" +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        "Total\x20\x20\x20\x20\x20\x20" +
        // Total Qty
        this.onTotalQtyLength(`${totalQty.toFixed(decimal)}`) +
        main.IssuesAtotal.toFixed(decimal) + // Total Amnount
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        "--------------------------------" +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.TEXT_FORMAT.TXT_ALIGN_RT +
        CMD.TEXT_FORMAT.TXT_BOLD_ON +
        "Sub Total\x20:\x20\x20\x20" +
        CMD.TEXT_FORMAT.TXT_BOLD_ON +
        main.IssuesTotal.toFixed(decimal) +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        taxAmountVisible +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.TEXT_FORMAT.TXT_BOLD_ON +
        "Total\x20:\x20\x20\x20" +
        CMD.TEXT_FORMAT.TXT_BOLD_ON +
        main.IssuesTotal.toFixed(decimal) +
        CMD.TEXT_FORMAT.TXT_BOLD_ON +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        // "Rof\x20:\x20\x20\x20" +
        // mainSource.Issue_ROF.toFixed(decimal) +
        // CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.TEXT_FORMAT.TXT_BOLD_OFF +
        CMD.TEXT_FORMAT.TXT_ALIGN_LT +
        description +
        "--------------------------------" +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF +
        CMD.FEED_CONTROL_SEQUENCES.CTL_LF;
      for (let index = 0; index < printOption.extraLine; index++) {
        content += CMD.FEED_CONTROL_SEQUENCES.CTL_LF;
      }
      // console.log(content);
      await this.sendToBluetoothPrinter(printOption.btAddress, content);
    
  }

  onQtyLength(item) {
    const lengths = item.length;
    const str = '\x20\x20\x20\x20\x20\x20'
    const substr = str.slice(lengths);
    return `${item}${substr}`
  }

  onRateLength(item) {
    const lengths = item.length;
    const str = '\x20\x20\x20\x20\x20\x20\x20\x20'
    const substr = str.slice(lengths);
    return `${item}${substr}`
  }

  onTotalQtyLength(item) {
    const lengths = item.length;
    const str = '\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'
    const substr = str.slice(lengths);
    return `${item}${substr}`
  }

  onTotalItemDescLength(item) {
    const lengths = item.length;
    const str = '\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20'
    const substr = str.slice(lengths);
    return `${item}${substr}`
  }
}
