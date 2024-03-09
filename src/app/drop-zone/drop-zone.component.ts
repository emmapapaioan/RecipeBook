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
  imagePreviewUrl: string | ArrayBuffer = '';

  onFileDropped(files: File[]) {
    this.file = files[0];
    this.fileDropped.emit(this.file);
    this.generateImagePreview(this.file);
  }

  onFileHovered(isHovering: boolean) {
    this.hovering = isHovering;
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.fileDropped.emit(this.file);
    this.generateImagePreview(this.file);
  }

  removeFile() {
    this.file = null;
    this.imagePreviewUrl = '';
  }

  generateImagePreview(file: File) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreviewUrl = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
