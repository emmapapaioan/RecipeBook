import { Component } from '@angular/core';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.css']
})
export class DropZoneComponent {
  hovering: boolean= false;

  onFileDropped(file: File) {

  }

  onFileHovered(isHovering: boolean) {
    this.hovering = isHovering;
  }
}
