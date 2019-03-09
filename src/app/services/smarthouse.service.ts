import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
declare function require(url: string);
const Web3 = require('web3')
import * as TruffleContract from 'truffle-contract';
import { House } from '../../app/models/house';
import { Transaction } from '../models/transaction';

let smartHouseAbi = require('../../assets/contracts/SmartHouse.json');

declare let window: any;

@Injectable()
export class SmartHouseService {
  private web3Provider: any;
  private web3: any;
  private smartHouseContract: any;
  private accountSelected: any;
  private house: House = <House>{};
  private transaction: Transaction = <Transaction>{};


  constructor() {
    if (typeof window.web3 !== undefined) {
      this.web3Provider = window.web3.currentProvider
      this.web3 = new Web3(this.web3Provider);
      this.smartHouseContract = TruffleContract(smartHouseAbi);
      this.smartHouseContract.setProvider(this.web3Provider);
    } 
    else {
      console.warn('No web3? You should consider trying MetaMask/Mist!');
    }  
  }

  getAccount() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(function(err, accounts){
        resolve(accounts[0]);
      });
    });
  }

  async houseRegistration(propertyId: number, location: string, beneficiary: string){
    const self = this;
    this.accountSelected = await this.getAccount();
    return new Promise(async (resolve, reject) => {
      try{
        const instance = await self.smartHouseContract.deployed();
        const result = await instance.houseRegistration(propertyId, location, beneficiary, {from: self.accountSelected})
        return resolve(result);
      }
      catch(error){
        console.log(error);
        return reject(error);
      }
    });
  }

  async createTransaction(propertyId: number, buyer: string, seller: string, ipfsHash: string, 
    notaryPrice: number,amountPrice: number, depositAmount: number){
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise((resolve, reject) => {
      self.smartHouseContract.deployed().then(function(instance){
        return instance.createTransaction(propertyId, buyer, seller, ipfsHash, 
          self.web3.utils.toWei(notaryPrice, 'ether'), self.web3.utils.toWei(amountPrice, 'ether'), 
          self.web3.utils.toWei(depositAmount, 'ether'), {from: self.accountSelected, gas: 500000});
      })
      .then(function(status) {
        if(status) {
          console.log(status);
          return resolve(status);
        }
      }).catch(function(error){
        console.log(error);
        return reject("Error when create transaction");
      });      
    });
  }

  async getHouseData(propertyId: number): Promise<any>{
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise((resolve, reject) => {
      self.smartHouseContract.deployed().then(function(instance){
        return instance.getHouseData(propertyId, {from: self.accountSelected});
      })
      .then(function(result) {
        if(result) {
          self.house.houseId = propertyId;
          self.house.location = result[0];
          self.house.owner = result[1];

          return resolve(self.house);
        }
      }).catch(function(error){
        console.log(error);
        return reject("Error when get house data");
      });      
    });
  }

  async getCryptoKey(propertyId: number): Promise<any>{
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise((resolve, reject) => {
      self.smartHouseContract.deployed().then(function(instance){
        return instance.getCryptoKey(propertyId, {from: self.accountSelected});
      })
      .then(function(result) {
        if(result) {
          return resolve(result);
        }
      }).catch(function(error){
        console.log(error);
        return reject(error);
      });      
    });
  }

  async getTransactionData(propertyId: number): Promise<any>{
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise(async (resolve, reject) => {
      var instance = await self.smartHouseContract.deployed();
      try{
        var resultData = await instance.getTransactionData(propertyId, {from: self.accountSelected});
        var resultData2 = await instance.getTransactionPayment(propertyId, {from: self.accountSelected});

        this.transaction.notary = resultData[0];
        this.transaction.seller = resultData[1];
        this.transaction.buyer = resultData[2];
        this.transaction.ipfsHash = resultData[3];
        this.transaction.state = resultData[4].toNumber();
        this.transaction.notaryPrice = this.web3.utils.fromWei(resultData2[0].toString(), "ether");
        this.transaction.amountPrice = this.web3.utils.fromWei(resultData2[1].toString(), "ether");
        this.transaction.depositAmount = this.web3.utils.fromWei(resultData2[2].toString(), "ether");
        this.transaction.amountPaymentSeller = this.web3.utils.fromWei(resultData2[3].toString(), "ether");
        this.transaction.amountPaymentBuyer = this.web3.utils.fromWei(resultData2[4].toString(), "ether");
        return resolve(this.transaction);
      }
      catch(error){
        console.log(error);
        return reject(error);
      }
    });
  }

  async payTransaction(propertyId: number, transaction: Transaction, value: number){
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise(async (resolve, reject) => {
      if(self.accountSelected.toUpperCase() == transaction.seller.toUpperCase()){
        try{
          var result = await this.sellerPay(propertyId, value);
          return resolve(result);  
        }
        catch(error){
          console.log(error);
          return reject(error);
        }
        
      }
      else {
        try{
          var result = await this.buyerPay(propertyId, value);
          return resolve(result);
        }
        catch(error){
          console.log(error);
          return reject(error);
        }
      }
    });
  }

  async sellerPay(propertyId: number, value: number){
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise(async (resolve, reject) => {
      var instance = await self.smartHouseContract.deployed();
      try{
        var result = await instance.sellerTransaction(propertyId, {from: self.accountSelected, value: this.web3.utils.toWei(value, 'ether')});
        return resolve(result);
      }
      catch(error){
        console.log(error);
        return reject(error);
      }
    });
  }

  async buyerPay(propertyId: number, value: number){
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise(async (resolve, reject) => {
      var instance = await self.smartHouseContract.deployed();
      try{
        var result = await instance.buyerTransaction(propertyId, {from: self.accountSelected, value: this.web3.utils.toWei(value, 'ether')});
        return resolve(result);
      }
      catch(error){
        console.log(error);
        return reject(error);
      }
    });
  }

  async settleTransaction(propertyId: number){
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise(async (resolve, reject) => {
      var instance = await self.smartHouseContract.deployed();
      try{
        var result = await instance.completeTransaction(propertyId, {from: self.accountSelected});
        return resolve(result);
      }
      catch(error){
        console.log(error);
        return reject(error);
      }
    });
  }

  async abortTransaction(propertyId: number){
    const self = this;
    this.accountSelected = await this.getAccount();
    
    return new Promise(async (resolve, reject) => {
      var instance = await self.smartHouseContract.deployed();
      try{
        var result = await instance.cancelTransaction(propertyId, {from: self.accountSelected});
        return resolve(result);
      }
      catch(error){
        console.log(error);
        return reject(error);
      }
    });
  }
}