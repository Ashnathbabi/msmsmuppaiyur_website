const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  console.log("========== EMAIL DEBUG ==========");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
  console.log("=================================");

  const info = await transporter.sendMail({
    from: `"MSMS Muppaiyur" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `New Contact Message: ${subject}`,

    html: `
      <h2>New Contact Message</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>

      <hr />

      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  console.log("✅ EMAIL SENT");
  console.log("Message ID:", info.messageId);
  console.log("Response:", info.response);

  return info;
};

module.exports = sendContactEmail;
