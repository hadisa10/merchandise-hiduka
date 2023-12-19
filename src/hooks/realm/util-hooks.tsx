import { useState, useEffect } from "react";

type TimeoutCallback = () => void;

export function useTimeout(fn: TimeoutCallback, ms: number): void {
  useEffect(() => {
    const timeout = setTimeout(() => {
      fn();
    }, ms);
    return () => clearTimeout(timeout);
  }, [fn, ms]);
}

export function useShowLoader(loading: boolean, delayMs: number): boolean {
  const [showLoader, setShowLoader] = useState<boolean>(false);

  useTimeout(() => {
    if (loading) {
      setShowLoader(true);
    }
  }, delayMs); // Pass delayMs directly without wrapping it in an array

  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);

  return showLoader;
}
