import dotenv from "dotenv";

import { RegisterTemplate } from "../Template/Register.template.js";
import { ResetPasswordTemplate } from "../Template/ResetPassword.template.js";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const MailWelcome = async (email, name, otpCode) => {
  try {
    const htmlContent = RegisterTemplate.replace("{username}", name).replace(
      "{Verifycode}",
      otpCode,
    );

    const info = await resend.emails.send({
      from: "Trackit Team <no-reply@musdar.com>", // Use test email for now or configured domain
      to: email,
      subject: "Welcome to Trackit!",
      html: htmlContent,
    });

    if (info.error) {
      console.error("Resend API Rejected the Email:", info.error.message);
      throw new Error(info.error.message);
    }

    console.log("Welcome Email sent successfully: %s", info.data?.id);
    return info;
  } catch (error) {
    console.log("Error sending welcome email:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

export const MailResetPassword = async (email, name, resetCode) => {
  try {
    const htmlContent = ResetPasswordTemplate
      .replace("{username}", name)
      .replace("{resetCode}", resetCode);

    const info = await resend.emails.send({
      from: "Trackit Team <no-reply@musdar.com>",
      to: email,
      subject: "Reset Your Trackit Password",
      html: htmlContent,
    });

    if (info.error) {
      console.error("Resend API Rejected the Email:", info.error.message);
      throw new Error(info.error.message);
    }

    console.log("Reset Password Email sent successfully: %s", info.data?.id);
    return info;
  } catch (error) {
    console.log("Error sending reset password email:", error);
    throw error;
  }
};
