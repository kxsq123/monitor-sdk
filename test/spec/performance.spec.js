import pm from '../../src/performance.js'

describe('性能收集', () => {
  it('performance初始化', () => {
    const options = {}
    pm.init(options);
    window.requestIdleCallback.call(window, () => {
      this.collectData();
      this.getResourceTiming(maxTiming);
    })
  })

  it('收集页面时间流', () => {
    const pefLifeCycle = [
      'redirectStart',
      'redirectEnd',
      'fetchStart',
      'domainLookupStart',
      'domainLookupEnd',
      'connectStart',
      'connectEnd',
      'requestStart'
    ]
    const pagePerformance = pm.getNavigationTiming();

    for (const key of pefLifeCycle) {
      expect(pagePerformance[key]).toEqual(jasmine.any(Number));
    }
  })

  it('数据加载', () => {
    pm.collectData();
  })

  it('资源加载时间', () => {
    const max_timing = 1000 // 最大资源加载时间1000ms
    pm.getResourceTiming(max_timing);
  })
})