/**
 * Establece una cookie de forma segura intentando usar la Cookie Store API
 * y usando document.cookie como fallback.
 */
export const setCookie = (
  name: string,
  value: string,
  maxAgeSeconds: number,
) => {
  if (typeof window === "undefined") return;

  if ("cookieStore" in window) {
    window.cookieStore
      .set({
        name,
        value,
        path: "/",
        expires: Date.now() + maxAgeSeconds * 1000,
      })
      .catch(console.error);
  } else {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}`;
  }
};
