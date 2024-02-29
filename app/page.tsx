"use client";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState(searchParams.get("lang") || null);
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${lang}`);
    const jsonData = await response.json();
    setNews(jsonData);
  };

  useEffect(() => {
    fetchNews();
  }, [lang]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {lang ? (
        <div>
          <h1>Notícias</h1>
          {news.map((item) => (
            <article key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.content}</p>
              <span>{item.author}</span> - <span>{item.date}</span>
              <a href={item.link}>Leia mais...</a>
            </article>
          ))}
        </div>
      ) : (
        <div>
          <h3>Escolha um idioma:</h3>
          <button
            onClick={() =>
              router.push(pathname + "?lang=en", { scroll: false })
            }
          >
            Inglês
          </button>
          <button onClick={() => router.push(pathname + "?lang=pt")}>
            Português
          </button>
        </div>
      )}
    </main>
  );
}
