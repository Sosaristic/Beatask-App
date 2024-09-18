export interface FeaturedProvider {
  id: number;
  name: string | null;
  first_legal_name: string;
  last_legal_name: string;
  email: string;
  phone_number: string;
  home_address: string | null;
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
  is_service_provider: boolean;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  profile_photo_url: string;
  is_subscribed_to_one_month_premium: number;
  is_subscribed_to_two_months_subscription: number;
}

export type ServiceType = {
  id: number | string;
  category_id: string;
  service_name: string;
  sub_category: string;
  provider_id: string | number;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  real_price: string;
  discounted_price: string;
  service_description: string;
  availability_dates_times: string;
  review_rating: number;
  is_completed: boolean | null;
  created_at: string;
  updated_at: string;
};

interface Category {
  id: number;
  category: string;
  sub_category: string;
  provider_id: number;
  service_id: string;
  category_image: string | null;
  created_at: string;
  updated_at: string;
}

interface MostBookedInfo {
  id: number;
  category_id: string;
  service_name: string;
  provider_id: string;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  service_description: string;
  real_price: number;
  discounted_price: string;
  availability_dates_times: string;
  review_rating: number;
  is_completed: boolean | number;
  created_at: string;
  updated_at: string;
}

export interface MostBookedService {
  service_id: number;
  dates_and_times: string;
  count: number;
  service: {
    id: number;
    category_id: string;
    sub_category: string;
    service_name: string;
    provider_id: string;
    years_of_experience: string;
    experience_document: string;
    service_image: string;
    service_description: string;
    real_price: number;
    discounted_price: string;
    availability_dates_times: string;
    review_rating: number;
    is_completed: boolean | number;
    created_at: string;
    updated_at: string;
    provider: Provider;
  };
}

export interface HalfPrice {
  id: number;
  category_id: string;
  sub_category: string;
  service_name: string;
  provider_id: string;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  real_price: string; // Kept as string to match JSON format
  discounted_price: string; // Kept as string to match JSON format
  service_description: string;
  availability_dates_times: string; // Converted from JSON string array to TypeScript array
  review_rating: number;
  is_completed: boolean | number;
  created_at: string;
  updated_at: string;
  provider: Provider;
}

interface Provider {
  id: number;
  name: string;
  first_legal_name: string;
  last_legal_name: string;
  email: string;
  phone_number: string;
  home_address: string;
  business_address: string;
  two_factor_secret: string | null;
  two_factor_recovery_codes: string | null;
  two_factor_confirmed_at: string | null;
  government_issue_id: string | null;
  government_issue_image: string | null;
  full_name_driver_license: string | null;
  driver_lisence_image: string | null;
  driver_license_number: string | null;
  driver_license_issue_date: string | null;
  driver_license_expiry_date: string | null;
  passport_number: string | null;
  passport_image: string | null;
  profile_image: string;
  birth_certificate: string | null;
  ein_number: string | null;
  verification_code: string | null;
  verified: boolean | null;
  email_verified_at: string | null;
  is_verified: number;
  two_factor: boolean | null;
  google_id: string | null;
  facebook_id: string | null;
  device_token?: string;
  is_service_provider: number;
  description: string;
  created_at: string;
  updated_at: string;
  profile_photo_url: string;
  is_subscribed_to_one_month_premium: number;
  is_subscribed_to_two_months_subscription: number;
}

export interface BookedServiceType {
  id: number;
  sub_category: string;
  provider_id: string;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  real_price: string;
  discounted_price: string | null;
  availability_dates_times: string[];
  review_rating: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
  provider: Provider;
  service: ServiceType;
  category: Category;
}

type Review = {
  id: string;
  user_id: string;
  provider_id: string;
  rating_stars: string | number;
  review_message: string;
  created_at: string;
  updated_at: string;
  user: FeaturedProvider;
};

export interface singleProviderResponse {
  message: string;
  data: FeaturedProvider;
  reviews: Review[] | Review;
  service: {
    id: number;
    category: string;
    sub_category: string;
    provider_id: string;
    years_of_experience: string;
    experience_document: string;
    service_image: string;
    service_name: string;
    real_price: string;
    discounted_price: string;
    availability_dates_times: string;
    review_rating: number;
    is_completed: boolean | null;
    created_at: Date;
    updated_at: Date;
  };
}

export type SavedProviderData = {
  id: number;
  user_id: string;
  saved_provider_id: string;
  created_at: string;
  updated_at: string;
  provider_information: Provider;
};
export interface SavedProvidersResponse {
  message: string;
  data: SavedProviderData[];
}

