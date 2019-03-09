import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { HttpModule } from '@angular/http';
import { SmartHouseService } from './services/smarthouse.service';
import { KeyComponent } from './search/modal/key/key.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionFormComponent } from './search/modal/form/transaction.form.component';
import { IpfsService } from './services/ipfs.service';
import { CreateComponent } from './create/create.component';
import { PayComponent } from './search/modal/pay/pay.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    KeyComponent,
    PayComponent,
    TransactionFormComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,

    NgbModule.forRoot()
  ],
  providers: [
    SmartHouseService,
    IpfsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    KeyComponent,
    TransactionFormComponent,
    PayComponent
  ],
})

export class AppModule { }
