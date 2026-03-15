import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // SSL/TLS on port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // cPanel self-signed certificate
  },
});

/** Replace all {{KEY}} placeholders in an HTML template string. */
function render(templateName, vars) {
  const filePath = join(__dirname, "emailTemplates", templateName);
  let html = readFileSync(filePath, "utf8");
  for (const [key, value] of Object.entries(vars)) {
    const normalizedValue = value ?? "";
    html = html.replaceAll(`{{${key}}}`, normalizedValue);
    html = html.replaceAll(`%%${key}%%`, normalizedValue);
  }
  return html;
}

/** Format a Date to French locale string. */
function formatDate(date = new Date()) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Base send function
 */
export async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"Maker DZ" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

/**
 * Password reset email
 * @param {string} email
 * @param {string} token
 * @param {string} [userName]
 */
export async function sendPasswordResetEmail(
  email,
  token,
  userName = "Client",
) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = render("passwordReset.html", {
    USER_NAME: userName,
    RESET_URL: resetUrl,
  });
  await sendEmail(
    email,
    "Réinitialisation de votre mot de passe – Maker DZ",
    html,
  );
}

/**
 * Email verification
 * @param {string} email
 * @param {string} token
 * @param {string} [userName]
 */
export async function sendVerificationEmail(email, token, userName = "Client") {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = render("emailVerification.html", {
    USER_NAME: userName,
    VERIFY_URL: verifyUrl,
  });
  await sendEmail(email, "Confirmez votre email – Maker DZ", html);
}

/**
 * Order confirmation email
 * @param {string} email
 * @param {Object} orderData
 * @param {string|number} orderData.orderId
 * @param {string} [orderData.userName]
 * @param {Date}   [orderData.orderDate]
 * @param {Array<{name:string, quantity:number, price:number}>} orderData.items
 * @param {number} orderData.total
 * @param {number} [orderData.shippingCost]
 * @param {string} [orderData.shippingAddress]
 */
export async function sendOrderConfirmation(email, orderData) {
  const {
    orderId,
    userName = "Client",
    orderDate,
    items = [],
    total,
    shippingCost = 0,
    shippingAddress = "",
  } = orderData;

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * (i.quantity || 1),
    0,
  );

  const itemsRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:12px 16px;color:#4a5568;font-size:14px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
          <td style="padding:12px 16px;color:#4a5568;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
          <td style="padding:12px 16px;color:#4a5568;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap;">${(item.price * (item.quantity || 1)).toLocaleString("fr-DZ")} DA</td>
        </tr>`,
    )
    .join("");

  const html = render("orderConfirmation.html", {
    USER_NAME: userName,
    ORDER_ID: orderId,
    ORDER_DATE: formatDate(orderDate),
    ITEMS_ROWS: itemsRows,
    SUBTOTAL: subtotal.toLocaleString("fr-DZ"),
    SHIPPING_COST:
      shippingCost === 0
        ? "Gratuit"
        : `${shippingCost.toLocaleString("fr-DZ")} DA`,
    TOTAL: total.toLocaleString("fr-DZ"),
    SHIPPING_ADDRESS: shippingAddress.replace(/\n/g, "<br/>"),
  });

  await sendEmail(
    email,
    `Confirmation de commande #${orderId} – Maker DZ`,
    html,
  );
}

// Status configuration for order status update emails
const STATUS_CONFIG = {
  pending: {
    label: "Commande reçue",
    badgeBg: "#f3f4f6",
    color: "#374151",
    message:
      "Votre commande a bien été reçue. Nous allons la traiter dans les plus brefs délais.",
    steps: [1, 0, 0, 0],
  },
  confirmed: {
    label: "Commande confirmée",
    badgeBg: "#eff6ff",
    color: "#1d4ed8",
    message:
      "Bonne nouvelle ! Votre commande a été confirmée et est en cours de préparation.",
    steps: [1, 1, 0, 0],
  },
  processing: {
    label: "En cours de préparation",
    badgeBg: "#fffbeb",
    color: "#b45309",
    message:
      "Votre commande est actuellement en cours de préparation par notre équipe.",
    steps: [1, 1, 0, 0],
  },
  shipped: {
    label: "Commande expédiée",
    badgeBg: "#f5f3ff",
    color: "#6d28d9",
    message:
      "Votre commande est en route ! Vous serez livré dans les prochains jours.",
    steps: [1, 1, 1, 0],
  },
  delivered: {
    label: "Commande livrée",
    badgeBg: "#ecfdf5",
    color: "#047857",
    message:
      "Votre commande a été livrée avec succès. Nous espérons que vous êtes satisfait de votre achat !",
    steps: [1, 1, 1, 1],
  },
  cancelled: {
    label: "Commande annulée",
    badgeBg: "#fef2f2",
    color: "#b91c1c",
    message:
      "Votre commande a été annulée. Si vous avez des questions, n'hésitez pas à nous contacter.",
    steps: [0, 0, 0, 0],
  },
};

