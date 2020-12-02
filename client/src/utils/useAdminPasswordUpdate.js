import {useState, useEffect} from 'react';
// import host from '../host';
const url = `${process.env.REACT_APP_API_URL}/update-password`;

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////
// This hook needs only for testing //
//////////////////////////////////////

const useMyHook = (input) => {
  const [data, setData] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const options = {
      signal,
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `email=${input.email}&password=${input.password}&newpassword=${input.newPassword}`,
    };

    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await fetch(url, options);
        const resultJSON = await result.json();

        setData(resultJSON);

        if (!resultJSON.success) {
          throw new Error(resultJSON.message);
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    if (checked) {
      fetchData();
    }

    return function cleanup() {
      abortController.abort();
    };
  }, [checked]);

  return [{data, isLoading, isError}, setChecked];
};

export default useMyHook;
