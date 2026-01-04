
import { Transaction, FraudAlert, RiskScore } from '../types';

const ALERTS_KEY = 'rbupay_fraud_alerts';

class TransactionAnalysisService {
  /**
   * Simulates ML Kit / BigQuery pattern analysis on a new transaction
   */
  async analyzeTransaction(tx: Transaction, history: Transaction[]): Promise<FraudAlert | null> {
    // 1. Velocity Detection: Rapid payments within 1 minute
    const oneMinuteAgo = Date.now() - 60000;
    const recentTxCount = history.filter(t => t.timestamp > oneMinuteAgo).length;
    
    if (recentTxCount >= 2) {
      return this.createAlert(tx.id, 'velocity', 'high', 'Rapid repeated payments detected. Potential unauthorized activity.');
    }

    // 2. Anomaly Detection: Large amounts for unverified students
    if (tx.amount > 15000) {
      return this.createAlert(tx.id, 'amount', 'medium', 'Unusually large transaction amount for student profile.');
    }

    // 3. Simple Pattern: Same recipient, different category in short time
    const sameRecipient = history.find(t => t.recipient === tx.recipient && t.category !== tx.category && t.timestamp > Date.now() - 3600000);
    if (sameRecipient) {
      return this.createAlert(tx.id, 'pattern', 'low', 'Category mismatch for repeat recipient. Please verify usage.');
    }

    return null;
  }

  private createAlert(txId: string, type: FraudAlert['type'], severity: RiskScore, description: string): FraudAlert {
    const alert: FraudAlert = {
      id: `alert-${Math.random().toString(36).substr(2, 9)}`,
      txId,
      timestamp: Date.now(),
      type,
      severity,
      description
    };
    this.persistAlert(alert);
    return alert;
  }

  private persistAlert(alert: FraudAlert) {
    const alerts = this.getAlerts();
    alerts.unshift(alert);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts.slice(0, 20))); // Keep last 20
  }

  getAlerts(): FraudAlert[] {
    const data = localStorage.getItem(ALERTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  clearAlerts() {
    localStorage.removeItem(ALERTS_KEY);
  }
}

export const transactionAnalysisService = new TransactionAnalysisService();
