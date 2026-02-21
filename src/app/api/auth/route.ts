import { UserRequestBody } from "@/commons/models/user";
import { signUpUserApi } from "../../../back/account/auth.api";

export async function POST(request: Request) {
  try {
    const body: UserRequestBody = await request.json();
    
    const result = await signUpUserApi(body);
    return Response.json(result, { status: result?.status ?? 500 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
    return Response.json({
      status: 500,
      message: "Erro interno no servidor.",
      data: null,
      error: errorMessage
    }, { status: 500 });
  }
}