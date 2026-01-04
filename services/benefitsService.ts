
const APPLIED_KEY = 'rbupay_applied_benefits_v1';
const SAVED_OFFERS_KEY = 'rbupay_saved_offers_v1';

class BenefitsService {
  getAppliedIds(): string[] {
    const data = localStorage.getItem(APPLIED_KEY);
    return data ? JSON.parse(data) : [];
  }

  getSavedOfferIds(): string[] {
    const data = localStorage.getItem(SAVED_OFFERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async applyToBenefit(id: string): Promise<string[]> {
    const applied = this.getAppliedIds();
    if (!applied.includes(id)) {
      applied.push(id);
      localStorage.setItem(APPLIED_KEY, JSON.stringify(applied));
    }
    return applied;
  }

  async toggleSaveOffer(id: string): Promise<string[]> {
    let saved = this.getSavedOfferIds();
    if (saved.includes(id)) {
      saved = saved.filter(oid => oid !== id);
    } else {
      saved.push(id);
    }
    localStorage.setItem(SAVED_OFFERS_KEY, JSON.stringify(saved));
    return saved;
  }
}

export const benefitsService = new BenefitsService();
