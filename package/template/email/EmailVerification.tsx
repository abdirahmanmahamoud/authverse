import * as React from "react";
import {
  Body,
  Button,
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

export const EmailVerification = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        Please verify your email address to complete your registration
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[16px]">
                Verify Your Email Address
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Welcome! Please confirm your email address to get started.
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-800 m-0 mb-[16px]">
                Hi {name},
              </Text>
              <Text className="text-[16px] text-gray-800 m-0 mb-[24px]">
                Thank you for signing up! To complete your registration and
                secure your account, please verify your email address by
                clicking the button below.
              </Text>

              {/* Verification Button */}
              <Section className="text-center mb-[24px]">
                <Button
                  href={url}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border"
                >
                  Verify Email Address
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="text-[14px] text-gray-600 m-0 mb-[16px]">
                If the button above doesn't work, you can also copy and paste
                this link into your browser:
              </Text>
              <Text className="text-[14px] m-0 mb-[24px]">
                <Link href={url} className="text-blue-600 underline break-all">
                  {url}
                </Link>
              </Text>

              <Text className="text-[14px] text-gray-600 m-0 mb-[16px]">
                This verification link will expire in 24 hours for security
                purposes.
              </Text>

              <Text className="text-[14px] text-gray-600 m-0">
                If you didn't create an account, you can safely ignore this
                email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-gray-200 pt-[24px]">
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

export default EmailVerification;
