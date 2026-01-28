import { redirect } from "next/navigation";

type SearchParams = { [key: string]: string | string[] | undefined };

interface AuthActionAliasPageProps {
  searchParams: SearchParams;
}

export default function AuthActionAliasPage({ searchParams }: AuthActionAliasPageProps) {
  const rawLang = searchParams.lang;

  const lang =
    typeof rawLang === "string"
      ? rawLang
      : Array.isArray(rawLang) && rawLang.length > 0
      ? rawLang[0]
      : undefined;

  const locale = lang === "en" ? "en" : "es";

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      for (const v of value) {
        params.append(key, v);
      }
    }
  }

  const queryString = params.toString();
  const target = `/${locale}/auth-action${queryString ? `?${queryString}` : ""}`;

  redirect(target);
}

