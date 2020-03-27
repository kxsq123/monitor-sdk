/**
 * Created by daizengyu on 18/12/19.
 */

import { browserType, getOS } from '../utils/utils.js';

export default class BaseData {
  constructor(project) {
    const { width, height, pixelDepth, colorDepth } = screen; // window.screen 为特殊类型，必须拼成对象
    this.browser = browserType();
    this.platform = getOS();
    this.project = project;
    this.version = '__VERSION__'; // rollup 自动替换
    this.screen = { width, height, pixelDepth, colorDepth };
  }
}
