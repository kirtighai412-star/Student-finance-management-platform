
import { UserProfile, UserSettings } from '../types';
import { getInitialSettings, getInitialProfile } from './mockDataService';

const USERS_KEY = 'rbupay_vault_users_v2';
const SESSION_KEY = 'rbupay_active_node_v2';

export interface UserDBEntry {
  profile: UserProfile;
  pin: string;
}

class AuthService {
  private getUsers(): Record<string, UserDBEntry> {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveUsers(users: Record<string, UserDBEntry>) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  /**
   * Node Initialization (Signup)
   */
  async signup(name: string, email: string, pin: string, bankName: string): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      // Latency simulation to feel 'real-world'
      setTimeout(() => {
        const users = this.getUsers();
        const normalizedEmail = email.toLowerCase().trim();
        
        if (users[normalizedEmail]) {
          reject(new Error("Node already exists in the RBU network."));
          return;
        }

        const newProfile: UserProfile = {
          ...getInitialProfile(),
          name,
          email: normalizedEmail,
          bankName,
          upiId: `${normalizedEmail.split('@')[0]}@rbupay`,
          isSessionVerified: false,
        };

        users[normalizedEmail] = {
          profile: newProfile,
          pin: pin
        };

        this.saveUsers(users);
        localStorage.setItem(SESSION_KEY, normalizedEmail);
        resolve(newProfile);
      }, 1500);
    });
  }

  /**
   * Protocol Authentication (Login)
   */
  async login(email: string, pin: string): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers();
        const normalizedEmail = email.toLowerCase().trim();
        const user = users[normalizedEmail];

        // Master backdoors for demo testing: 1234 or 0000
        if (!user || (user.pin !== pin && pin !== '1234' && pin !== '0000')) {
          reject(new Error("Node identity mismatch. Unauthorized access attempt logged."));
          return;
        }

        localStorage.setItem(SESSION_KEY, normalizedEmail);
        resolve(user.profile);
      }, 1200);
    });
  }

  async checkSession(): Promise<UserProfile | null> {
    const activeEmail = localStorage.getItem(SESSION_KEY);
    if (!activeEmail) return null;

    const users = this.getUsers();
    return users[activeEmail]?.profile || null;
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  updateProfile(profile: UserProfile) {
    const users = this.getUsers();
    const normalizedEmail = profile.email.toLowerCase().trim();
    if (users[normalizedEmail]) {
      users[normalizedEmail].profile = profile;
      this.saveUsers(users);
    }
  }
}

export const authService = new AuthService();
