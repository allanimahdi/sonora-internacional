import { Injectable } from '@angular/core';
import { Musician, PayrollInput, PayrollResult, MusicianPayment } from '../models/musician.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private readonly CAR_FEE_PER_CAR = 10;
  private readonly SENIORITY_BONUS_PER_YEAR = 2;
  private readonly FINDER_COMMISSION_RATE = 0.10;
  private readonly BACKLINE_THRESHOLD = 1300;
  private readonly BACKLINE_FEE_LOW = 20;
  private readonly BACKLINE_FEE_HIGH = 30;

  calculatePayroll(input: PayrollInput, musicians: Musician[]): PayrollResult {
    // Step 1: Calculate backline fee based on gross amount
    const backlineFee = input.grossAmount <= this.BACKLINE_THRESHOLD 
      ? this.BACKLINE_FEE_LOW 
      : this.BACKLINE_FEE_HIGH;

    // Step 2: Calculate car fees
    const carFees = input.numberOfCars * this.CAR_FEE_PER_CAR;

    // Step 3: Calculate total fees
    const totalFees = backlineFee + input.personalBacklineAmount + carFees + input.additionalTravelFees;

    // Step 4: Amount after fees (S1)
    const amountAfterFees = input.grossAmount - totalFees;

    // Step 5: Calculate finder commission (10% of S1)
    const finderCommission = this.roundToTwo(amountAfterFees * this.FINDER_COMMISSION_RATE);

    // Step 6: Amount after finder commission (S2)
    const amountAfterFinderCommission = amountAfterFees - finderCommission;

    // Step 7: Calculate total seniority bonuses
    const totalSeniorityBonus = musicians.reduce(
      (sum, musician) => sum + (musician.seniorityYears * this.SENIORITY_BONUS_PER_YEAR), 
      0
    );

    // Step 8: Amount to distribute equally (S3)
    const amountToDistribute = amountAfterFinderCommission - totalSeniorityBonus;

    // Step 9: Calculate equal share per person
    const equalSharePerPerson = this.roundToTwo(amountToDistribute / musicians.length);

    // Step 10: Calculate individual payments
    const payments: MusicianPayment[] = musicians.map(musician => {
      const seniorityBonus = musician.seniorityYears * this.SENIORITY_BONUS_PER_YEAR;
      const isDriver = input.drivers.includes(musician.name);
      const isFinder = input.finderName === musician.name;
      const isBacklineOwner = input.personalBacklineOwner === musician.name;

      // Calculate instrument rental income and expenses
      const rentalIncome = input.instrumentRentals
        .filter(rental => rental.ownerName === musician.name)
        .reduce((sum, rental) => sum + rental.amount, 0);

      const rentalExpense = input.instrumentRentals
        .filter(rental => rental.renterName === musician.name)
        .reduce((sum, rental) => sum + rental.amount, 0);

      const payment: MusicianPayment = {
        name: musician.name,
        equalShare: equalSharePerPerson,
        seniorityBonus: seniorityBonus,
        finderCommission: isFinder ? finderCommission : 0,
        carAllowance: isDriver ? this.CAR_FEE_PER_CAR : 0,
        personalBackline: isBacklineOwner ? input.personalBacklineAmount : 0,
        instrumentRentalIncome: rentalIncome,
        instrumentRentalExpense: rentalExpense,
        total: 0
      };

      payment.total = this.roundToTwo(
        payment.equalShare + 
        payment.seniorityBonus + 
        payment.finderCommission + 
        payment.carAllowance + 
        payment.personalBackline +
        payment.instrumentRentalIncome -
        payment.instrumentRentalExpense
      );

      return payment;
    });

    return {
      grossAmount: input.grossAmount,
      totalFees: totalFees,
      backlineFee: backlineFee,
      carFees: carFees,
      personalBacklineFee: input.personalBacklineAmount,
      additionalTravelFees: input.additionalTravelFees,
      amountAfterFees: amountAfterFees,
      finderCommission: finderCommission,
      totalSeniorityBonus: totalSeniorityBonus,
      amountToDistribute: amountToDistribute,
      equalSharePerPerson: equalSharePerPerson,
      payments: payments
    };
  }

  private roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
  }

  // Verify that total payments equal gross amount
  verifyCalculation(result: PayrollResult): boolean {
    const totalPaid = result.payments.reduce((sum, payment) => sum + payment.total, 0);
    const totalWithBackline = totalPaid + result.backlineFee;
    const difference = Math.abs(result.grossAmount - totalWithBackline);
    // Allow for small rounding differences (less than 1 cent per person)
    return difference < 0.1;
  }
}

