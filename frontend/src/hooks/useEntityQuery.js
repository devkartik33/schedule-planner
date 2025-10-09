import { useQuery } from "@tanstack/react-query";
import { useProtectedFetch } from "@/hooks/useProtectedFetch";

export function useEntityQuery(entity, id, enabled = true) {
  const protectedFetch = useProtectedFetch();

  console.log("🔍 useEntityQuery:", { entity, id, enabled: !!id && enabled });

  return useQuery({
    queryKey: [entity, id],
    enabled: !!id && enabled,
    queryFn: async () => {
      const url = `http://localhost:8000/api/${entity}/${id}`;
      console.log("🌐 Making request to:", url);

      const res = await protectedFetch(url);
      console.log("📡 Response status:", res.status, res.statusText);

      if (!res.ok) throw new Error(`Failed to fetch ${entity} with id ${id}`);

      const data = await res.json();
      console.log("📦 Response data:", data);

      return data;
    },
  });
}
