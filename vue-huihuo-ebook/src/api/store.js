import axios from 'axios'
import {
  setLocalForage
} from '../utils/localForage'

export function flatList() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}

export function shelf() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

export function home() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function download(book, onSucess, onError, onProgress) {
  if (onProgress == null) {
    onProgress = onError
    onError = null
  } //onProgress没有传进来时赋参
  return axios.create({
      baseURL: process.env.VUE_APP_EPUB_URL,
      method: 'get',
      responseType: 'blob',
      //电子书格式
      timeout: 180 * 1000,
      //超时时间：3分钟
      onDownloadProgress: progressEvent => {
        if (onProgress) onProgress(progressEvent)
      }
    }).get(`${book.categoryText}/${book.fileName}.epub`)
    //电子书资源路径
    .then(res => {
      const blob = new Blob([res.data])
      setLocalForage(book.fileName, blob,
        () => onSucess(book),
        err => onError(err))
      //indexedDB存储
    }).catch(err => {
      if (onError) onError(err)
    })
}
