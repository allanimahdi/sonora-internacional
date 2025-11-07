import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { PayrollService } from './services/payroll.service';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { BudgetComponent } from './components/budget/budget.component';
import { Musician, PayrollInput, PayrollResult, InstrumentRental } from './models/musician.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoginComponent, BudgetComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  activeTab: 'payroll' | 'budget' = 'payroll';
  payrollForm!: FormGroup;
  result: PayrollResult | null = null;
  showResults = false;
  isAuthenticated = false;

  // Default musicians with their seniority
  defaultMusicians: Musician[] = [
    { name: 'Mahdi', seniorityYears: 4 },
    { name: 'Lucile', seniorityYears: 4 },
    { name: 'Louis', seniorityYears: 4 },
    { name: 'Marine', seniorityYears: 2 },
    { name: 'Manu', seniorityYears: 1 },
    { name: 'Pablo', seniorityYears: 0 }
  ];

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated = authenticated;
    });
    this.initializeForm();
  }

  logout(): void {
    this.authService.logout();
    this.reset();
  }

  switchTab(tab: 'payroll' | 'budget'): void {
    this.activeTab = tab;
  }

  initializeForm(): void {
    this.payrollForm = this.fb.group({
      grossAmount: [1500, [Validators.required, Validators.min(0)]],
      additionalTravelFees: [0, [Validators.min(0)]],
      numberOfCars: [3, [Validators.required, Validators.min(0)]],
      finderName: ['Marine', Validators.required],
      personalBacklineOwner: [null],
      personalBacklineAmount: [0, [Validators.min(0)]],
      musicians: this.fb.array([]),
      instrumentRentals: this.fb.array([])  // New: instrument rentals array
    });

    // Initialize musicians
    this.defaultMusicians.forEach(musician => {
      this.addMusician(musician);
    });

    // Initialize drivers
    this.musicians.controls.forEach((control, index) => {
      const musicianName = this.defaultMusicians[index].name;
      control.get('isDriver')?.setValue(
        musicianName === 'Lucile' || musicianName === 'Manu' || musicianName === 'Marine'
      );
    });
  }

  get musicians(): FormArray {
    return this.payrollForm.get('musicians') as FormArray;
  }

  get instrumentRentals(): FormArray {
    return this.payrollForm.get('instrumentRentals') as FormArray;
  }

  addMusician(musician?: Musician): void {
    const musicianGroup = this.fb.group({
      name: [musician?.name || '', Validators.required],
      seniorityYears: [musician?.seniorityYears || 0, [Validators.required, Validators.min(0)]],
      isDriver: [false]
    });
    this.musicians.push(musicianGroup);
  }

  removeMusician(index: number): void {
    this.musicians.removeAt(index);
  }

  addNewMusician(): void {
    this.addMusician();
  }

  addInstrumentRental(): void {
    const rentalGroup = this.fb.group({
      renterName: ['', Validators.required],
      ownerName: ['', Validators.required],
      amount: [10, [Validators.required, Validators.min(0)]],
      instrument: ['', Validators.required]
    });
    this.instrumentRentals.push(rentalGroup);
  }

  removeInstrumentRental(index: number): void {
    this.instrumentRentals.removeAt(index);
  }

  calculate(): void {
    if (this.payrollForm.invalid) {
      Object.keys(this.payrollForm.controls).forEach(key => {
        this.payrollForm.get(key)?.markAsTouched();
      });
      this.musicians.controls.forEach(control => {
        Object.keys(control.value).forEach(key => {
          control.get(key)?.markAsTouched();
        });
      });
      return;
    }

    const formValue = this.payrollForm.value;
    
    // Get drivers
    const drivers: string[] = [];
    formValue.musicians.forEach((musician: any) => {
      if (musician.isDriver) {
        drivers.push(musician.name);
      }
    });

    // Count actual drivers
    const actualNumberOfCars = drivers.length;

    const input: PayrollInput = {
      grossAmount: formValue.grossAmount,
      additionalTravelFees: formValue.additionalTravelFees,
      numberOfCars: actualNumberOfCars,
      drivers: drivers,
      finderName: formValue.finderName,
      personalBacklineOwner: formValue.personalBacklineOwner || null,
      personalBacklineAmount: formValue.personalBacklineAmount || 0,
      instrumentRentals: formValue.instrumentRentals || []
    };

    const musicians: Musician[] = formValue.musicians.map((m: any) => ({
      name: m.name,
      seniorityYears: m.seniorityYears
    }));

    this.result = this.payrollService.calculatePayroll(input, musicians);
    this.showResults = true;

    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  reset(): void {
    this.showResults = false;
    this.result = null;
    this.initializeForm();
  }

  getTotalPaid(): number {
    if (!this.result) return 0;
    return this.result.payments.reduce((sum, payment) => sum + payment.total, 0);
  }

  getAvailableMusicians(): string[] {
    return this.payrollForm.value.musicians.map((m: any) => m.name).filter((name: string) => name);
  }

  async downloadPDF(): Promise<void> {
    const resultsElement = document.getElementById('results-card');
    if (!resultsElement) return;

    try {
      // Show loading state (you can add a loading spinner if desired)
      const downloadButton = document.querySelector('.btn-download-pdf') as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.textContent = '⏳ Génération en cours...';
      }

      // Capture the element as canvas
      const canvas = await html2canvas(resultsElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `Sonora-Internacional-Cachets-${date}.pdf`;
      
      // Download
      pdf.save(filename);

      // Reset button
      if (downloadButton) {
        downloadButton.disabled = false;
        downloadButton.textContent = '📄 Télécharger en PDF';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
      
      // Reset button
      const downloadButton = document.querySelector('.btn-download-pdf') as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.disabled = false;
        downloadButton.textContent = '📄 Télécharger en PDF';
      }
    }
  }
}

