
import { StudentFee } from '../types';
import { getStudentFees } from './mockDataService';

const FEES_KEY = 'rbupay_student_fees_v1';
const LAST_AUTO_SAVE_KEY = 'rbupay_last_autosave_v1';

class FeeService {
  private getFees(): StudentFee[] {
    const data = localStorage.getItem(FEES_KEY);
    return data ? JSON.parse(data) : getStudentFees();
  }

  private saveFees(fees: StudentFee[]) {
    localStorage.setItem(FEES_KEY, JSON.stringify(fees));
  }

  async getAllFees(): Promise<StudentFee[]> {
    return this.getFees();
  }

  async updateFee(id: string, update: Partial<StudentFee>): Promise<StudentFee[]> {
    const fees = this.getFees();
    const updated = fees.map(f => f.id === id ? { ...f, ...update } : f);
    this.saveFees(updated);
    return updated;
  }

  async createFee(fee: Omit<StudentFee, 'id'>): Promise<StudentFee[]> {
    const fees = this.getFees();
    const newFee = { ...fee, id: `fee-${Date.now()}` };
    const updated = [...fees, newFee];
    this.saveFees(updated);
    return updated;
  }

  /**
   * Processes auto-save logic based on time elapsed since last login.
   * Simulates a cloud function running in the background.
   */
  async processAutoSaves(): Promise<{ updatedFees: StudentFee[], totalDeposited: number }> {
    const now = Date.now();
    const lastSaveStr = localStorage.getItem(LAST_AUTO_SAVE_KEY);
    const lastSave = lastSaveStr ? parseInt(lastSaveStr) : now;
    
    // Logic: 1 minute in real life = 1 day of campus life for demo purposes
    const msPerSimDay = 60000; 
    const daysElapsed = Math.floor((now - lastSave) / msPerSimDay); 
    
    if (daysElapsed <= 0) return { updatedFees: this.getFees(), totalDeposited: 0 };

    let totalDeposited = 0;
    const fees = this.getFees().map(fee => {
      if (fee.isAutoSaveActive && fee.savedAmount < fee.totalAmount) {
        const deposit = Math.min(fee.dailyContribution * daysElapsed, fee.totalAmount - fee.savedAmount);
        totalDeposited += deposit;
        return { ...fee, savedAmount: fee.savedAmount + deposit };
      }
      return fee;
    });

    this.saveFees(fees);
    localStorage.setItem(LAST_AUTO_SAVE_KEY, now.toString());
    return { updatedFees: fees, totalDeposited };
  }
}

export const feeService = new FeeService();
