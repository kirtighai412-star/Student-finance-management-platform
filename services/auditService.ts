
import { AuditRecord } from '../types';

const AUDIT_KEY = 'rbupay_audit_db';

class AuditService {
  async runAudit(spent: number): Promise<AuditRecord> {
    const potential = Math.floor(spent * 0.12); // Simulated AI logic
    const audit: AuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: Date.now(),
      potentialSavings: potential,
      category: 'Subscription Audit',
      status: 'pending'
    };
    
    const history = this.getHistory();
    history.unshift(audit);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(history.slice(0, 10)));
    return audit;
  }

  getHistory(): AuditRecord[] {
    const data = localStorage.getItem(AUDIT_KEY);
    return data ? JSON.parse(data) : [];
  }
}

export const auditService = new AuditService();
