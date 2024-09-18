import {create} from 'zustand';
export type User = {
  id: number;
  name: string | null;
  first_legal_name: string;
  last_legal_name: string;
  email: string;
  phone_number: string;
  home_address: string;
  business_address: string | null;
  two_factor_secret: string | null;
  two_factor_recovery_codes: string | null;
  two_factor_confirmed_at: Date | null;
  government_issue_id: string | null;
  government_issue_image: string | null;
  full_name_driver_license: string | null;
  driver_license_image: string | null;
  driver_license_number: string | null;
  driver_license_issue_date: Date | null;
  driver_license_expiry_date: Date | null;
  passport_number: string | null;
  passport_image: string | null;
  profile_image: string;
  birth_certificate: string | null;
  ein_number: string | null;
  verification_code: string | null;
  verified: boolean | null;
  email_verified_at: Date | null;
  is_verified: boolean;
  two_factor: boolean | null;
  google_id: string | null;
  facebook_id: string | null;
  is_service_provider: boolean | number;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  profile_photo_url: string;
  is_subscribed_to_one_month_premium: number;
  is_subscribed_to_two_months_subscription: number;
} | null;

type UserType = {
  user: User;
  unReadMessages: number;
  isAuthenticated: boolean;
  device_token: string;
  showWarning: boolean;
  actions: {
    login: (user: User) => void;
    logout: () => void;
    setUnreadMessages: (value: number) => void;
    setDeviceToken: (value: string) => void;
    setShowWarning: (value: boolean) => void;
  };
};

const initialValues = {
  user: null,
  isAuthenticated: false,
  unReadMessages: 0,
  device_token: '',
  showWarning: true,
};

export const useUserStore = create<UserType>(set => ({
  ...initialValues,
  actions: {
    login: (user: User) => {
      set({user, isAuthenticated: true});
    },
    logout: () => {
      set({user: initialValues.user, isAuthenticated: false});
    },
    setUnreadMessages: (value: number) => {
      set({unReadMessages: value});
    },
    setDeviceToken: (value: string) => {
      set({device_token: value});
    },
    setShowWarning: (value: boolean) => {
      set({showWarning: value});
    },
  },
}));
