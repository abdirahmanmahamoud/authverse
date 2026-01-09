import nodemailer, { Transporter } from "nodemailer";
import { ReactElement } from "react";
import { render } from "@react-email/render";

export const sendEmail = async ({
  email,
  components,
  subject,
}: {
  email: string;
  components: ReactElement;
  subject: string;
}) => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: Number(process.env.GMAIL_PORT || 587),
    service: process.env.GMAIL_SERVICE,
    auth: {
      user: process.env.GMAIL_MAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const html = await render(components);

  return await transporter.sendMail({
    from: `"${process.env.GMAIL_NAME}" <${process.env.GMAIL_MAIL}>`,
    to: email,
    subject,
    html,
  });
};
