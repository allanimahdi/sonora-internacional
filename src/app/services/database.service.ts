import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Concert, BudgetSummary, MusicianBalance, ConcertPayment, Expense, MusicianInvoice, Transaction, TransactionType } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {
  concerts!: Table<Concert, number>;
  expenses!: Table<Expense, number>;
  invoices!: Table<MusicianInvoice, number>;

  constructor() {
    super('SonoraInternacionalDB');
    
    // Define database schema - version 2 adds expenses and invoices
    this.version(1).stores({
      concerts: '++id, date, location, createdAt'
    });
    
    this.version(2).stores({
      concerts: '++id, date, location, createdAt',
      expenses: '++id, date, refundedTo, createdAt',
      invoices: '++id, musicianName, date, createdAt'
    });
  }

  // Add a new concert
  async addConcert(concert: Concert): Promise<number> {
    return await this.concerts.add(concert);
  }

  // Get all concerts
  async getAllConcerts(): Promise<Concert[]> {
    return await this.concerts.orderBy('date').reverse().toArray();
  }

  // Get concert by ID
  async getConcert(id: number): Promise<Concert | undefined> {
    return await this.concerts.get(id);
  }

  // Update a concert
  async updateConcert(id: number, changes: Partial<Concert>): Promise<number> {
    return await this.concerts.update(id, changes);
  }

  // Delete a concert
  async deleteConcert(id: number): Promise<void> {
    await this.concerts.delete(id);
  }

  // ===== EXPENSE METHODS =====
  
  // Add a new expense
  async addExpense(expense: Expense): Promise<number> {
    return await this.expenses.add(expense);
  }

  // Get all expenses
  async getAllExpenses(): Promise<Expense[]> {
    return await this.expenses.orderBy('date').reverse().toArray();
  }

  // Update an expense
  async updateExpense(id: number, changes: Partial<Expense>): Promise<number> {
    return await this.expenses.update(id, changes);
  }

  // Delete an expense
  async deleteExpense(id: number): Promise<void> {
    await this.expenses.delete(id);
  }

  // Mark expense as refunded
  async markExpenseAsRefunded(id: number): Promise<void> {
    await this.updateExpense(id, { refunded: true });
  }

  // ===== INVOICE METHODS =====
  
  // Add a new invoice
  async addInvoice(invoice: MusicianInvoice): Promise<number> {
    return await this.invoices.add(invoice);
  }

  // Get all invoices
  async getAllInvoices(): Promise<MusicianInvoice[]> {
    return await this.invoices.orderBy('date').reverse().toArray();
  }

  // Get invoices for a specific musician
  async getInvoicesByMusician(musicianName: string): Promise<MusicianInvoice[]> {
    return await this.invoices.where('musicianName').equals(musicianName).toArray();
  }

  // Update an invoice
  async updateInvoice(id: number, changes: Partial<MusicianInvoice>): Promise<number> {
    return await this.invoices.update(id, changes);
  }

  // Delete an invoice
  async deleteInvoice(id: number): Promise<void> {
    await this.invoices.delete(id);
  }

  // Mark invoice as verified
  async markInvoiceAsVerified(id: number): Promise<void> {
    await this.updateInvoice(id, { verified: true });
  }

  // Mark a payment as paid
  async markPaymentAsPaid(concertId: number, musicianName: string): Promise<void> {
    const concert = await this.getConcert(concertId);
    if (concert) {
      const updatedPayments = concert.payments.map(payment => 
        payment.musicianName === musicianName 
          ? { ...payment, paid: true }
          : payment
      );
      await this.updateConcert(concertId, { payments: updatedPayments });
    }
  }

  // Get budget summary
  async getBudgetSummary(): Promise<BudgetSummary> {
    const concerts = await this.getAllConcerts();
    const expenses = await this.getAllExpenses();
    
    let totalRevenue = 0;
    let totalCash = 0;
    let totalBankTransfer = 0;
    let totalPaidOut = 0;
    let totalCashPaidOut = 0;
    let totalCachetPaidOut = 0;

    concerts.forEach(concert => {
      totalRevenue += concert.totalAmount;
      totalCash += concert.cashAmount + concert.depositCash;
      totalBankTransfer += concert.bankTransferAmount + concert.depositTransfer;

      concert.payments.forEach(payment => {
        if (payment.paid) {
          totalPaidOut += payment.amount;
          if (payment.paymentMethod === 'cash') {
            totalCashPaidOut += payment.amount;
          } else {
            totalCachetPaidOut += payment.amount;
          }
        }
      });
    });

    // Add refunded expenses to total paid out
    expenses.forEach(expense => {
      if (expense.refunded) {
        totalPaidOut += expense.amount;
        if (expense.paymentMethod === 'cash') {
          totalCashPaidOut += expense.amount;
        } else {
          totalCachetPaidOut += expense.amount;
        }
      }
    });

    return {
      totalRevenue,
      totalCash,
      totalBankTransfer,
      totalPaidOut,
      totalCashPaidOut,
      totalCachetPaidOut,
      currentBalance: totalRevenue - totalPaidOut,
      currentCashBalance: totalCash - totalCashPaidOut,
      currentBankBalance: totalBankTransfer - totalCachetPaidOut
    };
  }

  // Get balance for each musician
  async getMusicianBalances(): Promise<MusicianBalance[]> {
    const concerts = await this.getAllConcerts();
    const expenses = await this.getAllExpenses();
    const invoices = await this.getAllInvoices();
    const musicianMap = new Map<string, MusicianBalance>();

    // Process concert payments
    concerts.forEach(concert => {
      concert.payments.forEach(payment => {
        const existing = musicianMap.get(payment.musicianName);
        
        if (existing) {
          existing.totalEarned += payment.amount;
          if (payment.paymentMethod === 'cash') {
            existing.totalCash += payment.amount;
          } else {
            existing.totalCachet += payment.amount;
          }
          if (payment.paid) {
            existing.totalPaid += payment.amount;
          }
        } else {
          musicianMap.set(payment.musicianName, {
            musicianName: payment.musicianName,
            totalEarned: payment.amount,
            totalCash: payment.paymentMethod === 'cash' ? payment.amount : 0,
            totalCachet: payment.paymentMethod === 'cachet' ? payment.amount : 0,
            totalPaid: payment.paid ? payment.amount : 0,
            totalExpenseRefunds: 0,
            totalInvoices: 0,
            invoiceDifference: 0,
            remainingToPay: 0
          });
        }
      });
    });

    // Process expense refunds
    expenses.forEach(expense => {
      const existing = musicianMap.get(expense.refundedTo);
      if (existing) {
        existing.totalExpenseRefunds += expense.amount;
        if (!expense.refunded) {
          existing.remainingToPay += expense.amount;
        }
      } else {
        musicianMap.set(expense.refundedTo, {
          musicianName: expense.refundedTo,
          totalEarned: 0,
          totalCash: 0,
          totalCachet: 0,
          totalPaid: 0,
          totalExpenseRefunds: expense.amount,
          totalInvoices: 0,
          invoiceDifference: 0,
          remainingToPay: expense.refunded ? 0 : expense.amount
        });
      }
    });

    // Process invoices
    invoices.forEach(invoice => {
      const existing = musicianMap.get(invoice.musicianName);
      if (existing) {
        existing.totalInvoices += invoice.amount;
      } else {
        musicianMap.set(invoice.musicianName, {
          musicianName: invoice.musicianName,
          totalEarned: 0,
          totalCash: 0,
          totalCachet: 0,
          totalPaid: 0,
          totalExpenseRefunds: 0,
          totalInvoices: invoice.amount,
          invoiceDifference: 0,
          remainingToPay: 0
        });
      }
    });

    // Calculate final values
    musicianMap.forEach(balance => {
      balance.remainingToPay = balance.totalEarned + balance.totalExpenseRefunds - balance.totalPaid;
      balance.invoiceDifference = balance.totalEarned - balance.totalInvoices;
    });

    return Array.from(musicianMap.values()).sort((a, b) => 
      a.musicianName.localeCompare(b.musicianName)
    );
  }

  // Clear all data (for testing/reset purposes)
  async clearAllData(): Promise<void> {
    await this.concerts.clear();
    await this.expenses.clear();
    await this.invoices.clear();
  }

  // ===== TRANSACTION LOG METHODS =====

  // Get all transactions aggregated from all sources
  async getAllTransactions(): Promise<Transaction[]> {
    const concerts = await this.getAllConcerts();
    const expenses = await this.getAllExpenses();
    const invoices = await this.getAllInvoices();
    const transactions: Transaction[] = [];

    // Concert income transactions
    concerts.forEach(concert => {
      // Concert revenue (excluding deposits)
      if (concert.cashAmount > 0 || concert.bankTransferAmount > 0) {
        const totalRevenue = concert.cashAmount + concert.bankTransferAmount;
        transactions.push({
          id: `concert-income-${concert.id}`,
          date: concert.date,
          type: 'concert_income',
          description: `Concert: ${concert.location}`,
          amount: totalRevenue,
          paymentMethod: concert.cashAmount > 0 && concert.bankTransferAmount > 0 ? undefined : 
                        (concert.cashAmount > 0 ? 'cash' : 'transfer'),
          relatedConcert: concert.location,
          isIncome: true,
          status: 'completed',
          createdAt: concert.createdAt
        });
      }

      // Deposit transactions
      if (concert.depositCash > 0) {
        transactions.push({
          id: `deposit-cash-${concert.id}`,
          date: concert.date,
          type: 'deposit_income',
          description: `Acompte (Espèces): ${concert.location}`,
          amount: concert.depositCash,
          paymentMethod: 'cash',
          relatedConcert: concert.location,
          isIncome: true,
          status: 'completed',
          createdAt: concert.createdAt
        });
      }

      if (concert.depositTransfer > 0) {
        transactions.push({
          id: `deposit-transfer-${concert.id}`,
          date: concert.date,
          type: 'deposit_income',
          description: `Acompte (Virement): ${concert.location}`,
          amount: concert.depositTransfer,
          paymentMethod: 'transfer',
          relatedConcert: concert.location,
          isIncome: true,
          status: 'completed',
          createdAt: concert.createdAt
        });
      }

      // Payment transactions
      concert.payments.forEach(payment => {
        transactions.push({
          id: `payment-${concert.id}-${payment.musicianName}`,
          date: concert.date,
          type: 'payment_out',
          description: `Cachet: ${payment.musicianName} (${concert.location})`,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          relatedMusician: payment.musicianName,
          relatedConcert: concert.location,
          isIncome: false,
          status: payment.paid ? 'completed' : 'pending',
          createdAt: concert.createdAt
        });
      });
    });

    // Expense transactions
    expenses.forEach(expense => {
      transactions.push({
        id: `expense-${expense.id}`,
        date: expense.date,
        type: 'expense_out',
        description: `Remboursement: ${expense.description}`,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod as 'cash' | 'transfer',
        relatedMusician: expense.refundedTo,
        isIncome: false,
        status: expense.refunded ? 'completed' : 'pending',
        createdAt: expense.createdAt
      });
    });

    // Invoice transactions
    invoices.forEach(invoice => {
      transactions.push({
        id: `invoice-${invoice.id}`,
        date: invoice.date,
        type: 'invoice_submitted',
        description: `Facture: ${invoice.description}`,
        amount: invoice.amount,
        relatedMusician: invoice.musicianName,
        isIncome: false,
        status: invoice.verified ? 'completed' : 'pending',
        createdAt: invoice.createdAt
      });
    });

    // Sort by date (most recent first)
    return transactions.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      // If same date, sort by creation time
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // Get transactions filtered by type
  async getTransactionsByType(type: TransactionType): Promise<Transaction[]> {
    const allTransactions = await this.getAllTransactions();
    return allTransactions.filter(t => t.type === type);
  }

  // Get transactions for a specific musician
  async getTransactionsByMusician(musicianName: string): Promise<Transaction[]> {
    const allTransactions = await this.getAllTransactions();
    return allTransactions.filter(t => t.relatedMusician === musicianName);
  }

  // Get transactions within a date range
  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const allTransactions = await this.getAllTransactions();
    return allTransactions.filter(t => t.date >= startDate && t.date <= endDate);
  }

  // Get transaction statistics
  async getTransactionStats(): Promise<{
    totalIncome: number;
    totalExpenses: number;
    pendingPayments: number;
    completedPayments: number;
    transactionCount: number;
  }> {
    const transactions = await this.getAllTransactions();
    
    let totalIncome = 0;
    let totalExpenses = 0;
    let pendingPayments = 0;
    let completedPayments = 0;

    transactions.forEach(t => {
      if (t.isIncome) {
        totalIncome += t.amount;
      } else {
        if (t.status === 'completed') {
          totalExpenses += t.amount;
          completedPayments += t.amount;
        } else {
          pendingPayments += t.amount;
        }
      }
    });

    return {
      totalIncome,
      totalExpenses,
      pendingPayments,
      completedPayments,
      transactionCount: transactions.length
    };
  }
}

