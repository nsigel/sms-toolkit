import VerificationClient from "../base";
import { ClaimResponse, AccountResponse, TruverifiError, TruverifiSmsEntity } from "./types";

function truverifiErrorMessage(message: string) {
  switch (message) {
    case "INVALID_API_KEY":
      return "Truverifi: Invalid API key";
    case "NOT_AVAILABLE_FOR_THIS_ACCOUNT":
      return "Truverifi: Your account doesn't have access to a phone line";
    case "NO_LINE_ASSIGNED":
      return "Truverifi: No phone line found ";
    default:
      return "Truverifi: " + message;
  }
}

export default class Truverifi extends VerificationClient {
  constructor(apiKey: string, service: string) {
    super(apiKey, service);
    this.http.defaults.baseURL = "https://app.truverifi.com/api/";

    this.authenticate();
  }

  protected async authenticate(): Promise<void> {
    this.http.defaults.headers["X-API-Key"] = this.apiKey;

    await this.getAccountInfo();
  }

  async startVerification(): Promise<void> {
    const { data } = await this.http.post<{ phoneNumber: string } | TruverifiError>(
      "/line/changeService",
      {
        services: [this.service],
      }
    );

    if ("error" in data) throw new Error(truverifiErrorMessage(data.error));

    this.phoneNumber = data.phoneNumber;

    return;
  }

  async claimVerification(): Promise<string[]> {
    const { data } = await this.http.get<ClaimResponse | TruverifiError>("line");

    if ("error" in data) throw new Error(truverifiErrorMessage(data.error));

    if (data.sms.length == 0) throw new Error(truverifiErrorMessage("No SMS found for this line"));

    return data.sms.map((message) => message.text);
  }

  async cancelVerification(): Promise<void> {
    // Truverifi does not support cancelling verification
    return;
  }

  async getAccountInfo(): Promise<AccountResponse> {
    const { data } = await this.http.get<AccountResponse | TruverifiError>("/account");

    if ("error" in data) throw new Error(truverifiErrorMessage(data.error));

    return data;
  }

  async getBalance(): Promise<number> {
    const data = await this.getAccountInfo();
    return data.balance;
  }
}
