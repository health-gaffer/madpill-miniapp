import Taro, {useEffect, useReducer, useState,} from '@tarojs/taro'

import {HOST, MADPILL_RESPONSE_CODE} from "../constants";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST_INIT':
      return {...state, isLoading: true, statusCode: 200};
    case 'REQUEST_SUCCESS':
      console.log('REQUEST_SUCCESS')
      console.log(action.payload)
      return {
        ...state,
        isLoading: false,
        statusCode: 200,
        data: action.payload,
      };
    case 'REQUEST_FAILURE':
      console.log('REQUEST_FAILURE')
      console.log(action.errorCode)
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
 * @param {Taro.request.method} requestMethod
 * @param {string} requestUrl
 * @param {object} initialResultData
 * @param {object} [requestData] json string of data
 * @return {[S, (value: (((prevState: {method: *, data: *, url: string}) => {method: *, data: *, url: string}) | {method: *, data: *, url: string})) => void]}
 */
const useDataApi = (requestMethod, requestUrl, initialResultData, requestData = {}) => {

  const [request, setRequest] = useState({
    method: requestMethod,
    url: `${requestUrl}`,
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
      url: `${HOST}/${request.url}`,
      method: request.method,
      data: request.data,
      success: result => {
        console.log('success')
        console.log(result)
        if (!didCancel && result.statusCode === 200) {
          const madpillResult = result.data
          if (madpillResult.code === MADPILL_RESPONSE_CODE.OK) {
            resultDispatch({type: 'REQUEST_SUCCESS', payload: madpillResult.data});
          } else {
            resultDispatch({type: 'REQUEST_FAILURE', errorCode: madpillResult.code});
          }
        }
      },
      fail: error => {
        console.log('fail')
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
