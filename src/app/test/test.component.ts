import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  names: string[] = [];
  numbers: number[] = [1,2,3,4,5,6,7,8,9,10];

  showOnlyOddNumbers() {
    this.numbers = this.numbers.filter(number=>number%2 !==0);
  }

  addName(name: string) {
    this.names.push(name);
  }
}
