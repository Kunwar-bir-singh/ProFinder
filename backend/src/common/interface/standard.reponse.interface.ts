import { Errors } from "./exception.interface";

export interface StandardResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?:Errors[];
    statusCode: number;
    path?:string
  }