import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/env.js";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const sendEmail = async ({ to, subject, body }) => {
  if (!resend) {
    throw new Error("Resend API key is not configured");
  }

  const { data, error } = await resend.emails.send({
    from: "StartWise AI <onboarding@resend.dev>",
    to: [to],
    subject: subject,
    text: body,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
