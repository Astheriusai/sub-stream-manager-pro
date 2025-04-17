
export type Product = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
};

export type PriceList = {
  id: string;
  subscriber_id: string;
  product_id: string;
  price: number;
  created_at: string;
  product_name?: string;
};
