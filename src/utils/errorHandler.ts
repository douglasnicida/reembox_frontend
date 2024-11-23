import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

type MyError = {
  message: string;
};

export function errorHandler(err: AxiosError<MyError>) {
  let errorMessage: string;

  if(err.status == 401) { 
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  if (Array.isArray(err.response?.data)) {
    errorMessage = err.response.data.join('\n') 
  } else {
    errorMessage = 
      (err.response?.data?.message as string) || 
      "Ocorreu um erro inesperado.";
  }

  toast({
    description: errorMessage,
    variant: "destructive",
  });
}