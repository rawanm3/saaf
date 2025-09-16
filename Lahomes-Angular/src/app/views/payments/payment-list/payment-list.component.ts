import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentService } from '@core/services/payment.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@component/page-title.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [NgbPagination, CommonModule, PageTitleComponent, RouterModule],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentListComponent implements OnInit {
  payments: any[] = [];
  stats: any;
  currency = 'USD';
  page = 1;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
    this.loadStats();
  }

  loadPayments() {
    this.paymentService.getAllPayments().subscribe({
      next: (res) => {
        console.log('Payments:', res);
        // إعادة تشكيل الداتا لتسهيل العرض
        this.payments = res.map(p => ({
          id: p.id,
          amount: p.amount,
          currency: p.currency.toUpperCase(),
          status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
          customerName: p.customer_name || p.customer_email,
          createdAt: p.created_at,
          method: p.card_info
        }));
      },
      error: (err) => console.error(err),
    });
  }

  loadStats() {
    this.paymentService.getStats().subscribe({
      next: (res) => {
        console.log('Stats:', res);
        this.stats = res;
      },
      error: (err) => console.error(err),
    });
  }

  deletePayment(id: string) {
    console.log('Deleting payment with id:', id);
    // يمكن إضافة استدعاء الـ service لمسح الدفعية لاحقًا
  }
}
