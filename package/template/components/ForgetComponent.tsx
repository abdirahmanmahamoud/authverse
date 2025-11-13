"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email(),
});

const ForgetComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/auth/reset-password",
      });

      if (error) {
        toast.error(error.message);
      }
      if (data) {
        toast.success("Password reset email sent. Please check your inbox.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="w-full sm:max-w-md shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl leading-4">Forger Password</CardTitle>
        <CardDescription>Please enter your email</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-login-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="example@domain.com"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <Field orientation="horizontal">
            <Button
              type="submit"
              form="form-login"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </Field>
          <div className="w-full text-center pt-4 space-x-2">
            <span>Already have an account?</span>
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgetComponent;
