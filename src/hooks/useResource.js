import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessage } from "../api";

/**
 * Loads a list/record from the API and keeps it in local state.
 *
 *   const { data, setData, loading, error, reload } = useResource(
 *     (signal) => coursesApi.list(undefined, { signal }), []
 *   );
 *
 * `setData` lets a page apply the row it just saved without re-fetching, so
 * the existing optimistic UI keeps working. In-flight requests are aborted on
 * unmount, and a stale response never overwrites a newer one.
 */
export function useResource(fetcher, deps = [], { initial = [], enabled = true } = {}) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");
  const requestId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  const load = useCallback(
    async (signal) => {
      const id = ++requestId.current;
      setLoading(true);
      setError("");
      try {
        const result = await run(signal);
        if (id === requestId.current) setData(result ?? initial);
      } catch (err) {
        if (err?.name === "AbortError" || id !== requestId.current) return;
        setError(errorMessage(err, "Couldn't load this data."));
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run]
  );

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load, enabled]);

  const reload = useCallback(() => load(), [load]);

  return { data, setData, loading, error, reload };
}
