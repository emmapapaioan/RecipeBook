import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { DropZoneComponent } from './drop-zone/drop-zone.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { DragAndDropDirective } from '../_directives/drag-and-drop.directive';
import { AlertBoxComponent } from './alert-box/alert-box.component';

@NgModule({
  declarations: [
    DropZoneComponent,
    SpinnerComponent,
    DragAndDropDirective,
    AlertBoxComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule
  ],
  exports: [
    DropZoneComponent,
    SpinnerComponent,
    AlertBoxComponent
  ]
})

export class SharedModule {}
