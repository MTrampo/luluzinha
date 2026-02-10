import { HttpStatusEnum } from "../enums/http";

export interface ResponseProps<T = null> {
  status: HttpStatusEnum;
  message: string;
  data: T | null;
  error?: string | null;
}

export type ResponseInput<T = null> = Omit<ResponseProps<T>, "status" | "data"> & {
  data?: T | null;
};

export interface FetchOptions<TBody = Record<string, unknown>> extends Omit<RequestInit, 'body'> {
  params?: Record<string, string>;
  body?: TBody; 
}