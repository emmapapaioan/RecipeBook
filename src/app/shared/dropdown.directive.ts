import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})

export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  // Open and close on clicking on the list
  // @HostListener('click') toggleOpen() {
  //   this.isOpen = !this.isOpen;
  // }
  // constructor() { }

  // Open on clicking on the list and close on clicking anywhere in the page
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  constructor(private elRef: ElementRef) {}
}
