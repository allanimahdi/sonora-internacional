# 📜 Transaction Log Feature - Complete Documentation

## Overview

The **Transaction Log** (Historique des Transactions) is a comprehensive financial history view that aggregates ALL financial activities in one place, making it easy to understand every money movement in the band's budget.

---

## 🎯 What It Shows

The transaction log displays **every financial activity** in chronological order:

### 5 Types of Transactions

1. **💰 Revenu Concert** - Concert income received
2. **💳 Acompte Reçu** - Deposits received (cash or bank transfer)
3. **💸 Cachet Payé** - Payments made to musicians
4. **🔧 Remboursement** - Expense refunds to musicians
5. **📄 Facture Soumise** - Invoices submitted by musicians

---

## 📊 Features

### 1. Transaction Statistics Dashboard

Shows at a glance:
- **Total Revenus** (Total Income) - All money received
- **Total Dépenses** (Total Expenses) - All money paid out
- **Paiements En Attente** (Pending Payments) - Money still owed
- **Balance** - Current financial position (Income - Expenses)

### 2. Advanced Filters

Filter transactions by:

| Filter | Options |
|--------|---------|
| **Type** | All types, Concert income, Deposits, Payments, Refunds, Invoices |
| **Musician** | All musicians or specific musician |
| **Status** | All, Completed, Pending |
| **Date Range** | Start date and end date |

**Filter Results:** Shows "Affichage de X transaction(s) sur Y"

### 3. Detailed Transaction Cards

Each transaction displays:

#### Date Section
- Day number (large)
- Month (abbreviated)
- Year

#### Details Section
- **Type Badge** - Color-coded transaction type
- **Status Badge** - ✅ Terminé or ⏳ En Attente
- **Description** - What the transaction is about
- **Meta Information**:
  - Payment method (if applicable): 💵 Espèces or 🏦 Virement
  - Related musician (if applicable): 👤 Name
  - Related concert (if applicable): 🎵 Location

#### Amount Section
- **+Amount** for income (green background)
- **-Amount** for expenses (red background)
- Label: "Revenu" or "Dépense"

---

## 🎨 Color Coding

Each transaction type has distinct colors for easy recognition:

| Type | Color | Border |
|------|-------|--------|
| Concert Income | Green gradient | Green |
| Deposit | Orange gradient | Orange |
| Payment | Blue gradient | Blue |
| Expense/Refund | Red gradient | Red |
| Invoice | Purple gradient | Purple |

**Status Colors:**
- ✅ **Completed** - Green badge
- ⏳ **Pending** - Yellow badge

---

## 💾 Export to CSV

Click **"💾 Exporter CSV"** to download all filtered transactions as a CSV file.

**CSV Includes:**
- Date
- Type
- Description
- Montant (Amount)
- Méthode (Payment Method)
- Musicien (Musician)
- Concert
- Statut (Status)

**Filename Format:** `transactions-YYYY-MM-DD.csv`

---

## 📝 How To Use

### Basic Usage

1. Navigate to **📊 Budget du Groupe** tab
2. Click **"📜 Voir Historique des Transactions"**
3. View all transactions in chronological order (most recent first)

### Filtering Examples

#### Example 1: View All Payments to a Specific Musician
1. Select musician from "Musicien" dropdown
2. Select "💸 Cachet Payé" from "Type de Transaction"
3. Transactions automatically filter

#### Example 2: View Pending Payments
1. Select "⏳ En Attente" from "Statut"
2. See all unpaid cachets and refunds

#### Example 3: View Income for a Date Range
1. Enter start date in "Date Début"
2. Enter end date in "Date Fin"
3. Select "💰 Revenu Concert" from type
4. See all concert income in that period

#### Example 4: Export Monthly Report
1. Set date range for the month
2. Click "💾 Exporter CSV"
3. Open in Excel/Google Sheets

### Reset Filters
Click **"🔄 Réinitialiser Filtres"** to clear all filters and show all transactions.

---

## 📋 Transaction Examples

### Concert Income Transaction
```
Date: 15 Jan 2025
Type: 💰 Revenu Concert
Description: Concert: Le Sunside
Amount: +1500.00€
Payment Method: (mixed)
Status: ✅ Terminé
Concert: Le Sunside
```

### Deposit Transaction
```
Date: 10 Jan 2025
Type: 💳 Acompte Reçu
Description: Acompte (Espèces): Le Sunside
Amount: +500.00€
Payment Method: 💵 Espèces
Status: ✅ Terminé
Concert: Le Sunside
```

### Payment Transaction
```
Date: 16 Jan 2025
Type: 💸 Cachet Payé
Description: Cachet: Mahdi (Le Sunside)
Amount: -250.00€
Payment Method: 🏦 Cachet
Musician: Mahdi
Status: ⏳ En Attente
Concert: Le Sunside
```

### Expense Refund Transaction
```
Date: 12 Jan 2025
Type: 🔧 Remboursement
Description: Remboursement: Réparation Enceinte
Amount: -120.00€
Payment Method: 🏦 Virement
Musician: Louis
Status: ⏳ En Attente
```

### Invoice Transaction
```
Date: 14 Jan 2025
Type: 📄 Facture Soumise
Description: Facture: Cymbale Zildjian 18"
Amount: -230.00€
Musician: Mahdi
Status: ✅ Terminé
```

---

## 🔍 Understanding The Log

### What Generates Transactions?

