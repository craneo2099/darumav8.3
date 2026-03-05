import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JuegaPageRoutingModule } from './juega-routing.module';

import { JuegaPage } from './juega.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JuegaPageRoutingModule
  ],
  declarations: [JuegaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JuegaPageModule {}
