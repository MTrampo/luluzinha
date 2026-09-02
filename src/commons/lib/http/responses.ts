import { HttpStatusEnum } from "@/commons/enums/http";
import { ResponseInput, ResponseProps } from "@/commons/models/api";

export const ApiResponse = {
  Ok: <T>(input: ResponseInput<T>): ResponseProps<T> => ({
    status: HttpStatusEnum.Ok,
    message: input.message || "Operação realizada com sucesso",
    data: input.data as T,
    error: input.error
  }),

  Created: <T>(input: ResponseInput<T>): ResponseProps<T> => ({
    status: HttpStatusEnum.Created,
    message: input.message,
    data: input.data as T,
  }),

  BadRequest: (input: ResponseInput<null>): ResponseProps<null> => ({
    status: HttpStatusEnum.BadRequest,
    message: input.message,
    data: null,
    error: input.error
  }),

  Unauthorized: (input: ResponseInput<null>): ResponseProps<null> => ({
    status: HttpStatusEnum.Unauthorized,
    message: input.message,
    data: null,
    error: input.error
  }),

  NotFound: (input: ResponseInput<null>): ResponseProps<null> => ({
    status: HttpStatusEnum.NotFound,
    message: input.message,
    data: null,
    error: input.error
  }),

  Conflict: (input: ResponseInput<null>): ResponseProps<null> => ({
    status: HttpStatusEnum.Conflict,
    message: input.message,
    data: null,
    error: input.error
  }),

  InternalError: (input: ResponseInput<null>): ResponseProps<null> => ({
    status: HttpStatusEnum.InternalServerError,
    message: input.message || "Erro interno no servidor",
    data: null,
    error: input.error
  }),
};