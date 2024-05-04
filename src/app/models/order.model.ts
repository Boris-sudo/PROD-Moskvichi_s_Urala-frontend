export interface OrderModel {
  id: number,
  employer_name: string,
  employer_phone: string,
  employer_id?: number,
  product_name: string,
  product_description: string,
  date: string,
  address: { lon: number, lat: number, name: string },
  documents: number[],
  status?: boolean,
  status2?: string,
  rate?: number;
}
