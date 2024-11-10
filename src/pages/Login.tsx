import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActiveItem } from "@/context/ActiveItemContext";
import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {

  const { setActiveItem } = useActiveItem()
  const navigate = useNavigate();

  function handleLoginButton(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActiveItem('Início');
    navigate('/home')
  }

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
                placeholder="********"
                required 
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-red-400 hover:bg-red-500 text-white">Entrar</Button>
            <div className="text-sm text-center text-zinc-400">
              Não possui uma conta?{' '}
              <Link to="/signup" className="text-red-400 underline hover:text-red-300">
                Cadastrar-se
              </Link>
            </div>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm text-zinc-400">
          <Link to="/reset-password" className="hover:underline text-red-400">
            Esqueceu sua senha?
          </Link>
        </div>
      </form>
    )
  }