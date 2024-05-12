export interface IResponseApi<Data> {
  message: string;
  data?: Data;
  total?: number;
}
