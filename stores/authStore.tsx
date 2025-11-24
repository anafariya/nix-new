import { create } from 'zustand';

type User = {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Name?: string;
  DateOfBirth?: string | Date;
  Gender?: string;
  AuthProvider?: string;
  ProfilePicture?: string;
  AccountType?: string;
  UserId?: number;
  IsEmailVerified?: boolean;
  IsPhoneVerified?: boolean;
  CompanyName?: string;
  LastLoginAt?: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
