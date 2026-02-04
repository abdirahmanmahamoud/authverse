"use client";
import type { MouseEventHandler } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useInsertionEffect,
} from "react";

/**
 * A polyfill for the experimental `useEffectEvent` hook.
 */
function useEffectEvent<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T>(fn);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  // @ts-expect-error -- we want a stable reference
  return useCallback((...args: any[]) => {
    const latest = ref.current;
    return latest(...args);
  }, []);
}

export function useCopyButton(
  onCopy: () => void | Promise<void>,
): [checked: boolean, onClick: MouseEventHandler] {
  const [checked, setChecked] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const onClick: MouseEventHandler = useEffectEvent(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    const res = Promise.resolve(onCopy());

    void res.then(() => {
      setChecked(true);
      timeoutRef.current = window.setTimeout(() => {
        setChecked(false);
      }, 1500);
    });
  });

  // Avoid updates after being unmounted
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return [checked, onClick];
}
