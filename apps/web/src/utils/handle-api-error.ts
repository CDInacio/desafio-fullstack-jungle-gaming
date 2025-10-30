import { AxiosError } from "axios";

export function handleApiError(
  error: unknown,
  defaultMessage = "Ocorreu um erro"
) {
  if (error instanceof AxiosError) {
    return new Error(error.response?.data?.message || defaultMessage);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(defaultMessage);
}
