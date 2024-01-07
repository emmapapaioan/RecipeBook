import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @Output() fileDropped = new EventEmitter<File[]>();
  @Output() fileHovered = new EventEmitter<boolean>();

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileHovered.emit(true);
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileHovered.emit(false);
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileHovered.emit(false);
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(Array.from(files));
    }
  }
}
