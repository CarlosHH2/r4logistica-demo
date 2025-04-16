
export interface Order {
  id: string;
  street: string;
  number: string;
  int_number?: string;
  administrative_area: string;
  sub_administrative_area: string;
  country: 'MX';
  neighborhood: string;
  postal_code: string;
  lat?: number;
  lng?: number;
  notes?: string;
  reference?: string;
  is_manual: boolean;
  created_at: string;
  updated_at: string;
}
