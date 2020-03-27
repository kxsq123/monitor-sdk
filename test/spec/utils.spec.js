import { browserType } from '../../src/utils/utils.js'

describe('工具类方法', () => {
  it('获得浏览器类型', () => {
    const browserType = browserType();
    expect(browserType).to.be('Chrome');
  })
})