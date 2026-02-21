import { useForm } from "@tanstack/react-form";
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
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.string().email(),
});

const ForgetComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: "/auth/reset-password",
        },
        {
          onSuccess: () => {
            toast.success(
              "Password reset email sent. Please check your inbox."
            );
          },
          onError: (error: any) => {
            setIsLoading(false);
            toast.error(error.error.message);
          },
        }
      );
    },
  });

  return (
    <Card className="w-full sm:max-w-md shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl leading-4">Forger Password</CardTitle>
        <CardDescription>Please enter your email</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-login"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="example@example.com"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
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
            <Link to="/auth/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgetComponent;
