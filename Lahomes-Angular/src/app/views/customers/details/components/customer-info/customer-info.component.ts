import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'customer-info',
  standalone: true,
  imports: [NgbCarouselModule],
  templateUrl: './customer-info.component.html',
  styles: ``,
})
export class CustomerInfoComponent {
  @Input() customer: any
  @Output() editRequested = new EventEmitter<void>()
    @Output() deleteRequested = new EventEmitter<void>()   // 👈 جديد


  emitEdit() {
    this.editRequested.emit()
  }
   emitDelete() {
    this.deleteRequested.emit()  // 👈 يبعث للـ parent
  }
}