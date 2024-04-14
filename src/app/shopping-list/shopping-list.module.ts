import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../_shared/shared.module';
import { ExampleShoppingListComponent } from './example-shopping-list/example-shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
    ExampleShoppingListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    ShoppingListRoutingModule
  ]
})

export class ShoppingListModule {}
