export interface ISearchForm {
  type: "buy" | "rent";
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  property?: string;
}
