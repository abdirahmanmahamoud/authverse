import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

export const OtpVerification = ({
  otp,
  type = "sign-in",
}: {
  otp: string;
  type?: "sign-in" | "email-verification" | "forget-password";
}) => {
  const heading =
    type === "sign-in"
      ? "Sign in to your account"
      : type === "email-verification"
        ? "Verify your email address"
        : "Reset your password";

  const description =
    type === "sign-in"
      ? "Enter the code below to finish signing in."
      : type === "email-verification"
        ? "Enter the code below to confirm your email address."
        : "Enter the code below to reset your password.";

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        Your one-time passcode is {otp} - use it to complete your request.
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
            <Section className="text-center mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[16px]">
                {heading}
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                {description}
              </Text>
            </Section>

            <Section className="mb-[32px] text-center">
              <Text className="text-[36px] font-bold text-blue-600 tracking-[8px] m-0 mb-[24px]">
                {otp}
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 mb-[16px]">
                This code will expire in 5 minutes for security reasons. Do not
                share it with anyone.
              </Text>
            </Section>

            <Section className="border-t border-solid border-gray-200 pt-[24px]">
              <Text className="text-[14px] text-gray-600 m-0 mb-[16px]">
                If you didn't request this code, you can safely ignore this
                email.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                Best regards,
                <br />
                The Support Team
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                123 Business Street, Suite 100
                <br />
                City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mt-[16px]">
                <Link href="#" className="text-gray-500 underline">
                  Unsubscribe
                </Link>{" "}
                | © 2026 Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OtpVerification;
