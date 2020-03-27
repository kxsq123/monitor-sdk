import ApiErrorData from '../../../src/entry/ApiErrorData';

describe('接口请求错误实体类', () => {
  it('new一个', () => {
    const apiError = new ApiErrorData({
      code: '404',
      api: 'www.google.com',
      params: '',
      response: '',
      responseText: ''
    })

    expect(apiError.code).to.be('404')
  })
})