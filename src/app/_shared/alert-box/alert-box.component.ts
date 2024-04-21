import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css']
})
export class AlertBoxComponent {
  @Input() errorMsg: string = null;
  @Input() succesSignUpMsg: string = null;

  dismissAlert() {
    this.cleanErrorAndSuccessMsg();
  }

  cleanErrorAndSuccessMsg() {
    this.errorMsg = null;
    this.succesSignUpMsg = null;
  }
}
