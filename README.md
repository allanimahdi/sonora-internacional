# 🎵 Sonora Internacional - Calculateur de Répartition des Cachets

A modern Angular dashboard application for calculating payroll distribution for music bands, with automatic calculation of fees, commissions, bonuses, and equal distribution. **Fully in French** with password authentication.

## Features

- 🔐 **Password Authentication**: Secure login to protect sensitive payroll information
- 🇫🇷 **French Interface**: Complete French translation for easy use
- 📝 **Interactive Form**: Easy-to-use form for inputting gig details
- 👥 **Dynamic Musicians Management**: Add or remove musicians on the fly
- 💰 **Automatic Calculations**:
  - Group backline fees (€20 or €30 based on quote)
  - Car allowances (€10 per driver)
  - Finder commission (10% of net amount)
  - Seniority bonuses (€2 per year per musician)
  - Equal distribution of remaining amount
- 🎸 **Instrument Rentals Between Musicians**: Handle rentals between band members (one pays, one receives)
- 📄 **PDF Export**: Download calculation results as a professional PDF document
- **Detailed Breakdown**: View individual payment breakdowns for each musician
- **Verification**: Automatic verification that total payments equal the gross amount
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

## Calculation Logic

1. **Total Fees** = Group backline + Personal backline + Car fees + Additional travel fees
2. **S1** (Amount after fees) = Gross amount - Total fees
3. **Finder Commission** = 10% of S1
4. **S2** (Amount after finder) = S1 - Finder commission
5. **Total Seniority Bonuses** = Sum of (€2 × years for each musician)
6. **S3** (Amount to distribute) = S2 - Total seniority bonuses
7. **Equal Share** = S3 / Number of musicians
8. **Individual Total** = Equal share + Seniority bonus + Finder commission (if applicable) + Car allowance (if driver) + Personal backline (if owner) + Instrument rental income - Instrument rental expense

### Instrument Rentals (New Feature)
When Musician A rents from Musician B:
- **Musician B** (owner): Gets **+amount** added to their total
- **Musician A** (renter): Gets **-amount** deducted from their total
- This is a **direct transfer** between musicians, not affecting the global pool

See [INSTRUMENT_RENTALS_FEATURE.md](INSTRUMENT_RENTALS_FEATURE.md) for detailed documentation.

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup

1. Clone the repository or navigate to the project directory:
```bash
cd sonora-internacional
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## 🔐 Authentication

### Default Password

The application is protected with a password: **sonora2025**

To change the password, edit:
```
src/app/services/auth.service.ts
```

Find and modify:
```typescript
private readonly VALID_PASSWORD = 'sonora2025';
```

## Usage

### Basic Workflow

1. **Login**: Enter the password to access the calculator

2. **Enter Gig Details** (Informations Générales):
   - Gross amount (total billed to client)
   - Additional travel fees (optional)
   - Select the finder (person who found the gig)
   - Specify personal backline owner and amount (if applicable)

3. **Configure Musicians** (Musiciens):
   - Each musician's name (Nom)
   - Seniority in years (Ancienneté)
   - Check the box if they're a driver (Conducteur)
   - Add or remove musicians as needed

4. **Add Instrument Rentals** (Optional - Locations d'Instruments):
   - If Musician A rents an instrument from Musician B
   - Musician B receives +€10 (or custom amount)
   - Musician A pays -€10 (deducted from their final payment)
   - Example: Louis rents congas from Mahdi

5. **Calculate** (Calculer les Cachets):
   - Click "Calculer les Cachets" to see the results
   - View detailed breakdown for each musician
   - See instrument rental transactions (+/-)
   - Verify total amounts

6. **Download PDF** (Optional):
   - Click "📄 Télécharger en PDF" to export results
   - Professional PDF document with all details
   - Automatic filename with date
   - Perfect for sharing or archiving

7. **Reset**: Use "Réinitialiser" to start a new calculation

8. **Logout**: Click "Déconnexion" to log out securely

### Default Musicians

The application comes pre-configured with:
- **Mahdi** (4 years)
- **Lucile** (4 years, driver)
- **Louis** (4 years)
- **Marine** (2 years, driver)
- **Manu** (1 year, driver)
- **Pablo** (0 years)

## Project Structure

```
sonora-internacional/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── musician.model.ts      # Data models
│   │   ├── services/
│   │   │   └── payroll.service.ts     # Calculation logic
│   │   ├── app.component.ts           # Main component
│   │   ├── app.component.html         # Template
│   │   └── app.component.css          # Styles
│   ├── index.html
│   ├── main.ts
│   └── styles.css                     # Global styles
├── angular.json                       # Angular configuration
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript configuration
└── README.md
```

## Technologies Used

- **Angular 17**: Latest version with standalone components
- **TypeScript**: Type-safe development
- **Reactive Forms**: For form management and authentication
- **CSS3**: Modern styling with gradients and animations
- **LocalStorage**: Secure session management

## 🚀 Deployment

### For VPS Deployment (Same Server as ResaPrivee)

Complete deployment instructions are in **[DEPLOYMENT.md](DEPLOYMENT.md)**

Quick steps:
1. Build: `./build-production.sh`
2. Upload to VPS: `./deploy.sh` (after configuring)
3. Configure Nginx (see `nginx-sonora.conf`)
4. Set up SSL with Certbot
5. Access at your domain

### Building for Production

To build the application for production:

```bash
# Using the build script
./build-production.sh

# Or manually
npm run build
```

The build artifacts will be stored in the `dist/sonora-internacional/browser/` directory.

For detailed deployment instructions to your VPS, see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## Development

### Watch Mode

To continuously build the application during development:

```bash
npm run watch
```

### Modifying Business Rules

To modify the calculation rules, edit the constants in `src/app/services/payroll.service.ts`:

- `CAR_FEE_PER_CAR`: Car allowance per driver
- `SENIORITY_BONUS_PER_YEAR`: Bonus per year of seniority
- `FINDER_COMMISSION_RATE`: Percentage for finder commission
- `BACKLINE_THRESHOLD`: Threshold for backline fee calculation
- `BACKLINE_FEE_LOW`: Backline fee below threshold
- `BACKLINE_FEE_HIGH`: Backline fee above threshold

## Example Calculation

For a gig with:
- Gross amount: €1,500
- 3 drivers (Lucile, Manu, Marine)
- Finder: Marine
- 6 musicians with varying seniority

The calculator will:
1. Deduct €30 (backline) + €30 (3 cars) = €60 in fees
2. Calculate 10% finder commission on €1,440
3. Distribute seniority bonuses
4. Split remaining amount equally
5. Add individual bonuses to each musician

## License

This project is private and intended for Sonora Internacional use only.

## Support

For issues or questions, please contact the development team.

