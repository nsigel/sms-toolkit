import VerificationClient from "../base";
import { tryRetry } from "../util/helpers";

export default class Watcher {
  constructor(
    private client: VerificationClient,
    private matcher: (message: string) => boolean = () => true,
    private interval: number = 2500
  ) {}

  async waitForVerification() {
    tryRetry(
      async () => {
        const sms = await this.client.claimVerification();

        if (sms.length > 0) {
          return sms.filter((message) => this.matcher(message));
        }
      },
      { delay: this.interval }
    );
  }
}
