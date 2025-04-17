
export type Product = {
  id: string;
  name: string;
  base_price: number;
  max_profiles: number;
  allowed_durations: number[];
  status: 'active' | 'inactive';
  created_at: string;
};

export type ProductFormData = {
  name: string;
  base_price: string;
  max_profiles: string;
  allowed_durations: number[];
  status: boolean;
};
