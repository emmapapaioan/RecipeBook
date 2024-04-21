import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private authService: AuthorizationService, private router: Router) { }

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

  onLogoutMessage(hasImage?: boolean) {
    Swal.fire({
      text: 'Leaving so soon? We\'\ll miss you!',
      imageUrl: hasImage ? '/assets/icons/heart.png' : null,
      imageWidth: 200,
      imageHeight: 200,
      icon: hasImage ? null : 'info',
      imageAlt: 'Heart Emoji',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      customClass: {
        image: 'custom-image-class'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/home']);
      }
    });
  }
}
