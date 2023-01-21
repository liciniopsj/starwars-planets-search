import { useState } from 'react';

function useFetch() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const makeFetch = async (url) => {
    try {
      setIsLoading(true);

      const promise = await fetch(url);
      const data = await promise.json();

      if (!promise.ok) {
        const apiError = new Error(
          `The endpoint ${url} responded with status code: ${promise.status}`,
        );
        apiError.promise = data;
        throw apiError;
      }

      return data;
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, makeFetch };
  // return { error, makeFetch };
}

export default useFetch;
