// 浏览器侦测
function browserType() {
  const inBrowser = typeof window !== 'undefined';
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  const isIE = UA && /msie|trident/.test(UA);
  // const isIE9 = UA && UA.indexOf('msie 9.0') > 0
  const isEdge = UA && UA.indexOf('edge/') > 0;
  const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  const isOpera = UA && (UA.indexOf('opera') > -1 || UA.indexOf('opr') > -1);
  const isSafari = UA && UA.indexOf('safari') > -1 && UA.indexOf('chrome') === -1;
  const isQQ = UA && UA.indexOf('mqqbrowser') > 0;
  const isFF = UA && UA.indexOf('firefox') > -1;
  const isUC = UA && UA.indexOf('ucbrowser/') > 0;
  const isBaidu = UA && UA.indexOf('baiduboxapp') > 0;
  const isAndroid = UA && UA.indexOf('android') > 0;
  const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(UA);
    const fIEVersion = parseFloat(RegExp.$1);
    if (UA.indexOf('msie 6.0') !== -1) {
      return {
        tag: 'IE',
        userAgent: UA,
        version: '6'
      };
    } else if (fIEVersion === 7) {
      return {
        tag: 'IE',
        userAgent: UA,
        version: '7'
      };
    } else if (fIEVersion === 8) {
      return {
        tag: 'IE',
        userAgent: UA,
        version: '8'
      };
    } else if (fIEVersion === 9) {
      return {
        tag: 'IE',
        userAgent: UA,
        version: '9'
      };
    } else if (fIEVersion === 10) {
      return {
        tag: 'IE',
        userAgent: UA,
        version: '10'
      };
    } else if (UA.match(/rv:([\d.]+)\) like gecko/)) {
      return {
        tag: 'IE',
        userAgent: UA,
        version: '11'
      };
    }
    return {
      tag: 'IE',
      userAgent: UA,
      version: '0'
    }; // IE版本过低
  }

  if (isBaidu) {
    return {
      tag: 'Baidu',
      userAgent: UA,
      version: ''
    }
  }

  if (isQQ) {
    return {
      tag: 'QQ',
      userAgent: UA,
      version: ''
    };
  }

  if (isUC) {
    return {
      tag: 'UC',
      userAgent: UA,
      version: ''
    };
  }

  if (isEdge) {
    return {
      tag: 'Edge',
      userAgent: UA,
      version: ''
    };
  }

  if (isFF) {
    const versionStr = UA.substr(UA.indexOf('firefox') + 8, 10);
    return {
      tag: 'firefox',
      userAgent: UA,
      version: versionStr.split('.')[0]
    };
  }

  if (isOpera) {
    return {
      tag: 'Opera',
      userAgent: UA,
      version: ''
    };
  }

  if (isSafari) {
    const versionStr = UA.substr(UA.indexOf('version') + 8, 10);
    return {
      tag: 'Safari',
      userAgent: UA,
      version: versionStr.split('.')[0]
    };
  }

  if (isChrome) {
    const versionStr = UA.substr(UA.indexOf('chrome') + 7, 10);
    return {
      tag: 'Chrome',
      userAgent: UA,
      version: versionStr.split('.')[0]
    };
  }

  if (isAndroid) {
    return {
      tag: 'Android',
      userAgent: UA,
      version: ''
    };
  }

  if (isIOS) {
    return {
      tag: 'IOS',
      userAgent: UA,
      version: ''
    };
  }

  return {
    tag: '未知',
    userAgent: UA,
    version: ''
  };
}

// 硬件设备检测
function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = '';

  if (~macosPlatforms.indexOf(platform)) {
    os = 'Mac OS';
  } else if (~iosPlatforms.indexOf(platform)) {
    os = 'iOS';
  } else if (~windowsPlatforms.indexOf(platform)) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

// vue组件格式化
function formatComponentName(vm) {
  if (vm.$root === vm) return 'root';
  var name = vm._isVue
    ? (vm.$options && vm.$options.name) ||
    (vm.$options && vm.$options._componentTag)
    : vm.name;
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options && vm.$options.__file
      ? ' at ' + (vm.$options && vm.$options.__file)
      : '')
  );
}

function getReferrer() {
  return document.referrer.split('/')[2] || '未知';
}

const withBeforeHook = function (originEvent, callback) {
  return function() {
    callback.apply(this, arguments);
    originEvent.apply(this, arguments);
  }
}

const withAfterHook = function (originEvent, callback) {
  return function() {
    originEvent.apply(this, arguments);
    callback.apply(this, arguments);
  }
}

const debounce = (fn, wait = 500) => {
  let timeId = null;
  return (...args) => {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(function() {
      fn.apply(this, args);
    }, wait);
  };
};

// 低优先级任务
const runIdleTask = (fn) => {
  // 尽量避免占用主线程
  if (window.requestIdleCallback) {
    window.requestIdleCallback(_ => {
      fn.call(null);
    })
  } else {
    setTimeout(_ => {
      fn.call(null);
    }, 0)
  }
};

const isRegExp = (regx) => {
  return Object.prototype.toString.call(regx) === '[object RegExp]';
}

const isError = (err) => {
  return Object.prototype.toString.call(err) === '[object Error]';
}

export {
  isRegExp,
  isError,
  runIdleTask,
  debounce,
  getReferrer,
  withBeforeHook,
  withAfterHook,
  getOS,
  browserType,
  formatComponentName
}
