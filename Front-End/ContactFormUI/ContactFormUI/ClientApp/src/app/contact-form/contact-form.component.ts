import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UsStateService } from '../services/us-state.service';
import { UsState } from '../models/us-state';
import { Observable, Subscribable, Subscription, of, from } from 'rxjs';
import { Address } from '../models/address';
import { ZipcodeLookupService } from '../services/zipcode-lookup.service';
import { ZipcodeLookupResponse } from '../models/zipcode-lookup-response';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserSubmissionData } from '../models/user-submission-data';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {

  contactForm: FormGroup;
  statesSubscription: Subscription;
  states$: Observable<UsState[]>;
  states: UsState[];

  constructor(
    private fb: FormBuilder,
    private stateService: UsStateService,
    private zipcodeLookupService: ZipcodeLookupService,
    public dialog: MatDialog) {

    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressFirstLine: ['', Validators.required],
      addressSecondLine: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.statesSubscription = this.stateService.getStates().subscribe(states => {
      this.states = states;
    });
  }

  ngOnDestroy() {
    this.statesSubscription.unsubscribe();
  }

  openDialog() {

    console.log("Method");
    let contactForm = this.contactForm.value;

    this.dialog.open(UserSubmissionDialog, {
      width: '250px',
      data: {
        firstName: contactForm.firstName,
        lastName: contactForm.lastName,
        phoneNumber: contactForm.phoneNumber,
        location: new Address(
          contactForm.addressFirstLine,
          contactForm.addressSecondLine,
          contactForm.city,
          contactForm.state,
          contactForm.zipcode)
      }
    });
  }

  getZipcodeByAddress() {
    let contactForm = this.contactForm.value;

    let address = new Address(
      contactForm.addressFirstLine,
      contactForm.addressSecondLine,
      contactForm.city,
      contactForm.state
    );

    if ((address.addressFirstLine || address.addressSecondLine)
      && address.city && address.state) {

      return this.zipcodeLookupService.getZipcodeByAddress(address).subscribe(response => {
        let zipcode = new ZipcodeLookupResponse(response).zipcode;

        console.log(zipcode);

        this.contactForm.patchValue({ 'zipcode': zipcode });
      });
    }
  }
}

@Component({
  selector: 'submission-dialog',
  templateUrl: 'dialogs/submission-dialog.html',
})
export class UserSubmissionDialog {

  constructor(
    public dialogRef: MatDialogRef<UserSubmissionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserSubmissionData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
