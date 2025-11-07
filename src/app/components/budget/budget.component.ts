import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Concert, ConcertPayment, BudgetSummary, MusicianBalance, Expense, MusicianInvoice, Transaction, TransactionType } from '../../models/budget.model';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  concertForm!: FormGroup;
  expenseForm!: FormGroup;
  invoiceForm!: FormGroup;
  
  concerts: Concert[] = [];
  expenses: Expense[] = [];
  invoices: MusicianInvoice[] = [];
  budgetSummary: BudgetSummary | null = null;
  musicianBalances: MusicianBalance[] = [];
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  transactionStats: any = null;
  
  showConcertForm = false;
  showExpenseForm = false;
  showInvoiceForm = false;
  showTransactionLog = false;
  editingConcertId: number | null = null;
  editingExpenseId: number | null = null;
  editingInvoiceId: number | null = null;

  // Transaction filters
  selectedTransactionType: TransactionType | 'all' = 'all';
  selectedMusician: string = 'all';
  selectedStatus: 'all' | 'completed' | 'pending' = 'all';
  startDate: string = '';
  endDate: string = '';

  // Default musicians (same as in payroll)
  defaultMusicians = ['Mahdi', 'Lucile', 'Louis', 'Marine', 'Manu', 'Pablo'];

  constructor(
    private fb: FormBuilder,
    private db: DatabaseService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initializeForms();
    await this.loadData();
  }

  initializeForms(): void {
    // Concert Form
    this.concertForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      location: ['', Validators.required],
      cashAmount: [0, [Validators.required, Validators.min(0)]],
      bankTransferAmount: [0, [Validators.required, Validators.min(0)]],
      depositCash: [0, [Validators.required, Validators.min(0)]],
      depositTransfer: [0, [Validators.required, Validators.min(0)]],
      notes: [''],
      payments: this.fb.array([])
    });

    // Initialize musicians payments
    this.defaultMusicians.forEach(musician => {
      this.addMusicianPayment(musician);
    });

    // Expense Form
    this.expenseForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      refundedTo: ['', Validators.required],
      paymentMethod: ['cash', Validators.required],
      refunded: [false],
      notes: ['']
    });

    // Invoice Form
    this.invoiceForm = this.fb.group({
      musicianName: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      verified: [false],
      notes: ['']
    });
  }

  get payments(): FormArray {
    return this.concertForm.get('payments') as FormArray;
  }

  addMusicianPayment(musicianName: string = ''): void {
    const paymentGroup = this.fb.group({
      musicianName: [musicianName, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      paymentMethod: ['cachet', Validators.required],
      paid: [false]
    });
    this.payments.push(paymentGroup);
  }

  removeMusicianPayment(index: number): void {
    this.payments.removeAt(index);
  }

  async loadData(): Promise<void> {
    this.concerts = await this.db.getAllConcerts();
    this.expenses = await this.db.getAllExpenses();
    this.invoices = await this.db.getAllInvoices();
    this.budgetSummary = await this.db.getBudgetSummary();
    this.musicianBalances = await this.db.getMusicianBalances();
    this.transactions = await this.db.getAllTransactions();
    this.transactionStats = await this.db.getTransactionStats();
    this.applyTransactionFilters();
  }

  // ===== CONCERT METHODS =====

  toggleConcertForm(): void {
    this.showConcertForm = !this.showConcertForm;
    if (!this.showConcertForm) {
      this.editingConcertId = null;
      this.initializeForms();
    }
  }

  async saveConcert(): Promise<void> {
    if (this.concertForm.invalid) {
      Object.keys(this.concertForm.controls).forEach(key => {
        this.concertForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.concertForm.value;
    const totalAmount = formValue.cashAmount + formValue.bankTransferAmount;
    const totalDeposit = formValue.depositCash + formValue.depositTransfer;

    const concert: Concert = {
      date: formValue.date,
      location: formValue.location,
      cashAmount: formValue.cashAmount,
      bankTransferAmount: formValue.bankTransferAmount,
      totalAmount: totalAmount,
      depositCash: formValue.depositCash,
      depositTransfer: formValue.depositTransfer,
      totalDeposit: totalDeposit,
      payments: formValue.payments,
      createdAt: new Date().toISOString(),
      notes: formValue.notes
    };

    try {
      if (this.editingConcertId !== null) {
        await this.db.updateConcert(this.editingConcertId, concert);
      } else {
        await this.db.addConcert(concert);
      }
      
      await this.loadData();
      this.toggleConcertForm();
    } catch (error) {
      console.error('Error saving concert:', error);
      alert('Erreur lors de la sauvegarde du concert');
    }
  }

  async editConcert(concert: Concert): Promise<void> {
    if (!concert.id) return;

    this.editingConcertId = concert.id;
    this.showConcertForm = true;

    // Clear existing payments
    while (this.payments.length > 0) {
      this.payments.removeAt(0);
    }

    // Set form values
    this.concertForm.patchValue({
      date: concert.date,
      location: concert.location,
      cashAmount: concert.cashAmount,
      bankTransferAmount: concert.bankTransferAmount,
      depositCash: concert.depositCash || 0,
      depositTransfer: concert.depositTransfer || 0,
      notes: concert.notes
    });

    // Add payments
    concert.payments.forEach(payment => {
      const paymentGroup = this.fb.group({
        musicianName: [payment.musicianName, Validators.required],
        amount: [payment.amount, [Validators.required, Validators.min(0)]],
        paymentMethod: [payment.paymentMethod, Validators.required],
        paid: [payment.paid]
      });
      this.payments.push(paymentGroup);
    });

    setTimeout(() => {
      document.getElementById('concert-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  async deleteConcert(concertId: number | undefined): Promise<void> {
    if (!concertId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce concert ?')) {
      try {
        await this.db.deleteConcert(concertId);
        await this.loadData();
      } catch (error) {
        console.error('Error deleting concert:', error);
        alert('Erreur lors de la suppression du concert');
      }
    }
  }

  async togglePaymentStatus(concertId: number | undefined, musicianName: string): Promise<void> {
    if (!concertId) return;
    
    try {
      await this.db.markPaymentAsPaid(concertId, musicianName);
      await this.loadData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Erreur lors de la mise à jour du statut de paiement');
    }
  }

  // ===== EXPENSE METHODS =====

  toggleExpenseForm(): void {
    this.showExpenseForm = !this.showExpenseForm;
    if (!this.showExpenseForm) {
      this.editingExpenseId = null;
      this.expenseForm.reset({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        refundedTo: '',
        paymentMethod: 'cash',
        refunded: false,
        notes: ''
      });
    }
  }

  async saveExpense(): Promise<void> {
    if (this.expenseForm.invalid) {
      Object.keys(this.expenseForm.controls).forEach(key => {
        this.expenseForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.expenseForm.value;
    const expense: Expense = {
      date: formValue.date,
      description: formValue.description,
      amount: formValue.amount,
      refundedTo: formValue.refundedTo,
      refunded: formValue.refunded,
      paymentMethod: formValue.paymentMethod,
      createdAt: new Date().toISOString(),
      notes: formValue.notes
    };

    try {
      if (this.editingExpenseId !== null) {
        await this.db.updateExpense(this.editingExpenseId, expense);
      } else {
        await this.db.addExpense(expense);
      }
      
      await this.loadData();
      this.toggleExpenseForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Erreur lors de la sauvegarde de la dépense');
    }
  }

  async editExpense(expense: Expense): Promise<void> {
    if (!expense.id) return;

    this.editingExpenseId = expense.id;
    this.showExpenseForm = true;

    this.expenseForm.patchValue({
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
      refundedTo: expense.refundedTo,
      paymentMethod: expense.paymentMethod,
      refunded: expense.refunded,
      notes: expense.notes
    });

    setTimeout(() => {
      document.getElementById('expense-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  async deleteExpense(expenseId: number | undefined): Promise<void> {
    if (!expenseId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      try {
        await this.db.deleteExpense(expenseId);
        await this.loadData();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Erreur lors de la suppression de la dépense');
      }
    }
  }

  async toggleExpenseRefunded(expenseId: number | undefined): Promise<void> {
    if (!expenseId) return;
    
    try {
      await this.db.markExpenseAsRefunded(expenseId);
      await this.loadData();
    } catch (error) {
      console.error('Error updating expense status:', error);
      alert('Erreur lors de la mise à jour du statut de remboursement');
    }
  }

  // ===== INVOICE METHODS =====

  toggleInvoiceForm(): void {
    this.showInvoiceForm = !this.showInvoiceForm;
    if (!this.showInvoiceForm) {
      this.editingInvoiceId = null;
      this.invoiceForm.reset({
        musicianName: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        verified: false,
        notes: ''
      });
    }
  }

  async saveInvoice(): Promise<void> {
    if (this.invoiceForm.invalid) {
      Object.keys(this.invoiceForm.controls).forEach(key => {
        this.invoiceForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.invoiceForm.value;
    const invoice: MusicianInvoice = {
      musicianName: formValue.musicianName,
      date: formValue.date,
      description: formValue.description,
      amount: formValue.amount,
      verified: formValue.verified,
      createdAt: new Date().toISOString(),
      notes: formValue.notes
    };

    try {
      if (this.editingInvoiceId !== null) {
        await this.db.updateInvoice(this.editingInvoiceId, invoice);
      } else {
        await this.db.addInvoice(invoice);
      }
      
      await this.loadData();
      this.toggleInvoiceForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Erreur lors de la sauvegarde de la facture');
    }
  }

  async editInvoice(invoice: MusicianInvoice): Promise<void> {
    if (!invoice.id) return;

    this.editingInvoiceId = invoice.id;
    this.showInvoiceForm = true;

    this.invoiceForm.patchValue({
      musicianName: invoice.musicianName,
      date: invoice.date,
      description: invoice.description,
      amount: invoice.amount,
      verified: invoice.verified,
      notes: invoice.notes
    });

    setTimeout(() => {
      document.getElementById('invoice-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  async deleteInvoice(invoiceId: number | undefined): Promise<void> {
    if (!invoiceId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await this.db.deleteInvoice(invoiceId);
        await this.loadData();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Erreur lors de la suppression de la facture');
      }
    }
  }

  async toggleInvoiceVerified(invoiceId: number | undefined): Promise<void> {
    if (!invoiceId) return;
    
    try {
      await this.db.markInvoiceAsVerified(invoiceId);
      await this.loadData();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Erreur lors de la mise à jour du statut de vérification');
    }
  }

  getInvoicesByMusician(musicianName: string): MusicianInvoice[] {
    return this.invoices.filter(inv => inv.musicianName === musicianName);
  }

  // ===== HELPER METHODS =====

  getTotalPayments(): number {
    return this.payments.controls.reduce((sum, control) => {
      return sum + (control.get('amount')?.value || 0);
    }, 0);
  }

  getTotalCashPayments(): number {
    return this.payments.controls.reduce((sum, control) => {
      if (control.get('paymentMethod')?.value === 'cash') {
        return sum + (control.get('amount')?.value || 0);
      }
      return sum;
    }, 0);
  }

  getTotalCachetPayments(): number {
    return this.payments.controls.reduce((sum, control) => {
      if (control.get('paymentMethod')?.value === 'cachet') {
        return sum + (control.get('amount')?.value || 0);
      }
      return sum;
    }, 0);
  }

  getConcertTotal(concert: Concert): number {
    return concert.payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  getConcertPaid(concert: Concert): number {
    return concert.payments
      .filter(p => p.paid)
      .reduce((sum, payment) => sum + payment.amount, 0);
  }

  getConcertRemaining(concert: Concert): number {
    return this.getConcertTotal(concert) - this.getConcertPaid(concert);
  }

  async clearAllData(): Promise<void> {
    if (confirm('⚠️ ATTENTION : Cela supprimera TOUTES les données de budget. Cette action est irréversible. Continuer ?')) {
      try {
        await this.db.clearAllData();
        await this.loadData();
        alert('Toutes les données ont été supprimées.');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Erreur lors de la suppression des données');
      }
    }
  }

  // ===== TRANSACTION LOG METHODS =====

  toggleTransactionLog(): void {
    this.showTransactionLog = !this.showTransactionLog;
    if (this.showTransactionLog) {
      // Scroll to transaction log
      setTimeout(() => {
        document.getElementById('transaction-log')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  applyTransactionFilters(): void {
    let filtered = [...this.transactions];

    // Filter by type
    if (this.selectedTransactionType !== 'all') {
      filtered = filtered.filter(t => t.type === this.selectedTransactionType);
    }

    // Filter by musician
    if (this.selectedMusician !== 'all') {
      filtered = filtered.filter(t => t.relatedMusician === this.selectedMusician);
    }

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === this.selectedStatus);
    }

    // Filter by date range
    if (this.startDate) {
      filtered = filtered.filter(t => t.date >= this.startDate);
    }
    if (this.endDate) {
      filtered = filtered.filter(t => t.date <= this.endDate);
    }

    this.filteredTransactions = filtered;
  }

  resetTransactionFilters(): void {
    this.selectedTransactionType = 'all';
    this.selectedMusician = 'all';
    this.selectedStatus = 'all';
    this.startDate = '';
    this.endDate = '';
    this.applyTransactionFilters();
  }

  getTransactionTypeLabel(type: TransactionType): string {
    const labels: Record<TransactionType, string> = {
      'concert_income': '💰 Revenu Concert',
      'deposit_income': '💳 Acompte Reçu',
      'payment_out': '💸 Cachet Payé',
      'expense_out': '🔧 Remboursement',
      'invoice_submitted': '📄 Facture Soumise'
    };
    return labels[type];
  }

  getTransactionTypeClass(type: TransactionType): string {
    const classes: Record<TransactionType, string> = {
      'concert_income': 'income',
      'deposit_income': 'deposit',
      'payment_out': 'payment',
      'expense_out': 'expense',
      'invoice_submitted': 'invoice'
    };
    return classes[type];
  }

  getPaymentMethodLabel(method?: 'cash' | 'transfer' | 'cachet'): string {
    if (!method) return '';
    const labels = {
      'cash': '💵 Espèces',
      'transfer': '🏦 Virement',
      'cachet': '🏦 Cachet'
    };
    return labels[method];
  }

  exportTransactions(): void {
    // Create CSV content
    const headers = ['Date', 'Type', 'Description', 'Montant', 'Méthode', 'Musicien', 'Concert', 'Statut'];
    const rows = this.filteredTransactions.map(t => [
      t.date,
      this.getTransactionTypeLabel(t.type),
      t.description,
      t.amount.toFixed(2) + '€',
      this.getPaymentMethodLabel(t.paymentMethod),
      t.relatedMusician || '',
      t.relatedConcert || '',
      t.status === 'completed' ? 'Terminé' : 'En attente'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
