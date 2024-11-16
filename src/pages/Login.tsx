import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { LoginType } from "@/types/auth.type";
import { FormEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  function handleLoginButton(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const email = emailRef.current ? emailRef.current.value : '';
    const password = passwordRef.current ? passwordRef.current.value : '';

    const credentials: LoginType = {
      email,
      password
    }

    login(credentials)
  }

  useEffect(() => {
    if (localStorage.getItem('access_token') && localStorage.getItem('user')) {
      navigate('/home')
    }
  }, [navigate])

    return (
      <form className="min-h-screen flex flex-col items-center justify-center p-4 bg-black w-full" onSubmit={(e) => {handleLoginButton(e)}}>
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              <span className="text-red-400">Reembox</span>
            </CardTitle>
            <p className="text-sm text-zinc-400">
              Insira seu email para acessar sua conta
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">E-mail</Label>
              <Input 
                id="email" 
                type="email"
                ref={emailRef}
                placeholder="seu-email@email.com" 
                required 
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">Senha</Label>
              <Input 
                id="password" 
                type="password"
                ref={passwordRef}
                placeholder="********"
                required 
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-red-400 hover:bg-red-500 text-white" type="submit">Entrar</Button>
          </CardFooter>
        </Card>
      </form>
    )
  }