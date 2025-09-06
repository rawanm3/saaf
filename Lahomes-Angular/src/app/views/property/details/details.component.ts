import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { PageTitleComponent } from '@component/page-title.component'
import { PropertyInfoComponent } from './components/property-info/property-info.component'
import { PropertyService } from '@core/services/property.service'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './details.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent implements OnInit {
  property: any
  isAdmin: boolean = true
  editMode = false
  propertyForm!: FormGroup

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // ✅ الأفضل نستعمل paramMap observable عشان لو المستخدم تنقل بين عقارات مختلفة
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')
      if (id) {
        this.loadProperty(id)
      }
    })
  }

  private getPropertyId(): string {
    return this.property?._id || this.property?.id
  }

  loadProperty(id: string): void {
    this.propertyService.getOneRealEstate(id).subscribe({
      next: (res) => {
        // لو الـ API بيرجع { property: {...} }
        this.property = res.property || res
        this.initForm()
      },
      error: (err) => {
        console.error('Error loading property:', err)
      },
    })
  }

  initForm() {
    this.propertyForm = this.fb.group({
      name: [this.property?.name || ''],
      location: [this.property?.location || ''],
      type: [this.property?.type || ''],
      totalValue: [this.property?.totalValue || 0],
      minInvestment: [this.property?.minInvestment || 0],
      expectedNetYield: [this.property?.expectedNetYield || 0],
      expectedAnnualReturn: [this.property?.expectedAnnualReturn || 0],
      holdingPeriodMonths: [this.property?.holdingPeriodMonths || 0],
      description: [this.property?.description || ''],
      totalShares: [this.property?.totalShares || 0],
      isRented: [this.property?.isRented || false],
      currentRent: [this.property?.currentRent || 0],
      status: [this.property?.status || 'available'],
    })
  }

  enableEdit() {
    this.editMode = true
  }

  saveChanges() {
    if (this.propertyForm.valid) {
      this.propertyService
        .updateRealEstate(this.getPropertyId(), this.propertyForm.value)
        .subscribe({
          next: (res) => {
            this.property = res.property || res
            this.editMode = false
          },
          error: (err) => console.error('Error saving changes:', err),
        })
    }
  }

  deleteProperty() {
    this.propertyService.deleteRealEstate(this.getPropertyId()).subscribe({
      next: () => this.router.navigate(['/properties']),
      error: (err) => console.error('Error deleting property:', err),
    })
  }

  changeStatus(event: Event) {
    const selectElement = event.target as HTMLSelectElement
    const newStatus = selectElement.value
    this.propertyService
      .updateStatus(this.getPropertyId(), newStatus)
      .subscribe({
        next: (res) => {
          this.property = res.property || res
        },
        error: (err) => console.error('Error updating status:', err),
      })
  }
}
