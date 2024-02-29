"use client";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Suspense } from "react"

export default function Home() {
  const [loadingTime, setLoadingTime] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState(searchParams.get("lang") || null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    if (lang != null) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${lang}`
      );
      const jsonData = await response.json();
      setNews(jsonData);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [lang]);

  return (
    <main className="container mx-auto py-4">
      {/* Display title and subtitle only when lang is absent */}
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
                router.push(pathname ?? + "?lang=en", { scroll: false });
                setLang("en");
                fetchNews();
              }}
            >
              Inglês
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                router.push(pathname ?? + "?lang=pt", { scroll: false });
                setLang("pt");
                fetchNews();
              }}
            >
              Português
            </button>
          </div>
        </div>
      )}

      {lang && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Info</h1>
          {news.length === 0 && loadingTime < 5 && <p>Carregando...</p>}
          {news.length === 0 && loadingTime >= 5 && loadingTime < 10 && (
            <p>Carregando. Aguarde mais alguns instantes.</p>
          )}
          {news.length === 0 && loadingTime >= 10 && (
            <p>
              O carregamento está demorando mais do que o esperado. Verifique
              sua conexão.
            </p>
          )}
          {news.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item) => (
                <article
                  key={item['title']}
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <h2 className="text-xl font-bold">{item['title']}</h2>
                  <p className="text-gray-700">{item['content']}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{item['author']}</span> -{" "}
                    <span className="text-gray-600">{item['date']}</span>
                    <a
                      href={item['link']}
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
