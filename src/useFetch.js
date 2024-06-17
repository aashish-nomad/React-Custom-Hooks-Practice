import { useEffect, useState } from "react"

export function useFetch(url) {

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState(undefined);

  useEffect(() => {

    setIsLoading(true);
    setIsError(undefined);
    setData(undefined)

    const abortController = new AbortController();

    fetch(url, { signal: abortController.signal })
      .then(res => {
        if (res.status == 200) {
          return res.json()
        } else {
          return Promise.reject(res);
        }
      })
      .then(data => {
        setData(data);
      })
      .catch(err => {
        if (err?.name == 'AbortError') {
          return;
        }
        setIsError(err)
      })
      .finally(() => {
        if (abortController.signal.aborted) {
          return;
        }
        setIsLoading(false)
      });

    return (() => {
      abortController.abort();
    });

  }, [url]);


  return { data, isLoading, isError }
}
