export interface Musician {
  name: string;
  seniorityYears: number;
}

export interface InstrumentRental {
  renterName: string;      // Musician who rents (pays -10€)
  ownerName: string;        // Musician who owns (receives +10€)
  amount: number;           // Amount (typically 10€)
  instrument: string;       // Description (e.g., "Congas")
}

export interface PayrollInput {
  grossAmount: number;
  additionalTravelFees: number;
  numberOfCars: number;
  drivers: string[];
  finderName: string;
  personalBacklineOwner: string | null;
  personalBacklineAmount: number;
  instrumentRentals: InstrumentRental[];  // New: inter-musician rentals
}

export interface MusicianPayment {
  name: string;
  equalShare: number;
  seniorityBonus: number;
  finderCommission: number;
  carAllowance: number;
  personalBackline: number;
  instrumentRentalIncome: number;   // New: rental received from others
  instrumentRentalExpense: number;  // New: rental paid to others
  total: number;
}

export interface PayrollResult {
  grossAmount: number;
  totalFees: number;
  backlineFee: number;
  carFees: number;
  personalBacklineFee: number;
  additionalTravelFees: number;
  amountAfterFees: number;
  finderCommission: number;
  totalSeniorityBonus: number;
  amountToDistribute: number;
  equalSharePerPerson: number;
  payments: MusicianPayment[];
}

