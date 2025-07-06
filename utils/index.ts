//@ts-nocheck

export function detectBrowserLanguage() {
  if (import.meta.server) {
    const headers = useRequestHeaders();
    const lang = headers["accept-language"] || "";
    return lang.includes("zh");
  }

  const lang = navigator.language || "en";
  return lang.includes("zh");
}
