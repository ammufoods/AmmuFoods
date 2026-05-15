const { Resend } = require("resend");

// Resend uses HTTPS (port 443) — works on Render free tier
// Nodemailer SMTP (port 587/465) is blocked by Render free tier
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email via Resend API
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
const sendMail = async ({ to, subject, html }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping email");
      return false;
    }

    const { error } = await resend.emails.send({
      from: "Ammu Foods <onboarding@resend.dev>", // Use verified domain later
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    console.log("✅ Email sent to:", to);
    return true;
  } catch (err) {
    console.error("Email sending failed:", err.message);
    return false;
  }
};

module.exports = { sendMail };
