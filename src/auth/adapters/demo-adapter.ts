import { AuthModel, UserModel } from '@/auth/lib/models';

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
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  },

  async getUserProfile(): Promise<UserModel> {
    const response = await fetch('/api/user');
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  },

  async updateUserProfile(userData: Partial<UserModel>): Promise<UserModel> {
    // Return mock update for demo
    const profile = await this.getUserProfile();
    return { ...profile, ...userData };
  },

  async logout(): Promise<void> {},
};
