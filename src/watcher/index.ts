import { VerificationClient } from "../base";
import { tryRetry } from "../util/helpers";

export class Watcher {
  constructor(
    private client: VerificationClient,
    private matcher: (message: string) => boolean = () => true,
    private interval: number = 2500
  ) {}

  async waitForVerification(): Promise<string> {
    tryRetry(
      async () => {
        const sms = await this.client.claimVerification();

        if (sms.length > 0) {
          return sms.filter((message) => this.matcher(message));
        }
      },
      { delay: this.interval }
    );

    // This should never trigger as the tryRetry will catch all errors
    throw new Error("There was a problem waiting for verification.");
  }
}
