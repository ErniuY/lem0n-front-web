import axios from 'axios'
import configs from '@/configs'
import { useUserStore, useUtilStore } from '@/store'
import { ElMessage } from 'element-plus'
import { utils } from 'efficient-suite'
import mockServer from '@/mock'

const { tokenName, publicPath, mock } = configs

const handleData = ({ request, data, headers }) => {
  const responseType = request.responseType
  // 如果请求响应类型为blob
  if (responseType === 'blob') {
    const contentType = headers['content-type']
    // 返回图片
    if (contentType && contentType.startsWith('image')) {
      return {
        data,
        fileName: decodeURIComponent(request.responseURL.split('/').pop()),
      }
    }
    const contentDisposition = headers['content-disposition']
    // 同时确实有返回文件流
    if (contentDisposition) {
      const fileName = contentDisposition.split(';')[1].split('=')[1]
      return {
        data,
        fileName: decodeURI(escape(fileName)),
      }
    } else {
      // 如果不是文件流,将文件流=>json
      const contentType = headers['content-type'].split(';')[0]
      if (contentType === 'application/json') {
        const fileReader = new FileReader()
        fileReader.readAsText(data, 'utf-8')
        fileReader.onload = function () {
          return handleNormalData({ data: JSON.parse(fileReader.result) })
        }
      }
    }
  } else {
    return handleNormalData({ data })
  }
}

function handleNormalData({ data }) {
  // 滑块验证码的请求，直接返回
  if (data.repCode) {
    return data
  }
  if (Array.isArray(data)) return data
  // 登录过期了
  if (data.code === 401) {
    useUserStore().resetAllAction()
    const url = utils.getLocalStorage('casLogoutUrl')
    if (url) {
      window.location.href = url
      localStorage.removeItem('casLogoutUrl')
    }
    return
  }
  // && (data.status || data.success)
  if (parseInt(data.code) === 200) {
    return data.data ?? data
  }
  window.showCommonError && ElMessage.error(data.message || data.msg)
  return Promise.reject(data.message || data.msg)
}
const baseURL = 'a/pi'

const instance = axios.create({
  timeout: 300000,
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = useUserStore().token
    if (token) {
      config.headers[tokenName] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response } = error
    window.showCommonError && ElMessage.error('操作失败！')
    return Promise.reject(response || error)
  },
)

