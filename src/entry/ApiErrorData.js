
import ErrorData from './ErrorData.js';

export default class ApiErrorData extends ErrorData {
  constructor(code, api, params, response, responseText, method) {
    super('APIError', '接口请求异常');
    this.desc = {
      message: '接口请求异常',
      code,
      api,
      params,
      response,
      responseText,
      method
    }
  }
}