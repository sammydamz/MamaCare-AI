import { AuthModel, UserModel } from '@/auth/lib/models';

const DEMO_USER: UserModel = {
  id: 'demo-user-001',
  username: 'demo',
  email: 'demo@kt.com',
  first_name: 'Demo',
  last_name: 'User',
  fullname: 'Demo User',
  email_verified: true,
  occupation: 'Developer',
  company_name: 'Keenthemes',
  phone: '+1 234 567 890',
  roles: [1],
  pic: '',
  language: 'en',
  is_admin: true,
};

const DEMO_CREDENTIALS = { email: 'demo@kt.com', password: 'demo123' };

export const DemoAdapter = {
  async login(email: string, password: string): Promise<AuthModel> {
    if (
      email !== DEMO_CREDENTIALS.email ||
      password !== DEMO_CREDENTIALS.password
    ) {
      throw new Error('Invalid email or password');
    }
    return {
      access_token: 'demo-access-token',
      refresh_token: 'demo-refresh-token',
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
    return { ...DEMO_USER };
  },

  async getUserProfile(): Promise<UserModel> {
    return { ...DEMO_USER };
  },

  async updateUserProfile(userData: Partial<UserModel>): Promise<UserModel> {
    return { ...DEMO_USER, ...userData };
  },

  async logout(): Promise<void> {},
};
