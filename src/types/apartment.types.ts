export interface IApartment {
  id?: string;
  title: string;
  img?: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  address: string;
  latitute: number;
  longitute: number;
  size?: number;
  city?: string;
  school?: number;
  bus?: number;
  restaurant?: number;
  desc?: string;
  images?: string[];
  utilities?: string;
  pet?: string;
  income?: string;
  type: "buy" | "rent";
  property: "apartment" | "house" | "condo" | "land";
  status: "available" | "wasRented";
  createdAt: Date;
  user?: {
    avatar: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  isSaved: boolean;
  userId: string;
}
