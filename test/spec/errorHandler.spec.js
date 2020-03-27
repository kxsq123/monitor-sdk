import '../../src/main.js';
import ApiErrorData from '../../src/entry/ApiErrorData';
import HttpErrorData from '../../src/entry/HttpErrorData';
import VueErrorData from '../../src/entry/VueErrorData';
import { MonitorData } from '../../src/entry/index.js';
import ajax from '../../src/utils/ajax.js';

describe('errorHandler', () => {
  it('monitor 初始化',  () => {
    const options = {
      url: 'http://localhost:9407/monitor/add', // 接口上传地址
      isCollectedPerformance: true, // 开启性能收集
      max_timing: 1000 // 资源加载最大时间
      // sample: 1 // 采样率
    }
    window.newMonitor.init(options);
    window.onload.call(window);
  })

  it('错误实体类初始化', () => {
    const apiError = new ApiErrorData();
    const httpError = new HttpErrorData(
      '<img src="">', {}
    );
    const vueError = new VueErrorData('Vue Error', 'error', new Error('vue error'), {});
  })

  it('js全局报错', () => {
    setTimeout(() => {
      try {
        throw new Error('js全局报错');
      } catch (e) {
        window.onerror.apply(window, [e.stack.toString(), 'localhost:4907',  1, 232, e]);
      }
      expect(MonitorData.errorQueue.length).toBe(1)
    })
  })

  it('资源加载错误', () => {

    setTimeout(() => {

      const error = new Event('error', {
        code: 1024,
        message: "Network Error",
        target: {
          srcElement: '',
          outerHTML: ''
        }
      })

      window.dispatchEvent(error);
      expect(MonitorData.errorQueue.length).toBe(2)
    })
  })

  it('http请求错误', () => {
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('post', '')
    xhr.setRequestHeader('content-Type', 'text/plain;charset=UTF-8')
    xhr.send({
      ass: 'ass'
    })
  })

  it('ajax', () => {
    ajax({
      baseUrl: '',
      method: 'POST',
      data: {

      }
    })
  })

  // it('Vue组件抛出异常', () => {
    // const demo = new Vue({
    //   el: '#demo',
    //   beforeMount() {
    //     a();
    //   }
    // })
  // })
})
