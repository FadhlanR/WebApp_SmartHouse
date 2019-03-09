export interface Transaction {
  notary: string;
  buyer: string;
  seller: string;
  ipfsHash: string;
  notaryPrice: number;
  amountPrice: number;
  depositAmount: number;
  amountPaymentSeller: number;
  amountPaymentBuyer: number;
  state: number;
}
