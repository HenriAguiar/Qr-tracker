import { NextRequest, NextResponse } from "next/server";

// Define as rotas públicas e quando o usuário autenticado deve ser redirecionado
const publicRoutes = [
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/login", whenAuthenticated: "redirect" },
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Obtém o token do cookie (se existir)
  const currentPath = req.nextUrl.pathname; // Obtém o caminho da URL atual

  // Verifica se a rota atual está na lista de rotas públicas
  const matchedRoute = publicRoutes.find((route) => route.path === currentPath);

  if (matchedRoute) {
    // Se a rota pública tem `whenAuthenticated: "redirect"` e o usuário está logado
    if (matchedRoute.whenAuthenticated === "redirect" && token) {
      return NextResponse.redirect(new URL("/", req.url)); // Redireciona para a página inicial, como o dashboard
    }
    return NextResponse.next(); // Permite o acesso à rota pública
  }

  // Se não for uma rota pública e o usuário não está autenticado, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Permite a requisição normalmente para rotas privadas
}

// Configuração do middleware para **evitar execuções desnecessárias**
export const config = {
  matcher: [
    // Monitorando todos os caminhos, exceto os que começam com:
    // - api (rotas da API)
    // - _next/static (arquivos estáticos)
    // - _next/image (arquivos de otimização de imagem)
    // - favicon.ico, sitemap.xml, robots.txt (arquivos de metadados)
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
