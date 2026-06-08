import "server-only";

import { Resend } from "resend";

let resendClient: Resend | null | undefined;

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.REPORT_FROM_EMAIL);
}

export function getResendServerClient() {
  if (resendClient !== undefined) return resendClient;

  if (!process.env.RESEND_API_KEY) {
    resendClient = null;
    return resendClient;
  }

  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}
