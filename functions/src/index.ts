import * as functions from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Resend } from "resend";

admin.initializeApp();

// Receiver email
const TO_EMAIL = "mehdiichabab@gmail.com";

// Sender email (must be allowed/verified in Resend)
// For testing, onboarding@resend.dev usually works.
const FROM_EMAIL = "WAHIBASHOP <onboarding@resend.dev>";

// Read API key from Firebase Functions config (Spark plan compatible)
const getResendKey = () => {
  const key = functions.config()?.resend?.key;
  if (!key) {
    throw new Error(
      "Missing Resend API key. Set it with: firebase functions:config:set resend.key=\"re_...\""
    );
  }
  return key as string;
};

// Ensure undefined becomes null (Firestore email rendering + safety)
function cleanJson(obj: any) {
  return JSON.stringify(obj, (_k, v) => (v === undefined ? null : v), 2);
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const emailNewOrder = onDocumentCreated(
  {
    document: "orders/{orderId}",
    region: "europe-west1",
  },
  async (event) => {
    const orderId = event.params.orderId;
    const order = event.data?.data();

    if (!order) return;

    const resend = new Resend(getResendKey());

    const json = cleanJson(order);
    const jsonEscaped = escapeHtml(json);

    const customerName = order.customer?.name ?? "";
    const customerPhone = order.customer?.phone ?? "";
    const customerEmail = order.customer?.email ?? "";
    const total = order.total ?? "";
    const date = order.date ?? "";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `🛒 WAHIBASHOP – New Order ${orderId}`,
      text: `New order ${orderId}\n\n${json}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5;">
          <h2 style="margin:0 0 8px;">New Order Received ✅</h2>
          <p style="margin:0 0 12px;">
            <b>Order ID:</b> ${escapeHtml(String(orderId))}<br/>
            <b>Date:</b> ${escapeHtml(String(date))}<br/>
            <b>Total:</b> ${escapeHtml(String(total))}
          </p>

          <h3 style="margin:16px 0 6px;">Customer</h3>
          <p style="margin:0 0 12px;">
            ${escapeHtml(String(customerName))}<br/>
            ${escapeHtml(String(customerPhone))}<br/>
            ${escapeHtml(String(customerEmail))}
          </p>

          <h3 style="margin:16px 0 6px;">Raw Order Data</h3>
          <pre style="background:#f6f6f6;padding:12px;border-radius:8px;white-space:pre-wrap;">${jsonEscaped}</pre>
        </div>
      `,
    });

    return;
  }
);
