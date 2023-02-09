import axios, { AxiosInstance } from "axios";
import { TRUVERIFI_SERVICES } from "../gen/services";

export type Service = TRUVERIFI_SERVICES;

export abstract class VerificationClient {
  protected http: AxiosInstance = axios.create({ validateStatus: null });
  public phoneNumber: string | undefined;

  constructor(protected apiKey: string, protected service: Service) {}

  protected abstract authenticate(): void;
  abstract getBalance(): Promise<number>;
  abstract startVerification(): Promise<string>;
  abstract claimVerification(): Promise<string>;
  abstract cancelVerification(): Promise<void>;
}
