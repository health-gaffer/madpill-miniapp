import Taro, {useEffect, useReducer, useState,} from '@tarojs/taro'

import {HOST, MADPILL_RESPONSE_CODE} from "../constants";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST_INIT':
      return {...state, isLoading: true, statusCode: undefined};
    case 'REQUEST_SUCCESS':
      console.log('REQUEST_SUCCESS')
      console.log(action.payload)
      return {
        ...state,
        isLoading: false,
        statusCode: MADPILL_RESPONSE_CODE.OK,
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
 * @param option {object}
 * @param option.requestMethod {Taro.request.method}
 * @param option.requestUrl {string}
 * @param [option.initialResultData] {object}
 * @param [option.requestData] {object | array}
 * @param [option.execNow=false] {boolean} set true to send the REQUEST on every change
 * @return {[S, (value: (((prevState: {method: *, data: *, url: string}) => {method: *, data: *, url: string}) | {method: *, data: *, url: string})) => void]}
 */
const useDataApi = ({
                      requestMethod,
                      requestUrl,
                      requestData,
                      initialResultData,
                      execNow = false,
                    }) => {

  const [request, setRequest] = useState({
    method: requestMethod,
    url: requestUrl,
    data: requestData,
    exec: execNow,
  });

  const [resultState, resultDispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    statusCode: undefined,
    data: initialResultData,
  });

  useEffect(() => {
    let didCancel = false;

    if (request.exec) {
      console.log('now exec')
      resultDispatch({
        type: 'REQUEST_INIT'
      });
      Taro.request({
        url: `${HOST}/${request.url}`,
        method: request.method,
        data: request.data,
        success: result => {
          console.log('success')
          console.log(result)
          const madpillResult = result.data
          if (!didCancel && result.statusCode === 200 && madpillResult.code === MADPILL_RESPONSE_CODE.OK) {
            resultDispatch({
              type: 'REQUEST_SUCCESS',
              payload: madpillResult.data
            });
          } else {
            resultDispatch({
              type: 'REQUEST_FAILURE',
              errorCode: madpillResult.code ? madpillResult.code : madpillResult.status
            });
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
    }

    return () => {
      didCancel = true;
    };
  }, [request]);

  return [resultState, setRequest];
};

export default useDataApi
