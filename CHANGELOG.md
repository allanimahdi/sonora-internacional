# Changelog - Sonora Internacional

## Version 1.2.0 - October 17, 2025

### ✨ New Features

#### 📄 PDF Download
- Added PDF export functionality for calculation results
- Professional PDF document with all details
- High-quality rendering (2x scale)
- Automatic filename with date format: `Sonora-Internacional-Cachets-YYYY-MM-DD.pdf`
- Green download button in results header
- Loading state during PDF generation
- Error handling with user-friendly messages
- Fully client-side (no server required)
- Complete documentation in PDF_DOWNLOAD_FEATURE.md

### 🎨 UI/UX Improvements
- Results header with title and download button side-by-side
- Responsive layout (button below title on mobile)
- Loading indicator during PDF generation
- Professional styling for download button

### 🔧 Technical Changes
- Added `html2canvas` library (v1.4.1) for HTML to image conversion
- Added `jspdf` library (v2.5.1) for PDF generation
- Implemented `downloadPDF()` method in AppComponent
- Updated bundle size budgets to accommodate PDF libraries
- Bundle size increased to ~193 KB (gzipped) - still very lightweight

### 📝 Documentation
- Created PDF_DOWNLOAD_FEATURE.md with complete feature documentation
- Updated README.md with PDF feature information
- Added usage examples and troubleshooting

---

## Version 1.1.0 - October 17, 2025

### ✨ New Features

#### 🎸 Instrument Rentals Between Musicians
- Added ability to manage instrument rentals between band members
- When Musician A rents from Musician B:
  - Musician B receives +€10 (or custom amount)
  - Musician A pays -€10 (deducted from final payment)
- New section "Locations d'Instruments Entre Musiciens" in the form
- Support for multiple simultaneous rentals
- Display rental income/expense in individual payment breakdowns
- Customizable rental amounts (default: 10€)
- Pink/red themed UI section for easy identification
- Complete documentation in INSTRUMENT_RENTALS_FEATURE.md

### 🎨 UI/UX Improvements
- New rental section with clear explanations
- Empty state message when no rentals configured
- Color-coded rental transactions in results (+green/-red)
- Responsive design for mobile devices
- French language throughout

### 🔧 Technical Changes
- Added `InstrumentRental` interface to data models
- Updated `PayrollInput` to include `instrumentRentals` array
- Enhanced `MusicianPayment` with `instrumentRentalIncome` and `instrumentRentalExpense`
- Modified payroll calculation service to handle rental transactions
- Added form array management for dynamic rental entries
- Implemented validation for rental fields

### 📝 Documentation
- Created INSTRUMENT_RENTALS_FEATURE.md with complete feature documentation
- Updated README.md with new feature information
- Updated calculation logic documentation
- Added usage examples and scenarios

### 🐛 Bug Fixes
- Ensured rental amounts properly affect final calculations
- Validated that totals remain balanced with rental transactions

---

## Version 1.0.0 - October 17, 2025

### 🎉 Initial Release

#### Core Features
- **Payroll Distribution Calculator** for music bands
- **French Interface** - Complete UI in French
- **Password Authentication** - Secure login (default: sonora2025)
- **Dynamic Musician Management** - Add/remove musicians
- **Automatic Calculations**:
  - Group backline fees (€20/€30 based on quote)
  - Car allowances (€10 per driver)
  - Finder commission (10% of net)
  - Seniority bonuses (€2/year)
  - Equal distribution
- **Detailed Results** - Individual payment breakdowns
- **Responsive Design** - Mobile, tablet, desktop support

#### Authentication System
- Login page with password protection
- Session management via localStorage
- Logout functionality
- Password visibility toggle
- Error handling with French messages

#### VPS Deployment
- Production build scripts
- Nginx configuration
- SSL/HTTPS support via Certbot
- Deployment automation scripts
- Complete deployment documentation

#### Documentation
- README.md - Main documentation
- DEPLOYMENT.md - VPS deployment guide
- QUICK_START.md - Quick start guide
- START_HERE.md - Getting started
- FEATURES_SUMMARY.md - Technical overview
- PASSWORD_INFO.txt - Password reference
- IMPLEMENTATION_COMPLETE.md - Implementation details

#### Technical Stack
- Angular 17 with standalone components
- TypeScript
- Reactive Forms
- CSS3 with gradients and animations
- LocalStorage for session management

#### Pre-configured Data
- 6 default musicians with seniority
- Default drivers (Lucile, Manu, Marine)
- Example calculation (€1,500 quote)

#### Bundle Size
- Total (gzipped): ~59 KB
- Main bundle: ~47 KB
- Excellent performance

---

## Coming Soon

### Planned Features
- [x] Export results to PDF ✅ (v1.2.0)
- [ ] Email distribution of results
- [ ] Historical data storage
- [ ] Multiple band profiles
- [ ] Customizable fee rules
- [ ] Multi-language support (EN/ES)

---

## Upgrade Guide

### From v1.0.0 to v1.1.0

No breaking changes! Simply rebuild and redeploy:

```bash
# Pull latest changes
git pull

# Rebuild
npm run build

# Deploy
./deploy.sh
```

The new instrument rental feature is optional and doesn't affect existing calculations.

---

## Support

For issues or questions:
- Check documentation files
- Review INSTRUMENT_RENTALS_FEATURE.md for new feature
- Check deployment logs on VPS
- Verify password in auth.service.ts

---

**Last Updated**: October 17, 2025

