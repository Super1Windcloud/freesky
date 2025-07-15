//@ts-nocheck

import dayjs from "dayjs";

export function detectBrowserLanguage() {
  if (import.meta.server) {
    const headers = useRequestHeaders();
    const lang = headers["accept-language"] || "";
    return lang.includes("zh");
  }

  const lang = navigator.language || "en";
  return lang.includes("zh");
}

export function isDevMode() {
  return !!import.meta.env.DEV;
}

export async function isChineseSkip(languages: string[], cb: Function, other :Function) {
  if (languages) {
    const langs = languages;
    if (typeof langs === "object" && langs.length > 0) {
      if (langs[0] === "zh-CN") {
        await cb();
        return;
      }
    }
  }
  await other();
}


export  function formatTime(date) {
  const newDate = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  const now = dayjs();
  const diff = now.diff(dayjs(newDate), "second");
  if (diff < 60) {
    return "\u521A\u521A";
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + "\u5206\u949F\u524D";
  } else if (diff < 86400) {
    return Math.floor(diff / 3600) + "\u5C0F\u65F6\u524D";
  } else if (diff < 604800) {
    return Math.floor(diff / 86400) + "\u5929\u524D";
  } else {
    return newDate;
  }
}