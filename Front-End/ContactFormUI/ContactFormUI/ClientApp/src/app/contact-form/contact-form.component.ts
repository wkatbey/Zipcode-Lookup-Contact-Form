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
import { LocationValidator } from './validators/location-validator';
import { startWith, filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {

  identifyingInfoForm: FormGroup;
  locationForm: FormGroup;

  contactForm: FormGroup;

  statesSubscription: Subscription;
  states$: Observable<UsState[]>;
  states: UsState[];

  constructor(
    private fb: FormBuilder,
    private stateService: UsStateService,
    private zipcodeLookupService: ZipcodeLookupService,
    public dialog: MatDialog) {


    this.contactForm = fb.group({
      identifyingInfoForm: fb.group(
        {
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          phoneNumber: ['', Validators.required]
        },
        {
          updateOn: 'blur'
        }
      ),
      locationForm: fb.group(
        {
          addressFirstLine: ['', Validators.required],
          addressSecondLine: [''],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zipcode: [''],
        },
        {
          asyncValidators: LocationValidator.locationExists(this.zipcodeLookupService),
          updateOn: 'blur'
        }
      )
    });

    this.locationForm = <FormGroup>this.contactForm.controls.locationForm;
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
    let contactForm = this.contactForm;

    let formValidationIndicator = this.contactForm.statusChanges.pipe(
      startWith(this.contactForm.status),
      filter(status => status !== 'PENDING'),
      take(1),
      filter(status => status === 'VALID')
    );

    formValidationIndicator.subscribe(x => {

      let identifyingInfoFormValue = contactForm.controls.identifyingInfoForm.value;
      let locationFormValue = contactForm.controls.locationForm.value;

      this.dialog.open(UserSubmissionDialog, {
        width: '250px',
        data: {
          firstName: identifyingInfoFormValue.firstName,
          lastName: identifyingInfoFormValue.lastName,
          phoneNumber: identifyingInfoFormValue.phoneNumber,
          location: new Address(
            locationFormValue.addressFirstLine,
            locationFormValue.addressSecondLine,
            locationFormValue.city,
            locationFormValue.state,
            locationFormValue.zipcode)
        }
      });
    });

  }

  getZipcodeByAddress() {
    let locationForm = this.contactForm.controls.locationForm;
    let locationFormValue = locationForm.value;

    let address = new Address(
      locationFormValue.addressFirstLine,
      locationFormValue.addressSecondLine,
      locationFormValue.city,
      locationFormValue.state
    );

    if ((address.addressFirstLine || address.addressSecondLine)
      && address.city && address.state) {


      return this.zipcodeLookupService.getZipcodeByAddress(address).subscribe(response => {
        let zipcode = new ZipcodeLookupResponse(response).zipcode;

        locationForm.patchValue({ 'zipcode': zipcode });
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
