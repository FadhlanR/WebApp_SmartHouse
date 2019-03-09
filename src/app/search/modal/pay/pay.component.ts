import { Component } from '@angular/core';
import { SmartHouseService } from '../../../services/smarthouse.service';
import { House } from '../../../models/house';

@Component({
  selector: 'pay',
  templateUrl: './pay.component.html'
})

export class PayComponent {
  private house: House;
  private value: number;
  private loading: boolean = false;
  private success: boolean = false;
  private failed: boolean = false;
  private fileBuffer: any;

  constructor(private smartHouseService: SmartHouseService){}

  async pay(){
    this.loading = true;
    try{
      await this.smartHouseService.payTransaction(this.house.houseId, this.house.transaction, this.value);
      this.loading = false;
      this.success = true;
    }
    catch(error){
      this.loading = false;
      this.failed = true;
    }
  }

  handleFileSelect(evt){
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();
      reader.onload =this.handleReaderLoaded.bind(this);
      reader.readAsArrayBuffer(file);
    }
  }

  handleReaderLoaded(readerEvt) {
    var arrayBuffer = readerEvt.target.result;
    this.fileBuffer = arrayBuffer;
  }
}