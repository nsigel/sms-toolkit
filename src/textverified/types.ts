export enum Status {
  PENDING = "Pending",
  COMPLETED = "Completed",
  REPORTED = "Reported",
  CANCELLED = "Cancelled",
}

export type VerificationResponse = {
  id: string | null;
  cost: number;
  target_name: string | null;
  number: string | null;
  time_remaining: string | null;
  reuse_window: string | null;
  status: Status;
  sms: string | null;
  code: string | null;
  verification_uri: string | null;
  cancel_uri: string | null;
  report_uri: string | null;
  reuse_uri: string | null;
};
