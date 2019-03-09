import { Component } from '@angular/core';
import { House } from '../models/house';
import { SmartHouseService } from '../services/smarthouse.service';

@Component({
  selector: 'create-root',
  templateUrl: './create.component.html'
})

export class CreateComponent {
  private house: House = <House>{};
  private loading: boolean = false;
  private success: boolean = false;
  private failed: boolean = false;

  constructor(private smartHouseService: SmartHouseService){}

  async houseRegistration(){
    try{
      this.loading = true;
      await this.smartHouseService.houseRegistration(this.house.houseId, this.house.location, this.house.owner);
      this.loading = false;
      this.success = true;
    }
    catch(error){
      this.loading = false;
      this.failed = true;
    }
    
  }
}