export default {
  baseURL,
  curdCreate(configs) {
    return this.post('/curd/curdCreate', {
      appId: 'bq_business',
      bzCode: 'BQ_BUSINESS',
      ...configs,
    })
  },
  post(url, data, useJson = true, configs = {}) {
    if (mock && data?.appId === 'mock') {
      return mockServer.query(url, data)
    }
    // 方便调试
    if (url === '/grid/getTableData') {
      url = `/grid/v2/getTableData/${data.appId}/${data.bzCode}/${data.metaSet}-${data.methodCode || 'select'}`
    } else if (url === '/grid/getColumnsData') {
      url = `/grid/v2/getColumnsData/${data.appId}/${data.bzCode}/${data.metaSet}`
    } else if (url === '/SingleTable/curd') {
      url = `/SingleTable/v2/curd/${data.appId}/${data.bzCode}/${data.metaSet}-${data.methodCode || 'select'}`
    } else if (url === '/view/getTableData') {
      url = `/view/v2/getTableData/${data.appId}/${data.bzCode}/${data.viewCode || data.metaSet}-${data.methodCode || 'select'}`
    } else if (url === '/view/getColumnsData') {
      url = `/view/v2/getColumnsData/${data.appId}/${data.bzCode}/${data.viewCode || data.metaSet}`
    } else if (url === '/tree/data') {
      url = `/tree/v2/data/${data.treeConfigId}-tree`
    } else if (url === '/dic/getDicData') {
      url = `/dic/v2/getDicData/${data.dicKey}-dic`
    } else if (url === '/dic/getDicTreeData') {
      url = `/dic/v2/getDicTreeData/${data.dicKey}-dic`
    }
    const fd = new FormData()
    if (data && !useJson) {
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const value = data[key]
          if (typeof value === 'object') {
            fd.append(key, JSON.stringify(value))
          } else {
            fd.append(key, value)
          }
        }
      }
    }
    const axiosConfigs = {
      url,
      method: 'POST',
      data: useJson ? data : fd,
      ...configs,
    }
    if (!useJson) {
      axiosConfigs.headers = {
        'Content-Type': 'multipart/form-data',
      }
    }
    return instance(axiosConfigs)
  },
  get(url, params) {
    return instance({
      url,
      method: 'GET',
      params,
    })
  },
  upload(url, params = {}, configs) {
    const fd = new FormData()
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          fd.append(key, v)
        }
      } else {
        fd.append(key, value)
      }
    }
    const axiosConfigs = {
      url,
      method: 'POST',
      data: fd,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    if (configs === true) {
      // 开启上传进度显示
      axiosConfigs.onUploadProgress = onUploadProgress
      return instance(axiosConfigs)
        .then((r) => {
          useUtilStore().setFileStateInfoAction({
            visible: false,
          })
          return r
        })
        .catch((e) => {
          console.error(e)
          useUtilStore().setFileStateInfoAction({
            visible: false,
          })
        })
    } else if (typeof configs === 'object') {
      Object.assign(axiosConfigs, configs)
    }
    return instance(axiosConfigs)
  },
  getFileStream(url, params, configs) {
    const axiosConfigs = {
      url,
      method: 'get',
      params,
      responseType: 'blob',
    }
    if (configs === true) {
      // 开启下载进度显示
      axiosConfigs.onDownloadProgress = onDownloadProgress
      return instance(axiosConfigs)
        .then((r) => {
          useUtilStore().setFileStateInfoAction({
            visible: false,
          })
          return r
        })
        .catch((e) => {
          console.error(e)
          useUtilStore().setFileStateInfoAction({
            visible: false,
          })
        })
    } else if (typeof configs === 'object') {
      Object.assign(axiosConfigs, configs)
    }
    return instance(axiosConfigs)
  },
  getFileStreamByPost(url, data, configs) {
    const axiosConfigs = {
      url,
      method: 'post',
      data,
      responseType: 'blob',
    }
    if (configs === true) {
      // 开启下载进度显示
      axiosConfigs.onDownloadProgress = onDownloadProgress
      return instance(axiosConfigs)
        .then((r) => {
          useUtilStore().setFileStateInfoAction({
            visible: false,
          })
          return r
        })
        .catch((e) => {
          console.error(e)
          useUtilStore().setFileStateInfoAction({
            visible: false,
          })
        })
    } else if (typeof configs === 'object') {
      Object.assign(axiosConfigs, configs)
    }
    return instance(axiosConfigs)
  },
  downloadBlobFile(blob, fileName) {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('target', '_blank')
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  },
  previewPdf(pathStr, nameStr) {
    // pathStr 和 nameStr 如果是多个文件则以 `,` 分隔
    window.open(
      '/pdf-viewer/pdf/web/viewerIframe.html?pdfs=' +
        pathStr +
        '&names=' +
        nameStr +
        '&baseurl=' +
        publicPath,
    )
  },
  downloadFileByUrl(url, configs) {
    return this.getFileStream(
      '/file/download/resource',
      {
        resource: url,
      },
      configs,
    )
  },
  copyTextToClipboard(text) {
    const textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.visibility = '-10000px'
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    if (!document.execCommand('copy')) {
      ElMessage.warning('浏览器暂不支持此操作！')
    } else {
      ElMessage.success('复制成功！')
    }
    document.body.removeChild(textArea)
  },
}

function onUploadProgress(e) {
  const percentage = parseInt((e.loaded / e.total) * 100)
  useUtilStore().setFileStateInfoAction({
    visible: true,
    text: '正在上传文件，请耐心等待',
    percentage,
  })
}

function onDownloadProgress(e) {
  if (!e.total) return
  const percentage = parseInt((e.loaded / e.total) * 100)
  useUtilStore().setFileStateInfoAction({
    visible: true,
    text: '正在下载文件，请耐心等待',
    percentage,
  })
}
// 预加载图片
export function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}
