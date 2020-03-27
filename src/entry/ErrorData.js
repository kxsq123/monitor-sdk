/**
 * Created by daizengyu on 18/12/19.
 */

import MonitorData from './MonitorData.js';

export default class ErrorData extends MonitorData {
  constructor(type, msg, stack = '', desc = {}) {
    super();
    this.type = type;
    this.msg = msg;
    this.desc = desc;
    this.stack = stack;
  }
}
