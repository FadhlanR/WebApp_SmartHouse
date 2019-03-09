import { Transaction } from "./transaction";

export interface House {
  houseId: number;
  owner: string;
  location: string;
  transaction: Transaction;
}
