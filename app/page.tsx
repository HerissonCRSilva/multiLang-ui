// Habilita recursos do lado do cliente (client-side)
"use client";

// Importa o componente Image para renderizar imagens
import Image from "next/image";

// Importa funções de navegação do Next.js
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Importa funções useState e useEffect do React
import { useState, useEffect } from "react";

// Importa o componente Suspense para lidar com conteúdo em carregamento
import { Suspense } from "react";

export default function Home() {
  // Define o estado para o tempo de carregamento (em segundos)
  const [loadingTime, setLoadingTime] = useState(0);

  // Obtém uma instância do objeto de roteamento do Next.js
  const router = useRouter();

  // Obtém o caminho atual da página
  const pathname = usePathname();

  // Obtém os parâmetros de pesquisa da URL
  const searchParams = useSearchParams();

  // Define o estado para o idioma (vem da pesquisa ou nulo)
  const [lang, setLang] = useState(searchParams.get("lang") || null);

  // Define o estado para as notícias (inicialmente vazia)
  const [news, setNews] = useState([]);

  // Efeito colateral para atualizar o tempo de carregamento a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime((prevTime) => prevTime + 1);
    }, 1000);

    // Efetua limpeza do intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  // Função assíncrona para buscar notícias
  const fetchNews = async () => {
    if (lang != null) {
      // Monta a URL da API com base no idioma
      const url = `<span class="math-inline">\{process\.env\.NEXT\_PUBLIC\_API\_URL\}/</span>{lang}`;

      // Realiza a requisição à API
      const response = await fetch(url);

      // Converte a resposta para JSON
      const jsonData = await response.json();

      // Atualiza o estado das notícias com os dados obtidos
      setNews(jsonData);
    }
  };

  // Efeito colateral para buscar notícias sempre que o idioma muda
  useEffect(() => {
    fetchNews();
  }, [lang]);

  return (
    <main className="container mx-auto py-4">
      {/* Exibe tela de seleção de idioma se o idioma ainda não estiver definido */}
      {!lang && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao nosso site!</h1>
          <h3 className="text-xl font-bold mb-4">
            Escolha um idioma para prosseguir:
          </h3>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                // Adiciona o parâmetro "lang=en" à URL e atualiza o estado
                router.push(pathname ?? "?lang=en", { scroll: false });
                setLang("en");
                fetchNews();
              }}
            >
              Inglês
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                // Adiciona o parâmetro "lang=pt" à URL e atualiza o estado
                router.push(pathname ?? "?lang=pt", { scroll: false });
                setLang("pt");
                fetchNews();
              }}
            >
              Português
            </button>
          </div>
        </div>
      )}

      {/* Exibe conteúdo principal se o idioma estiver definido */}
      {lang && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Informações</h1>
          {/* Exibe mensagem de carregamento enquanto as notícias não são carregadas */}
          {news.length === 0 && loadingTime < 5 && <p>Carregando...</p>}
          {news.length === 0 && loadingTime >= 5 && loadingTime < 10 && (
            <p>
              O carregamento está demorando mais do que o esperado. Verifique
              sua conexão.
            </p>
          )}

          {news.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item) => (
                <article
                  key={item["title"]}
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <h2 className="text-xl font-bold">{item["title"]}</h2>
                  <p className="text-gray-700">{item["content"]}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{item["author"]}</span> -{" "}
                    <span className="text-gray-600">{item["date"]}</span>
                    <a
                      href={item["link"]}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Link
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
