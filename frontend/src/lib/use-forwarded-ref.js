import { useRef, useEffect } from "react";

export function useForwardedRef(forwardedRef) {
  const innerRef = useRef(null);

  useEffect(() => {
    if (!forwardedRef) return;
    if (typeof forwardedRef === "function") {
      forwardedRef(innerRef.current);
    } else {
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
}
