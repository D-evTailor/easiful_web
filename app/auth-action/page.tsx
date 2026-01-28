import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

interface AuthActionAliasPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function AuthActionAliasPage({ searchParams }: AuthActionAliasPageProps) {
  const sp = await searchParams;

  const rawLang = sp.lang;

  const lang =
    typeof rawLang === "string"
      ? rawLang
      : Array.isArray(rawLang) && rawLang.length > 0
      ? rawLang[0]
      : undefined;

  const locale = lang === "en" ? "en" : "es";

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(sp)) {
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
