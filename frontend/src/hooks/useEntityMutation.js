import { useMutation } from "@tanstack/react-query";
import { useProtectedFetch } from "@/hooks/useProtectedFetch";

export function useEntityMutation(entity, method) {
  const protectedFetch = useProtectedFetch();

  return useMutation({
    mutationFn: async (params) => {
      let url = `http://localhost:8000/api/${entity}/`;
      let options = {
        headers: { "Content-Type": "application/json" },
      };

      console.log(url, method, params); // Debugging line

      switch (method) {
        case "create":
          options.method = "POST";
          options.body = JSON.stringify(params);
          break;

        case "patch": {
          const { id, data } = params;
          url += `${id}`;
          options.method = "PATCH";
          options.body = JSON.stringify(data);
          break;
        }

        case "delete": {
          const { id } = params;
          url += `${id}`;
          options.method = "DELETE";
          break;
        }

        default:
          throw new Error(`Unsupported mutation method: ${method}`);
      }

      const res = await protectedFetch(url, options);
      console.log(url, options);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to ${method} ${entity}`);
      }

      return res.json().catch(() => ({}));
    },
  });
}
