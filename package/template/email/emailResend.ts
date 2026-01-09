import { Resend } from "resend";
import type { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendEmail = async ({
  email,
  components,
  subject,
}: {
  email: string;
  components: ReactElement;
  subject: string;
}) => {
  return await resend.emails.send({
    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to: email,
    subject,
    react: components,
  });
};
