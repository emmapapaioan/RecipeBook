import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.css']
})
export class DropZoneComponent {
  @Output() fileDropped = new EventEmitter<File>();
  hovering: boolean= false;
  file: File;

  onFileDropped(files: File[]) {
    this.file = files[0];
    this.fileDropped.emit(this.file);
  }

  onFileHovered(isHovering: boolean) {
    this.hovering = isHovering;
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.fileDropped.emit(this.file);
  }

  removeFile() {
    this.file = null;
  }
}
