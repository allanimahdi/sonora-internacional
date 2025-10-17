# 🚀 Quick Start Guide

## Running the Application

### 1. Start the Development Server

```bash
npm start
```

The application will be available at: **http://localhost:4200**

### 2. Using the Dashboard

#### Pre-filled Example
The dashboard comes pre-loaded with an example calculation matching your requirements:
- **Gross Amount**: €1,500
- **Finder**: Marine
- **Drivers**: Lucile, Manu, Marine (3 cars)
- **6 Musicians** with their respective seniority

Simply click **"Calculate Payroll"** to see the results!

#### Modifying Values
1. Change the gross amount
2. Select different finder
3. Check/uncheck driver boxes
4. Adjust seniority years
5. Add/remove musicians as needed
6. Click **"Calculate Payroll"** to see updated results

#### Adding Personal Backline
If someone provides personal equipment (e.g., congas):
1. Select the owner from the dropdown
2. Enter the rental amount (e.g., €10)
3. This amount will be added to their payment

### 3. Understanding the Results

The results section shows:

#### Summary
- All fees and deductions
- Amount after each step (S1, S2, S3)
- Equal share per person

#### Individual Payments
Each musician's card shows:
- **Equal Share**: Base amount everyone receives
- **Seniority Bonus**: €2 × years served
- **Finder Commission**: 10% bonus (only for finder)
- **Car Allowance**: €10 (only for drivers)
- **Personal Backline**: Rental fee (only for owner)
- **Total**: Sum of all components

#### Verification
- Total paid to musicians
- Group backline fee (to association)
- Grand total (should equal gross amount)

## Default Band Members

| Name   | Seniority | Driver |
|--------|-----------|--------|
| Mahdi  | 4 years   | No     |
| Lucile | 4 years   | Yes    |
| Louis  | 4 years   | No     |
| Marine | 2 years   | Yes    |
| Manu   | 1 year    | Yes    |
| Pablo  | 0 years   | No     |

## Calculation Rules

### Fees (Deducted First)
- **Group Backline**: €20 if quote ≤ €1,300, else €30
- **Car Allowance**: €10 per driver
- **Personal Backline**: Variable amount

### Distribution (After Fees)
1. **Finder Commission**: 10% of (gross - fees)
2. **Seniority Bonuses**: €2/year for each musician
3. **Equal Share**: Remainder ÷ number of musicians

### Individual Payments
Each musician receives:
- Equal share (base)
- + Seniority bonus
- + Finder commission (if finder)
- + Car allowance (if driver)
- + Personal backline (if owner)

## Tips

- Use **Reset** to start a new calculation
- The form validates all inputs automatically
- Results update instantly when you click Calculate
- Scroll automatically to results section
- Mobile-friendly design works on all devices

## Example Calculation (Default Values)

**Quote**: €1,500  
**Group Backline**: €30 (>€1,300)  
**Car Fees**: €30 (3 drivers × €10)  

**S1** (After fees): €1,500 - €60 = €1,440  
**Finder Commission** (Marine): €144 (10% of €1,440)  
**S2**: €1,440 - €144 = €1,296  
**Seniority Bonuses**: €30 total (4+4+4+2+1+0 years × €2)  
**S3** (To distribute): €1,296 - €30 = €1,266  
**Equal Share**: €1,266 ÷ 6 = €211  

**Marine receives**:
- €211 (equal share)
- €4 (2 years × €2)
- €144 (finder)
- €10 (driver)
- **Total: €369**

## Troubleshooting

### Port Already in Use
If port 4200 is busy:
```bash
npm start -- --port 4201
```

### Build Errors
Clear cache and rebuild:
```bash
rm -rf node_modules dist .angular
npm install
npm run build
```

## Need Help?

Check the main [README.md](README.md) for detailed documentation.

---

**Enjoy using the Sonora Internacional Payroll Calculator!** 🎵

