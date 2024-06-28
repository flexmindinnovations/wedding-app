import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RefundPolicyPageRoutingModule } from './refund-policy-routing.module';
import { RefundPolicyPage } from './refund-policy.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RefundPolicyPageRoutingModule
  ],
  declarations: [RefundPolicyPage]
})
export class RefundPolicyPageModule {}
