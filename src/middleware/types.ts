import { Request } from "express";

export interface Payload {
    message: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    accessToken?: string
}
export interface CustomRequest extends Request{ payload: Payload, user: number }