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
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });
      if (error) {
        toast.error(error.message);
      }
      if (data) {
        toast.success("Password has been reset successfully.");
        router.push("/auth/login");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full sm:max-w-md shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl leading-4">Reset Password</CardTitle>
        <CardDescription>Please enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-login-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    type="password"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-confirm-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-login-confirm-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    type="password"
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResetComponent;
