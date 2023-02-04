import axios, { AxiosInstance } from "axios";

export default abstract class VerificationClient {
	protected http: AxiosInstance = axios.create({ validateStatus: null });
	public phoneNumber: string | undefined;

	constructor(protected apiKey: string, protected service: string) {}

	protected abstract authenticate(): void;
	abstract getBalance(): Promise<number>;
	abstract startVerification(): Promise<void>;
	abstract claimVerification(): Promise<string[]>;
	abstract cancelVerification(): Promise<void>;
}
