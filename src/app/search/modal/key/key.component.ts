import { Component, OnInit } from '@angular/core';
import { SmartHouseService } from '../../../services/smarthouse.service';
import { House } from '../../../models/house';
import { Transaction } from '../../../models/transaction';

@Component({
  selector: 'key',
  templateUrl: './key.component.html'
})

export class KeyComponent implements OnInit {
  private houseId: number;
  private cryptoKey: string;
  private errorMessage: string;

  constructor(private smartHouseService: SmartHouseService){}

  ngOnInit(){
    if(this.houseId != undefined){
      this.smartHouseService.getCryptoKey(this.houseId)
      .then(cryptoKey => this.cryptoKey = cryptoKey)
      .catch(error => this.errorMessage = error);
    }
  }
}