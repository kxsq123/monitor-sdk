# 前端监控SDK（错误收集 | 性能监测）

## 目录结构

```
fe-monitor-sdk
  - dist // 打包
  - example // 页面demo
  - src // 主要逻辑
  - test // 单元测试
  - .babelrc
  - .gitignore
  - karma.conf.js // 单测配置
  - package.json
  - rollup.config.js // rollup 打包配置


```

## 打包

```
yarn run build // 正式包
yarn run dev // 开发环境包

dist
  - monitor.common.js // commonjs模块
  - monitor.esm.js // es模块
  - monitor.min.js  // umd模块
```

## 使用方法

```
// 在页面中script标签引用sdk文件
<script type="text/javascript" src="../dist/monitor.min.js">
</script>

// 传入三个参数
/**
  * @param url // 错误日志上传地址
  * @param times // 上传日志重试发起请求次数
  * @param interval // 重试请求间隔
  */

<script>
  // monitor 配置文件
  var options = {
    url: 'http://www.baidu.com'
  }

  monitor.init(options);
</script>
```
