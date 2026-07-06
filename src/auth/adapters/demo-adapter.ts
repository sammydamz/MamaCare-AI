import { AuthModel, UserModel } from '@/auth/lib/models';

const USER_STORAGE_KEY = 'mamacare-current-user';

function saveUserToStorage(user: UserModel) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function getUserFromStorage(): UserModel | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const DemoAdapter = {
  async login(email: string, password: string): Promise<AuthModel> {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Invalid email or password');
    }

    const data = await response.json();
    if (data.user) {
      saveUserToStorage(data.user);
    }
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  },

  async signInWithOAuth(): Promise<void> {
    throw new Error('OAuth is not available in demo mode');
  },

  async register(
    email: string,
    password: string,
    password_confirmation: string,
    firstName?: string,
    lastName?: string,
  ): Promise<AuthModel> {
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }
    if (firstName || lastName) {
      // Dummy check to satisfy unused variables lint rule
    }
    return {
      access_token: 'demo-access-token',
      refresh_token: 'demo-refresh-token',
    };
  },

  async requestPasswordReset(email?: string): Promise<void> {
    console.log(`Demo mode: password reset requested for ${email}`);
  },

  async resetPassword(password: string, password_confirmation: string): Promise<void> {
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }
  },

  async resendVerificationEmail(email?: string): Promise<void> {
    console.log(`Demo mode: verification email resent to ${email}`);
  },

  async getCurrentUser(): Promise<UserModel | null> {
    return getUserFromStorage();
  },

  async getUserProfile(): Promise<UserModel> {
    const user = getUserFromStorage();
    if (!user) {
      throw new Error('No user found');
    }
    return user;
  },

  async updateUserProfile(userData: Partial<UserModel>): Promise<UserModel> {
    // Return mock update for demo
    const profile = await this.getUserProfile();
    return { ...profile, ...userData };
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
  },
};