export interface UserReview {
  id: string;
  user_id: string;
  provider_id: string;
  rating_stars: string | number;
  review_message: string;
  created_at: string;
  updated_at: string;
  provider: Provider;
}

export interface Filter {
  id: number | string;
  category: string;
  sub_category: string;
  provider_id: string | number;
  service_id: string;
  category_image: string;
  created_at: string;
  updated_at: string;
  service: ServiceType[];
  provider: Provider;
}

export interface SearchedResults {
  id: number;
  category_id: string;
  sub_category: string;
  service_name: string;
  provider_id: string;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  real_price: string;
  discounted_price: string;
  service_description: string;
  availability_dates_times: string;
  review_rating: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface WomenService {
  id: number | string;
  category_id: string;
  service_name: string;
  provider_id: string;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  real_price: string;
  discounted_price: string;
  service_description: string;
  availability_dates_times: string;
  review_rating: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
}

export type WomenenServiceType = {
  id: string | number;
  category_id: string;
  sub_category: string;
  service_name: string;
  provider_id: string;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  real_price: string;
  discounted_price: string;
  service_description: string;
  availability_dates_times: string;
  review_rating: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
  provider: Provider;
  category: Category;
};

export type SingleServicePayload = {
  service_image: string;
  service_name: string;
  provider_name: string;
  category_name: string;
  category_id?: number | string;
  sub_category_name: string;
  real_price: string;
  service_description: string;
  provider_id: string;
  service_id: number | string;
};

export type BookingPriceResponse = {
  message: string;
  service_price: number | string;
  beatask_service_fee: number | string;
  total_price: number | string;
};

export type SortFilter = {
  id: number | string;
  category_id: string;
  service_name: string;
  provider_id: string;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  real_price: string;
  discounted_price: string;
  service_description: string;
  availability_dates_times: string;
  review_rating: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
  category: string;
  sub_category: string;
  service_id: string;
  category_image: string;
  provider: Provider;
};

export type RequestedService = {
  id: string | number;
  category: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  get_user: FeaturedProvider;
};

export interface UnsuccessfulRequest extends ServiceType {
  user: Provider;
  service: ServiceType;
}

export interface CompletedServiceProvider extends UnsuccessfulRequest {
  category: Category;
}

export interface IncomingService {
  id: number;
  provider_id: number;
  service_id: number;
  category_id: number;
  dates_and_times: string; // JSON string, should be parsed for actual use
  description: string;
  is_paid: number;
  created_at: string; // ISO 8601 date string
  updated_at: string; //
  user: Provider;
  service: ServiceType;
  category: Category;
}

export type ListReviewsType = {
  id: number | string;
  user_id: string;
  provider_id: string;
  rating_stars: string;
  review_message: string;
  created_at: null | string;
  updated_at: null | string;
  provider: Provider;
  user: Provider;
};

export type FetchedCategory = {
  id: number | string;
  category: string;
  sub_category: string[];
  provider_id: string | number;
  service_id: string;
  category_image: string;
  created_at: string;
  updated_at: string;
};

export type UpcomingService = {
  id: number;
  provider_id: string | number;
  service_id: string | number;
  category_id: string | number;
  dates_and_times: string;
  final_total_price: number;
  total_price_before_fee: number;
  service_fee: number;
  description: string;
  is_paid: number;
  is_confirm: number;
  created_at: string;
  updated_at: string;
  provider: Provider;
  service: ServiceType;
  category: Category;
  user: Provider;
};

export type PendingTask = {
  id: number;
  provider_id: string | number;
  service_id: string | number;
  category_id: string | number;
  dates_and_times: string;
  description: string;
  is_paid: number;
  is_confirm: number;
  is_completed: number;
  created_at: string;
  updated_at: string;

  service: ServiceType;
  category: Category;
  user: Provider;
};

export type ServiceCompletion = {
  id: number;
  provider_id: string | number;
  user_id: string | number;
  booking_id: string | number;
  notes: string;
  created_at: string;
  updated_at: string;
  provider: Provider;
  user: Provider;
  booked_service: {
    id: number;
    provider_id: number;
    user_id: number;
    service_id: number;
    category_id: number;
    dates_and_times: string[];
    description: string;
    is_paid: number;
    is_confirm: number;
    is_completed: number;
    created_at: string;
    updated_at: string;
    service: ServiceType;
  };
};