| Action | Generates |
|--------|-----------|
| Add Concert | 1-3 transactions (income + deposits) |
| Assign Payment to Musician | 1 transaction per musician |
| Add Expense | 1 transaction |
| Submit Invoice | 1 transaction |
| Mark Payment as Paid | Updates transaction status |
| Mark Refund as Refunded | Updates transaction status |
| Mark Invoice as Verified | Updates transaction status |

### Transaction Lifecycle

**Income Transactions:**
- Always marked as **Completed** (money already received)
- Never change status

**Expense Transactions (Payments & Refunds):**
1. Created as **Pending** (⏳ En Attente)
2. Changed to **Completed** (✅ Terminé) when checkbox marked
3. Status cannot be reversed once completed

**Invoice Transactions:**
1. Created as **Pending** (⏳ En Attente)
2. Changed to **Completed** (✅ Terminé) when verified
3. Status cannot be reversed once verified

---

## 📈 Use Cases

### 1. Monthly Financial Review
- Filter by date range for the month
- Review all income and expenses
- Export to CSV for accounting

### 2. Musician Payment Tracking
- Filter by specific musician
- See all their earned cachets
- Check what's been paid vs. pending
- View their submitted invoices

### 3. Concert Analysis
- View all transactions for a specific concert
- See total revenue (including deposits)
- Track all payments to musicians
- Calculate profit/loss per concert

### 4. Budget Reconciliation
- Check if deposits were received
- Verify all payments made
- Ensure invoices match cachets
- Cross-reference with bank statements

### 5. Audit Trail
- Complete history of all financial activities
- Timestamps on when transactions were created
- Status tracking (pending → completed)
- Export for external auditing

---

## 🎯 Benefits

### For Band Managers
✅ **Complete Transparency** - See every euro in and out
✅ **Easy Filtering** - Find specific transactions quickly
✅ **Export Capability** - Generate reports for accounting
✅ **Status Tracking** - Know what's paid and what's pending

### For Musicians
✅ **Payment History** - See all payments received
✅ **Invoice Tracking** - Track submitted invoices
✅ **Refund Status** - Check if refunds were made

### For Accountants
✅ **CSV Export** - Import into accounting software
✅ **Date Filtering** - Generate period reports
✅ **Complete Audit Trail** - Every transaction recorded
✅ **Clear Categorization** - Easy to classify transactions

---

## 🔧 Technical Details

### Data Source
Transactions are **dynamically generated** from:
- Concerts database (concerts table)
- Expenses database (expenses table)
- Invoices database (invoices table)

**Note:** Transactions are NOT stored separately. They are calculated in real-time from existing data.

### Sorting
Transactions are sorted by:
1. **Date** (most recent first)
2. **Creation time** (if same date)

### Performance
- Fast loading (IndexedDB queries)
- Client-side filtering (instant results)
- No server calls required

### Data Persistence
- Transactions persist as long as source data exists
- Deleting a concert removes its transactions
- Deleting an expense removes its transaction
- Deleting an invoice removes its transaction

---

## 🚀 Quick Tips

### Tip 1: Find Unpaid Cachets
Filter by:
- Status: "⏳ En Attente"
- Type: "💸 Cachet Payé"

### Tip 2: Monthly Income Report
Filter by:
- Date range: First and last day of month
- Type: "💰 Revenu Concert" + "💳 Acompte Reçu"

### Tip 3: Track Musician Earnings
Filter by:
- Musician: Select name
- Type: "💸 Cachet Payé"

### Tip 4: Export for Accounting
1. Set desired filters
2. Click "Exporter CSV"
3. Open in Excel
4. Use for tax/accounting purposes

### Tip 5: Verify Concert Revenue
1. Find the concert in history
2. Look for income + deposit transactions
3. Confirm amounts match expected

---

## ⚠️ Important Notes

### Transaction ID Format
```
concert-income-{concertId}
deposit-cash-{concertId}
deposit-transfer-{concertId}
payment-{concertId}-{musicianName}
expense-{expenseId}
invoice-{invoiceId}
```

### Status Rules
- **Income transactions** are always "completed"
- **Payment/Refund transactions** start as "pending"
- **Invoice transactions** start as "pending"
- Status changes when checkbox marked in respective sections

### Filtering Behavior
- Multiple filters are combined with AND logic
- Empty filters (select "all") are ignored
- Date filters are inclusive
- Results update instantly

---

## 📞 Common Questions

**Q: Why don't I see my concert in the log?**
A: Make sure you added payment amounts to musicians. Zero-amount transactions may not appear.

**Q: Can I delete a transaction?**
A: Delete the source (concert, expense, or invoice) to remove its transactions.

**Q: Why is my transaction marked as pending?**
A: Go to the relevant section (concerts, expenses, invoices) and mark it as paid/refunded/verified.

**Q: Can I edit a transaction?**
A: Edit the source data (concert, expense, invoice) and changes will reflect immediately.

**Q: How do I see only completed transactions?**
A: Filter by Status: "✅ Terminé"

**Q: Can I print the transaction log?**
A: Yes! Export to CSV and print from Excel, or use browser print function.

---

## 🎉 Summary

The Transaction Log provides:

✅ **Complete financial history** in one place
✅ **Advanced filtering** by type, musician, status, date
✅ **Beautiful visual design** with color coding
✅ **Export to CSV** for external use
✅ **Real-time updates** from all data sources
✅ **Easy-to-understand** format for everyone

**This is your financial command center!** 🎵💰

---

**Last Updated:** November 2025
**Feature Status:** ✅ Production Ready

