const nodemailer = require("nodemailer");

// Create nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for port 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Adding connection timeouts to prevent hanging indefinitely (e.g., in cloud environments like Render)
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

/**
 * Sends an OTP email to the user with a beautiful HTML template.
 * @param {string} email - Recipient email address
 * @param {string} otp - The OTP code
 */
const sendOtpEmail = async (email, otp) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f6f9fc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f6f9fc;
      padding: 40px 0;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      border: 1px solid #eef2f6;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
      color: #334155;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 24px 0;
      font-size: 16px;
    }
    .otp-container {
      background-color: #f8fafc;
      border: 2px dashed #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 6px;
      color: #4f46e5;
      margin: 0;
    }
    .expiry {
      font-size: 13px;
      color: #64748b;
      margin-top: 10px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #f1f5f9;
    }
    .footer p {
      margin: 0;
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>RapidTaskar</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>Use the verification code below to complete your login or registration. This code is valid for 5 minutes.</p>
        <div class="otp-container">
          <div class="otp-code">${otp}</div>
          <div class="expiry">Expires in 5 minutes</div>
        </div>
        <p>If you did not request this verification code, please ignore this email or contact support if you have concerns.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} RapidTaskar. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || "RapidTaskar"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `Your Verification Code: ${otp}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOtpEmail,
};
