/**
 * Created by daizengyu on 18/12/19.
 */

import MonitorData from './MonitorData.js';
import { getReferrer } from '../utils/utils.js';

export default class PagePerformance extends MonitorData {
  constructor(performance) {
    super();
    const { memory, navigation, timing, onresourcetimingbufferfull, timeOrigin } = performance;
    this.memory = memory; // 非标准属性, 只有在chrome里有
    this.navigation = navigation;
    this.timing = timing;
    this.onresourcetimingbufferfull = onresourcetimingbufferfull;
    this.timeOrigin = timeOrigin;
    this.referrer = getReferrer(); // 页面来源
  }
}
