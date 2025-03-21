"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para navegação
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Signup1Props {
  heading?: string;
  subheading?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  signupText?: string;
  googleText?: string;
  loginText?: string;
  loginUrl?: string;
}

const Signup1 = ({
  heading = "Signup",
  subheading = "Create a new account",
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
    title: "shadcnblocks.com",
  },
  googleText = "Sign up with Google",
  signupText = "Create an account",
  loginText = "Already have an account?",
  loginUrl = "/login",
}: Signup1Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Para armazenar mensagens de erro
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Para mensagens de sucesso
  const router = useRouter(); // Para navegação para a página de login

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost/api/user/register", // Ajuste aqui a URL do backend
        userData
      );

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage("Usuário criado com sucesso!"); // Definir a mensagem de sucesso
        setError(null); // Limpar qualquer erro anterior
        // Redirecionar para a página de login após 2 segundos
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      setError("Erro ao criar o usuário, tente novamente."); // Exibir mensagem de erro
      setSuccessMessage(null); // Limpar qualquer mensagem de sucesso
    }
  };

  return (
    <section className="h-screen bg-muted">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border border-muted bg-white px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <a href={logo.url}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-12"
                />
              </a>
            </div>
            <h1 className="text-3xl font-semibold">{heading}</h1>
            {subheading && (
              <p className="text-sm text-muted-foreground">{subheading}</p>
            )}
          </div>
          <div className="flex w-full flex-col gap-8">
            <form onSubmit={handleSignup}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Button type="submit" className="mt-2 w-full">
                    {signupText}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Exibir mensagens de erro ou sucesso */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm mt-4">{successMessage}</p>
          )}

          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{loginText}</p>
            <a
              href={loginUrl}
              className="font-medium text-primary hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup1 };
