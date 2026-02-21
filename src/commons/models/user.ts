import z from "zod"
import { sendEmailFormSchema, otpVerificationSchema, userSignInFormSchema, userSignUpFormSchema, forgotPasswordFormSchema } from "../validations/user"

export interface UserRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequestBody extends Omit<UserRequestBody, "name"> {
  code: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt?: string;
}

export type SignInRequestBody = Omit<UserRequestBody, "name">

export type UserSignUpFormInputs = z.infer<typeof userSignUpFormSchema>
export type UserSignInFormInputs = z.infer<typeof userSignInFormSchema>
export type SendEmailFormInputs = z.infer<typeof sendEmailFormSchema>
export type OtpFormInputs = z.infer<typeof otpVerificationSchema>
export type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordFormSchema>