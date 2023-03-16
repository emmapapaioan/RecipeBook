import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-child-test',
  templateUrl: './child-test.component.html',
  styleUrls: ['./child-test.component.css']
})

export class ChildTestComponent {
  @Output() sentName = new EventEmitter<string>();

  onAddName(name: string) {
    this.sentName.emit(name);
  }
}
