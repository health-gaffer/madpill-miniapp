import Taro, {
  useState,
  useEffect,
  useReducer,
} from '@tarojs/taro'

import {HOST} from "../constants";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST_INIT':
      return {...state, isLoading: true, statusCode: 200};
    case 'REQUEST_SUCCESS':
      return {
        ...state,
        isLoading: false,
        statusCode: 200,
        data: action.payload,
      };
    case 'REQUEST_FAILURE':
      return {
        ...state,
        isLoading: false,
        statusCode: action.errorCode,
      };
    default:
      throw new Error();
  }
};

/**
 *
 * @param {string} requestMethod
 * @param {string} requestUrl
 * @param {object} initialResultData
 * @param {string} [requestData] json string of data
 * @return {[S, (value: (((prevState: {method: *, data: *, url: string}) => {method: *, data: *, url: string}) | {method: *, data: *, url: string})) => void]}
 */
const useDataApi = (requestMethod, requestUrl, initialResultData, requestData = '') => {

  const [request, setRequest] = useState({
    method: requestMethod,
    url: `${HOST}/${requestUrl}`,
    data: requestData,
  })

  const [resultState, resultDispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    statusCode: 200,
    data: initialResultData,
  });

  useEffect(() => {
    let didCancel = false;

    resultDispatch({type: 'REQUEST_INIT'});

    Taro.request({
      url: request.url,
      method: request.method,
      data: request.data,
      success: result => {
        console.log(result)
        if (!didCancel) {
          if (result.statusCode === 200) {
            resultDispatch({type: 'REQUEST_SUCCESS', payload: result.data});
          } else {
            resultDispatch({type: 'REQUEST_FAILURE', errorCode: result.statusCode});
          }
        }
      },
      fail: error => {
        console.log(error)
        if (!didCancel) {
          resultDispatch({type: 'REQUEST_FAILURE', errorCode: 400});
        }
      }
    })


    return () => {
      didCancel = true;
    };
  }, [request]);

  return [resultState, setRequest];
};

export default useDataApi