function buildStatusBadge(cfg) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px;">
    <tr>
      <td style="background-color:${cfg.badgeBg};border-radius:999px;padding:8px 14px;">
        <span style="font-size:12px;line-height:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${cfg.color};">${cfg.label}</span>
      </td>
    </tr>
  </table>`;
}

function buildProgressRow(steps) {
  const done = "#06b291";
  const inactive = "#d1d5db";
  const labels = ["Confirmee", "Preparation", "Expedition", "Livraison"];
  const icons = ["1", "2", "3", "4"];

  const stepCells = steps
    .map((value, index) => {
      const isDone = value === 1;
      const labelColor = isDone ? done : "#9ca3af";
      const labelWeight = isDone ? "700" : "400";
      const circleColor = isDone ? done : inactive;
      const circleIcon = isDone ? "✓" : icons[index];

      const connector =
        index < steps.length - 1
          ? `<td width="8%" valign="middle"><div style="height:2px;background-color:${steps[index] === 1 && steps[index + 1] === 1 ? done : inactive};">&nbsp;</div></td>`
          : "";

      return `<td width="25%" align="center" valign="top">
        <table role="presentation" width="34" height="34" cellpadding="0" cellspacing="0" style="width:34px;height:34px;border-radius:17px;background-color:${circleColor};">
          <tr><td align="center" valign="middle" style="font-size:13px;line-height:13px;font-weight:700;color:#ffffff;">${circleIcon}</td></tr>
        </table>
        <p style="margin:8px 0 0 0;font-size:12px;line-height:18px;color:${labelColor};font-weight:${labelWeight};">${labels[index]}</p>
      </td>${connector}`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${stepCells}</tr></table>`;
}

/**
 * Order status update email
 * @param {string} email
 * @param {Object} data
 * @param {string|number} data.orderId
 * @param {string} [data.userName]
 * @param {string} data.status - pending|confirmed|processing|shipped|delivered|cancelled
 * @param {string} [data.trackingNumber]
 * @param {string} [data.trackingUrl]
 * @param {Date}   [data.updateDate]
 */
export async function sendOrderStatusUpdate(email, data) {
  const {
    orderId,
    userName = "Client",
    status = "pending",
    trackingNumber,
    trackingUrl,
    updateDate,
  } = data;

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  const trackingBlock = trackingNumber
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8ecf0;border-radius:8px;margin-bottom:28px;">
          <tr style="background-color:#f7f9fb;">
            <td style="padding:12px 16px;border-bottom:1px solid #e8ecf0;">
              <p style="margin:0;font-size:12px;font-weight:700;color:#718096;text-transform:uppercase;letter-spacing:0.5px;">Numero de suivi</p>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 16px;">
              ${
                trackingUrl
                  ? `<a href="${trackingUrl}" style="color:#d86f19;font-size:15px;font-weight:700;text-decoration:none;">${trackingNumber}</a>`
                  : `<span style="color:#023045;font-size:15px;font-weight:700;">${trackingNumber}</span>`
              }
            </td>
          </tr>
        </table>`
    : "";

  const html = render("orderStatusUpdate.html", {
    USER_NAME: userName,
    ORDER_ID: orderId,
    STATUS_LABEL: cfg.label,
    STATUS_MESSAGE: cfg.message,
    STATUS_BADGE_HTML: buildStatusBadge(cfg),
    STEPS_ROW_HTML: buildProgressRow(cfg.steps),
    UPDATE_DATE: formatDate(updateDate),
    ORDER_URL: `${process.env.FRONTEND_URL}/orders/${orderId}`,
    TRACKING_BLOCK: trackingBlock,
  });

  await sendEmail(
    email,
    `Mise à jour de votre commande #${orderId} – Maker DZ`,
    html,
  );
}
