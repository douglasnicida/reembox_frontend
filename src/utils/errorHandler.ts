import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

type MyError = {
  message: string;
};

export function errorHandler(err: AxiosError<MyError>) {

  const errorMessage =
    (err.response?.data?.message as string) || 
    err.message || 
    "Ocorreu um erro inesperado.";

  toast({
    description: errorMessage,
    variant: "destructive",
  });

  if(err.status == 401) { 
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }
}