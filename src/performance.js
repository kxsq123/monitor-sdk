import { PagePerformance, ResPerformance } from './entry/index.js'
import { runIdleTask } from './utils/utils.js'

export default {

  getNavigationTiming ()  {
    const [navigationTiming] = performance.getEntriesByType('navigation');
    return navigationTiming;
  },

  getResourceTiming (maxTiming) {
    if (performance === void 0) {
      console.log("浏览器不支持performance API 无法收集");
      return;
    }

    if (!performance.getEntriesByType) {
      console.log("浏览器不支持资源加载收集");
      return;
    }

    const resources = performance.getEntriesByType('resource');

    /**
     * An application can get timestamps for the various stages used to load a resource.
     * The first property in the processing model is startTime which returns the timestamp immediately
     * before the resource loading process begins.
     */

    /**
     * 最多就收集50条数据
     */

    const longTimeRes = resources.filter((v, i) => v.responseEnd - v.startTime >= maxTiming).slice(0, 20);

    if (longTimeRes.length) {
      const resPerformance = new ResPerformance(longTimeRes);
      resPerformance.pushToResourceQueue();
    }
  },

  collectData () {
    const performanceData = new PagePerformance(performance);
    performanceData.pushToPerformanceQueue();
  },

  init (maxTiming) {
    runIdleTask(() => {
      this.collectData();
      this.getResourceTiming(maxTiming);
    });
  }
};

