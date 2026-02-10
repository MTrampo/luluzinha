'use server'

import { api } from "@/commons/lib/http/api";
import { UserSignUpFormInputs } from "@/commons/models/user";

export const signUpUserAction = async (input: UserSignUpFormInputs) => {
  const response = await api('/api/auth', {
    method: 'POST',
    body: input,
  });

  return response;
}