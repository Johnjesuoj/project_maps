// Transactional email (PRD.md Phase 5). Resend when RESEND_API_KEY is set,
// console-log fallback locally. Templates: receipts/approvals/reminders.

export type EmailTemplate =
  | { kind: "claim-approved"; locationName: string }
  | { kind: "correction-decided"; locationName: string; decision: string }
  | { kind: "alert-reported"; summary: string };

function render(t: EmailTemplate): { subject: string; text: string } {
  switch (t.kind) {
    case "claim-approved":
      return {
        subject: `Claim approved: ${t.locationName}`,
        text: `Your claim for "${t.locationName}" was approved. The location is now owner-verified.`,
      };
    case "correction-decided":
      return {
        subject: `Correction ${t.decision}: ${t.locationName}`,
        text: `A reported correction for "${t.locationName}" was ${t.decision}.`,
      };
    case "alert-reported":
      return {
        subject: `Road alert: ${t.summary}`,
        text: `New road alert reported: ${t.summary}`,
      };
  }
}

export async function sendEmail(to: string, template: EmailTemplate): Promise<void> {
  const { subject, text } = render(template);
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Project Maps <noreply@localhost>";
  if (!apiKey) {
    console.log(`[email:log-fallback] to=${to} subject=${JSON.stringify(subject)} text=${JSON.stringify(text)}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) {
    console.log(`[email:resend-failed] status=${res.status} to=${to} subject=${JSON.stringify(subject)}`);
  }
}
