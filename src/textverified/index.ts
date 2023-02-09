import { TRUVERIFI_SERVICES } from "../../gen/services";
import { Service, VerificationClient } from "../base";
import { Status, VerificationResponse } from "./types";

export class Textverified extends VerificationClient {
  private expiration: Date | undefined;
  private verificationId: string | undefined;

  constructor(protected apiKey: string, protected service: Service) {
    super(apiKey, service);
    this.http.defaults.baseURL = "https://www.textverified.com/api";

    this.authenticate();
  }

  async checkAuthentication() {
    if (!this.expiration) throw new Error("Truverifi: unauthenticated");

    if (new Date() > this.expiration) await this.authenticate();
  }

  async authenticate() {
    const response = await this.http.post("SimpleAuthentication");
    const { data } = response;

    if (response.status > 200)
      throw new Error("Textverified - could not authenticate " + response.statusText);

    this.http.defaults.headers["Authorization"] = "Bearer " + data.bearer_token;
    this.expiration = data.expiration;
  }

  async startVerification(): Promise<string> {
    await this.checkAuthentication();

    const response = await this.http.post<VerificationResponse>("Verifications", {
      id: this.service,
    });
    const { data } = response;

    if (response.status > 200)
      throw new Error("Textverified: could not start verification - " + response.statusText);

    if (!data.number || !data.id) {
      throw new Error("Textverified: failed to start verification");
    }

    this.phoneNumber = data.number;
    this.verificationId = data.id;

    return data.number;
  }

  async claimVerification(): Promise<string> {
    const response = await this.http.post<VerificationResponse>(
      `Verifications/${this.verificationId}`
    );
    const { data } = response;

    if (response.status > 200) throw new Error("Textverified: could not check verification status");
    if (data.sms == null) throw new Error("Textverified: no SMS found for this line");

    return data.sms;
  }

  async cancelVerification(): Promise<void> {
    const response = await this.http.put<VerificationResponse>(
      `/Verifications/${this.verificationId}/Cancel`
    );
    const { data } = response;

    if (response.status > 200) throw new Error("Textverified: could not cancel verification");

    if (!(data.status == Status.CANCELLED))
      throw new Error("Textverified: could not cancel verification");

    return;
  }

  async getBalance(): Promise<number> {
    const response = await this.http.get<{ username: string; credit_balance: number }>("Users");
    const { data } = response;

    if (response.status > 200) throw new Error("Textverified: could not get account details");

    return data.credit_balance;
  }
}
