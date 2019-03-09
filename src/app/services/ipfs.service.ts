import { Injectable } from '@angular/core';

declare function require(url: string);
const IPFS = require('ipfs-api')
const Buffer = require('buffer/').Buffer


@Injectable()
export class IpfsService {
  ipfs: any;

  constructor() {
    console.log(IPFS);
    this.ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  }

  upload(fileBuffer: any): Promise<any> {
    return new Promise((resolve, reject) => {
      var buffer = Buffer.from(fileBuffer);
      
      this.ipfs.files.add(buffer, function(err, res){
        if(err){
          return reject(err);
        }
        else{
          for (let i = 0; i < res.length; i++) {
            console.log(res[i]);
            return resolve(res[i]);
          }
        }
      });
    });
  }

  download(path: string){
    console.log(path);
    return new Promise((resolve, reject) => {
      this.ipfs.files.get(path, function(err, res){
        if(err){
          console.log(err);
          return reject(err);
        }
        else{
          var file = new Blob(res[0].content, {type: 'text/pdf'});
          return resolve(file);
        }
      });
    });
  }

}