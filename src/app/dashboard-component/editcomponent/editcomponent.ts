
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateUser } from '../../models/UpdateUser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-editcomponent',
  imports: [ CommonModule,FormsModule],
  templateUrl: './editcomponent.html',
  styleUrl: './editcomponent.sass',
})
export class Editcomponent {
   userData: UpdateUser;

  constructor(
    public dialogRef: MatDialogRef<Editcomponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateUser
  ) {
    // Clone the data to avoid mutating original until save
    this.userData = { ...data };
  }

  save() {
    // Close dialog and return updated data
    this.dialogRef.close(this.userData);
  }

  cancel() {
    this.dialogRef.close(null); // no changes
  }

}
