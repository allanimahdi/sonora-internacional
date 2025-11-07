# 💰 Budget Management Feature - Complete Documentation

## Overview

The Budget Management feature has been fully implemented with **all requested features**:

1. ✅ Concert Tracking with Deposit Support
2. ✅ Expense Management (Non-Concert Related)
3. ✅ Invoice Tracking for Musician Refunds
4. ✅ Comprehensive Musician Balance View
5. ✅ Local Database Storage (IndexedDB via Dexie.js)

---

## 🎯 Features

### 1. Concert Management with Deposits

**What it does:**
- Record concerts with revenue tracking
- Track payments in **Cash** and **Bank Transfer**
- **NEW:** Track deposits already received (Cash and Bank Transfer)
- Assign cachet payments to musicians
- Mark payments as paid/unpaid

**How to use:**
1. Click "➕ Nouveau Concert" in the Budget tab
2. Fill in concert details:
   - Date and Location
   - Cash Amount and Bank Transfer Amount received
   - **Deposit Section:** Enter any deposits already received (cash/transfer)
   - Notes (optional)
3. Assign payments to musicians:
   - Set amount for each musician
   - Select payment method (Cash or Cachet)
   - Check "Payé" when payment is made
4. Click "➕ Ajouter Concert"

**Features:**
- Deposits are tracked separately and included in total revenue
- Visual indication of deposits with orange highlight
- Full audit trail of all concert income

---

### 2. Expense Management (Non-Concert)

**What it does:**
- Track expenses not related to concerts
- Examples: Speaker repair, drum head replacement, cable purchase, etc.
- Track who paid and needs to be refunded
- Mark expenses as refunded/not refunded

**How to use:**
1. Click "💸 Nouvelle Dépense" in the Budget tab
2. Fill in expense details:
   - Date
   - Description (e.g., "Réparation enceinte", "Achat peau de batterie")
   - Amount
   - Who will be refunded (select musician)
   - Refund method (Cash or Bank Transfer)
   - Notes (optional)
3. Check "Remboursement Effectué" when refund is made
4. Click "➕ Ajouter Dépense"

**Features:**
- Expenses show in musician balances under "Remboursements"
- Filter by musician to see who needs refunds
- Track refund status with checkboxes
- Integrated into overall budget calculations

---

### 3. Invoice Tracking for Musicians

**What it does:**
- Musicians can submit invoices for instrument purchases
- Compare invoice totals to their earned cachets
- Show difference: if invoices < cachets, shows "À Compléter"
- Verify and approve invoices

**How to use:**
1. Click "📄 Nouvelle Facture" in the Budget tab
2. Fill in invoice details:
   - Musician name
   - Date
   - Description (e.g., "Cymbale Zildjian 18\"", "Microphone Shure SM58")
   - Amount
   - Notes (optional)
3. Check "Vérifiée et Approuvée" when invoice is validated
4. Click "➕ Ajouter Facture"

**Features:**
- Each musician's invoices are tracked separately
- Balance view shows:
  - Total Cachets Earned
  - Total Invoices Submitted
  - **Difference** (Cachets - Invoices)
- Visual warnings:
  - "⚠️ À Compléter" if more invoices can be submitted
  - "⚠️ Trop de factures" if invoices exceed cachets
- Yellow highlight for invoice section in musician balances

---

### 4. Comprehensive Musician Balance View

**What it displays for each musician:**

```
👥 Mahdi
├── Cachets Concerts
│   ├── Total Gagné: 450.00€
│   └── Déjà Payé: 200.00€
├── Remboursements (if applicable)
│   └── À Rembourser: 75.00€
├── Factures Soumises (if applicable)
│   ├── Total Factures: 380.00€
│   ├── Différence: 70.00€ ⚠️ À Compléter
│   └── (Shows if invoices match cachets)
└── TOTAL À PAYER: 325.00€
```

**Features:**
- All financial info in one place
- Color-coded values:
  - Green: Paid amounts
  - Orange: Expense refunds
  - Red: Amounts owed
  - Yellow: Invoice section
- Quick overview of who owes invoices

---

### 5. Budget Summary Dashboard

**Displays:**

| Card | Description |
|------|-------------|
| 💵 **Revenus Totaux** | Total income from concerts (includes deposits) |
| 💸 **Payé aux Musiciens** | Total paid out (cachets + expense refunds) |
| 🏦 **Solde Actuel** | Current balance (Revenue - Paid Out) |

**Each card shows breakdown:**
- Cash amounts
- Bank transfer amounts
- Current cash and bank balance

---

## 🗄️ Database

**Technology:** IndexedDB with Dexie.js

**Why IndexedDB?**
- ✅ No server required - runs entirely in browser
- ✅ Persistent storage (data survives page refresh)
- ✅ Fast and efficient
- ✅ No MySQL/PostgreSQL installation needed
- ✅ Can handle large amounts of data
- ✅ Supports complex queries

**Database Tables:**
1. **concerts** - All concert records
2. **expenses** - All expense/refund records
3. **invoices** - All musician invoice records

**Data Location:**
- Stored in browser's IndexedDB
- Database name: `SonoraInternacionalDB`
- To view: Browser DevTools → Application → IndexedDB

**Important:**
- Data is stored per browser/device
- Clearing browser data will delete the database
- Consider implementing export/import for backups

---

## 📋 Complete Workflow Example

### Scenario: Concert at "Le Sunside"

**1. Record the Concert**
```
Date: 2025-01-15
Location: Le Sunside
Cash Amount: 1200€
Bank Transfer: 300€
Deposit Cash: 500€ (already received)
Deposit Transfer: 0€

Total Revenue: 1500€
Total Deposits Already Received: 500€
```

