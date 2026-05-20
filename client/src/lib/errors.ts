import axios from "axios";

export function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (axios.isAxiosError(error)) {
    const message = (
      error.response?.data as
        | { message?: string }
        | undefined
    )?.message;
    return message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
