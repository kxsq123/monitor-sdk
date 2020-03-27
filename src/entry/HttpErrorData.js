/**
 * Created by daizengyu on 18/12/19.
 */

import ErrorData from './ErrorData.js';

export default class HttpErrorData extends ErrorData {
  constructor(node, target) {
    super('ResourceError', '资源加载异常');
    this.source = target.src;
    this.tagName = target.tagName;
    this.element = node;
  }
}