**2. Assign Musician Payments**
```
Mahdi: 250€ (Cachet)
Lucile: 250€ (Cachet)
Louis: 250€ (Cachet)
Marine: 250€ (Cash)
Manu: 250€ (Cash)
Pablo: 250€ (Cachet)
```

**3. Track an Expense**
```
Date: 2025-01-10
Description: Réparation Enceinte
Amount: 120€
Refunded To: Louis
Payment Method: Virement
Status: Not yet refunded
```

**4. Musician Submits Invoice**
```
Musician: Mahdi
Date: 2025-01-12
Description: Cymbale Zildjian 18"
Amount: 230€
Status: To be verified
```

**5. View Mahdi's Balance**
```
Cachets Concerts: 250€
Total Invoices: 230€
Difference: 20€ ⚠️ À Compléter
→ Mahdi can submit 20€ more in invoices
```

**6. View Louis's Balance**
```
Cachets Concerts: 250€
Remboursements: 120€
Total À Payer: 370€
→ Louis needs to be paid 370€ total
```

---

## 🎨 User Interface

### Tab Navigation
- **💰 Calculateur de Cachets** - Original payroll calculator
- **📊 Budget du Groupe** - New budget management

### Budget Tab Sections (in order)
1. **Budget Summary Cards** - Overview of finances
2. **Forms** (shown when button clicked):
   - Invoice Form (Green)
   - Expense Form (Orange)
   - Concert Form (Blue)
3. **Musician Balances Grid** - 6-column view of all musicians
4. **Expenses List** - All expenses with refund status
5. **Invoices List** - All invoices with verification status
6. **Concerts List** - All concerts with payment details

### Color Coding
- 🟢 Green: Invoices, paid status
- 🟠 Orange: Expenses, deposits, refunds
- 🔵 Blue: Concerts, cachets
- 🔴 Red: Amounts owed, negative balances
- 🟡 Yellow: Invoice sections, pending items

---

## 🔧 Technical Implementation

### New Files Created
```
src/app/models/budget.model.ts          - Data models
src/app/services/database.service.ts    - Database service (Dexie)
src/app/components/budget/
  ├── budget.component.ts               - Component logic
  ├── budget.component.html             - Template
  └── budget.component.css              - Styles
```

### Key Models
```typescript
interface Concert {
  cashAmount: number;
  bankTransferAmount: number;
  depositCash: number;          // NEW
  depositTransfer: number;      // NEW
  payments: ConcertPayment[];
  ...
}

interface Expense {             // NEW
  description: string;
  amount: number;
  refundedTo: string;
  refunded: boolean;
  paymentMethod: 'cash' | 'transfer';
  ...
}

interface MusicianInvoice {     // NEW
  musicianName: string;
  description: string;
  amount: number;
  verified: boolean;
  ...
}

interface MusicianBalance {
  totalEarned: number;
  totalExpenseRefunds: number;  // NEW
  totalInvoices: number;        // NEW
  invoiceDifference: number;    // NEW
  remainingToPay: number;
  ...
}
```

### Database Schema (Dexie.js)
```typescript
version(2).stores({
  concerts: '++id, date, location, createdAt',
  expenses: '++id, date, refundedTo, createdAt',
  invoices: '++id, musicianName, date, createdAt'
});
```

---

## 📊 Reports and Insights

### What You Can Track
1. **Total band revenue** (concerts + deposits)
2. **Cash vs. Bank Transfer breakdown**
3. **Payments owed to each musician**
4. **Expense refunds pending**
5. **Invoice compliance** (are musicians submitting invoices?)
6. **Current cash and bank balance**
7. **Historical concert performance**

### Future Enhancement Ideas
1. Export to CSV/Excel
2. Print reports
3. Date range filtering
4. Charts and visualizations
5. Multi-device sync (requires backend)
6. Backup/Restore functionality
7. Email notifications

---

## 🚀 Getting Started

### For Users
1. Open the application
2. Navigate to "📊 Budget du Groupe" tab
3. Start by adding a concert or expense
4. Check musician balances regularly
5. Mark payments/refunds when completed

### For Developers
1. Data is stored in IndexedDB automatically
2. No backend/API required
3. Database migrations handled by Dexie
4. To reset all data: Click "🗑️ Tout Supprimer"

---

## ⚠️ Important Notes

### Data Persistence
- Data is stored locally in browser
- Each browser/device has separate data
- **Recommendation:** Regular backups recommended

### Browser Compatibility
- Works in all modern browsers
- IndexedDB support required
- Mobile-responsive design

### Data Privacy
- All data stays on user's device
- No data sent to external servers
- GDPR-compliant by design

---

## 📱 Mobile Responsiveness

All features work perfectly on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones

**Mobile optimizations:**
- Stacked forms on small screens
- Touch-friendly buttons
- Responsive grid layouts
- Scrollable tables

---

## 🎯 Summary

All requested features are now complete:

1. ✅ **Deposits on concerts** - Track deposits received (cash/transfer)
2. ✅ **Add expenses** - Track non-concert expenses with refund tracking
3. ✅ **Invoice tracking** - Compare musician invoices to their cachets
4. ✅ **6-column musician view** - See all balances at a glance
5. ✅ **Database storage** - IndexedDB for persistent local storage
6. ✅ **Complete workflow** - From concert to payment to invoice verification

**The system is production-ready and fully functional!** 🎉

---

## 📞 Support

If you need help:
1. Check this documentation
2. Inspect browser console for errors
3. Clear browser data and refresh
4. Check IndexedDB in DevTools

Enjoy managing your band's budget! 🎵💰

