import { useAuth } from "@/contexts/AuthContext";

export function useProtectedFetch() {
  const { token, refreshAccessToken, logout } = useAuth();

  const protectedFetch = async (url, options = {}) => {
    let accessToken = token;

    let res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status !== 401) {
      return res;
    }

    try {
      const newToken = await refreshAccessToken();

      const retry = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (!retry.ok) console.error("Refetch failed", retry);

      return retry;
    } catch (err) {
      logout();
    }
  };

  return protectedFetch;
}
