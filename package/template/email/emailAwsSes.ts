import nodemailer from "nodemailer";
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
  const transporter = nodemailer.createTransport({
    host: process.env.AWS_SES_HOST,
    port: Number(process.env.AWS_SES_PORT),
    service: process.env.AWS_SES_SERVICE,
    auth: {
      user: process.env.AWS_SES_USER,
      pass: process.env.AWS_SES_PASS,
    },
  });

  const html = await render(components);

  return await transporter.sendMail({
    from: process.env.AWS_SES_FROM,
    to: email,
    subject,
    html,
  });
};
