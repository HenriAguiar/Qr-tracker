"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Login3Props {
  heading?: string;
  subheading?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
  };
  loginText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
}

const Login3 = ({
  heading = "Login",
  subheading = "Welcome back",
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
    alt: "Shadcnblocks",
  },
  loginText = "Log in",
  googleText = "Log in with Google",
  signupText = "Don't have an account?",
  signupUrl = "/register",
}: Login3Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost/api/auth/login",
        userData,
        { withCredentials: true }
      );

      // Check for both 200 and 201 status codes as success
      if (response.status === 200 || response.status === 201) {
        console.log("Login bem-sucedido", response.data);
        // Redirect to home page
        router.push("/home");
      }
    } catch (error: any) {
      setError("Credenciais inválidas ou erro ao fazer login. Tente novamente.");
      console.error("Erro ao fazer login", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col items-center">
              <a href={logo.url} className="mb-6 flex items-center gap-2">
                <img src={logo.src} className="max-h-8" alt={logo.alt} />
              </a>
              <h1 className="mb-2 text-2xl font-bold">{heading}</h1>
              <p className="text-muted-foreground">{subheading}</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <div>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : loginText}
                </Button>
              </div>
            </form>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>{signupText}</p>
              <a href={signupUrl} className="font-medium text-primary">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login3 };