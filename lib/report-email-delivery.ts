import type { ReportSnapshot } from "@/lib/report-request-email";
import { renderReportEmail } from "@/lib/report-request-email";

export type ResendEmailResult = {
  data: { id: string } | null;
  error: { message: string; statusCode?: number | null; name?: string } | null;
};

export type ResendEmailClient = {
  emails: {
    send(payload: {
      from: string;
      to: string[];
      subject: string;
      text: string;
      html: string;
      replyTo?: string;
    }): Promise<ResendEmailResult>;
  };
};

export type ReportEmailDeliveryResult =
  | { status: "skipped"; emailError: string; resendEmailId: null }
  | { status: "failed"; emailError: string; resendEmailId: null }
  | { status: "sent"; emailError: null; resendEmailId: string };

const SAFE_FAILURE_MESSAGE = "Email delivery failed.";
const SAFE_SKIPPED_MESSAGE = "Resend not configured";

export async function deliverReportEmail({
  resendClient,
  from,
  replyTo,
  to,
  firstName,
  calculatorName,
  pagePath,
  resultSnapshot,
}: {
  resendClient: ResendEmailClient | null | undefined;
  from?: string | null;
  replyTo?: string | null;
  to: string;
  firstName?: string;
  calculatorName: string;
  pagePath: string;
  resultSnapshot?: ReportSnapshot;
}): Promise<ReportEmailDeliveryResult> {
  if (!resendClient || !from) {
    return { status: "skipped", emailError: SAFE_SKIPPED_MESSAGE, resendEmailId: null };
  }

  const { text, html } = renderReportEmail({
    firstName,
    calculatorName,
    pagePath,
    resultSnapshot,
  });

  const response = await resendClient.emails.send({
    from,
    to: [to],
    subject: "Your BuzzPay contractor finance report",
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (response.error || !response.data?.id) {
    return { status: "failed", emailError: SAFE_FAILURE_MESSAGE, resendEmailId: null };
  }

  return { status: "sent", emailError: null, resendEmailId: response.data.id };
}
