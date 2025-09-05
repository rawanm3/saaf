import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'
import { HttpClient } from '@angular/common/http';
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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.infoForm = this.fb.group({
      name: [''],
      category: [''],
      price: [''],
      propertyFor: [''],
      bedroom: [''],
      bathroom: [''],
      squareFoot: [''],
      floor: [''],
      address: [''],
      zipcode: [''],
      city: [''],
      country: [''],
    });
  }

  submitForm() {
    if (this.infoForm.valid) {
      this.http.post('http://localhost:3000/realestate/add-property', this.infoForm.value, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .subscribe({
          next: (res) => console.log('Saved Successfully ✅', res),
          error: (err) => console.error('Save Failed ❌', err)
        });
    }
  }
}
