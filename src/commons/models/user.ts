import z from "zod"
import { forgotPasswordFormSchema, userSignInFormSchema, userSignUpFormSchema } from "../validations/user"

export interface UserRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface Profile {
  id: string;
  name: string;
  avatrUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserSignUpFormInputs = z.infer<typeof userSignUpFormSchema>
export type UserSignInFormInputs = z.infer<typeof userSignInFormSchema>
export type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordFormSchema>