
import { CampusGig } from '../types';

const GIGS_KEY = 'rbupay_campus_gigs_v1';

const INITIAL_GIGS: CampusGig[] = [
  { id: '1', title: 'Pick up Lab Manual - Physics Dept', reward: 50, postedBy: 'Rahul K.', location: 'Main Library', type: 'Gig' },
  { id: '2', title: 'Second Hand Calculus Book (Stewart)', reward: 450, postedBy: 'Ishita S.', location: 'Hostel 4 Lobby', type: 'Marketplace' },
  { id: '3', title: 'Deliver Chai to Room 204', reward: 20, postedBy: 'Siddharth', location: 'Canteen Area', type: 'Gig' }
];

class CampusService {
  async getGigs(): Promise<CampusGig[]> {
    const data = localStorage.getItem(GIGS_KEY);
    return data ? JSON.parse(data) : INITIAL_GIGS;
  }

  async addGig(gig: CampusGig): Promise<CampusGig[]> {
    const current = await this.getGigs();
    const updated = [gig, ...current];
    localStorage.setItem(GIGS_KEY, JSON.stringify(updated));
    return updated;
  }

  async deleteGig(id: string): Promise<CampusGig[]> {
    const current = await this.getGigs();
    const updated = current.filter(g => g.id !== id);
    localStorage.setItem(GIGS_KEY, JSON.stringify(updated));
    return updated;
  }
}

export const campusService = new CampusService();
