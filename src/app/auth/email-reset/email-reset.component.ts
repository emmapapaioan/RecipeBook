import { AuthorizationService } from 'src/app/_services/authorization.service';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-email-reset',
  templateUrl: './email-reset.component.html',
  styleUrls: ['./email-reset.component.css']
})
export class EmailResetComponent {
  email: string = '';
  isLoading: boolean = false;
  message: string = null;

  constructor(public dialogRef: MatDialogRef<EmailResetComponent>, private authService: AuthorizationService) {}

  onSendReset() {
    this.isLoading = true;

    this.authService.sendPasswordResetEmail(this.email)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => { this.message = 'If there is an account associated with this email, a reset link has been sent.'},
        error: () => { this.message = 'Failed to send reset email. Please try again.'}
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
