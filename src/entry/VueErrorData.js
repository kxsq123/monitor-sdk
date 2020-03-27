/**
 * Created by daizengyu on 18/12/19.
 */

import ErrorData from './ErrorData.js';
import { formatComponentName } from '../utils/utils.js'

export default class VueErrorData extends ErrorData {
  constructor(type, stack, err, vm, info) {
    super(type, 'Vue 捕获异常', stack, {name: err.name, message: err.message});
    this.vmName = formatComponentName(vm);
    this.info = info;
  }
}
