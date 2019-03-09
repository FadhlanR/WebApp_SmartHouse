import { Component, OnInit } from '@angular/core';
import { SmartHouseService } from '../../../services/smarthouse.service';
import { House } from '../../../models/house';
import { Transaction } from '../../../models/transaction';
import { IpfsService } from '../../../services/ipfs.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'transaction-form',
  templateUrl: './transaction.form.component.html'
})

export class TransactionFormComponent {
  private houseId: number;
  private transaction: Transaction = <Transaction>{};
  private fileBuffer: any;
  private loading: boolean = false;
  private success: boolean = false;
  private failed: boolean = false;

  constructor(
    private smartHouseService: SmartHouseService, 
    private ipfsService: IpfsService,
    private activeModal: NgbActiveModal,){}

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

  async createTransaction(){
    try{
      this.loading = true;
      var resultIPFS = await this.ipfsService.upload(this.fileBuffer);
      await this.smartHouseService.createTransaction(this.houseId, this.transaction.buyer,
                                    this.transaction.seller, resultIPFS.path, this.transaction.notaryPrice,
                                    this.transaction.amountPrice, this.transaction.depositAmount);
      this.loading = false;
      this.success = true;
    }
    catch(error){
      this.loading = false;
      this.failed = true;
    }
  }
}