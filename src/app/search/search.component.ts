import { Component } from '@angular/core';
import { SmartHouseService } from '../../app/services/smarthouse.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { House } from '../../app/models/house';
import { Transaction } from '../../app/models/transaction';
import { KeyComponent } from '../../app/search/modal/key/key.component';
import { TransactionFormComponent } from '../../app/search/modal/form/transaction.form.component';
import { IpfsService } from '../services/ipfs.service';
import { saveAs } from 'file-saver/FileSaver';
import { PayComponent } from './modal/pay/pay.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'search-root',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  private houseId: number;
  private house: House = <House>{};
  private error: any;

  constructor(
    private router: Router, 
    private smartHouseService: SmartHouseService,
    private ipfsService: IpfsService,
    private modalService: NgbModal,
  ) {
  }

  async getHouseData(){
    if(this.houseId != undefined){
      try{
        this.house = await this.smartHouseService.getHouseData(this.houseId);
      }
      catch(error){
        console.log(error);
        this.error = "Data not found"
      }
    }
  }

  async getTransaction(){
    try{
      this.house.transaction = await this.smartHouseService.getTransactionData(this.houseId);
    }
    catch(error){
      console.log(error);
    }
  }

  showCryptoKeyModal(){
    const activeModal = this.modalService.open(KeyComponent, { size: 'lg', windowClass: 'modal' });
    activeModal.componentInstance.houseId = this.houseId;
  }

  showTransactionFormModal(){
    const activeModal = this.modalService.open(TransactionFormComponent, { size: 'lg', windowClass: 'modal' });
    activeModal.componentInstance.houseId = this.houseId;
    activeModal.componentInstance.transaction.seller = this.house.owner;
  }

  async showPayModal(){
    const activeModal = this.modalService.open(PayComponent, { size: 'lg', windowClass: 'modal' });
    activeModal.componentInstance.house = this.house;
  }

  async settle(){
    await this.smartHouseService.settleTransaction(this.houseId);
  }

  async abort(){
    await this.smartHouseService.abortTransaction(this.houseId);
  }

  async download(){
    var file = await this.ipfsService.download(this.house.transaction.ipfsHash);
    saveAs(file, "AJB.pdf");
  }
}