import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>{{ message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Delete</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) { }

  get title(): string {
    return this.data.title || 'Confirmation';
  }

  get message(): string {
    return this.data.message || 'Are you sure you want to delete?';
  }
}

interface ConfirmationDialogData {
  title?: string;
  message?: string;
}
