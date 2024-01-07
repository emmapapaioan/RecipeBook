import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  infoMessage(isSuccess: boolean, text: string) {
    isSuccess ? this.successMessage(text) : this.errorMessage(text);
  }

  async approveMessage(
    icon: SweetAlertIcon, 
    title: string, text: string, 
    confirmButtonText?: string, 
    cancelButtonText?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: confirmButtonText ? confirmButtonText : 'Confirm',
      cancelButtonText: cancelButtonText ? cancelButtonText : 'Cancel',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });
  }

  successMessage(text: string) {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: text,
      confirmButtonColor: '#28a745'
    });
  }

  errorMessage(text: string) {
    return Swal.fire({
      icon:'error',
      title: 'Error',
      text: text
    });
  }
}
