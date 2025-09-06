import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'
import { ReactiveFormsModule } from '@angular/forms'  
@Component({
  selector: 'add-information',
  standalone: true,
  imports: [SelectFormInputDirective, ReactiveFormsModule],
  templateUrl: './add-information.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddInformationComponent {
  @Output() infoChange = new EventEmitter<any>();
  infoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.infoForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
      square: [''],
      numberOfRooms: [''],
      numberOfBathrooms: [''],
      propertyNumber: [''],
      totalValue: ['', Validators.required],
      minInvestment: [''],
      expectedNetYield: ['', Validators.required],
      expectedAnnualReturn: ['', Validators.required],
      holdingPeriodMonths: [''],
      sharePrice: [''],
      totalShares: ['', Validators.required],
      isRented: [false],
      currentRent: [''],
      description: [''],
      features: [''],
      isShariahCompliant: [true],
      countryCode: ['SA'],
      status: ['available'],
    });
  }

  submitForm() {
    if (this.infoForm.valid) {
      console.log('✅ InfoForm Values:', this.infoForm.value);
      this.infoChange.emit(this.infoForm.value);
    } else {
      console.error('❌ Form is invalid');
    }
  }
}
