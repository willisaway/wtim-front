import request from '@/utils/request'

export function queryFile(data) {
  return request({
    url: '/affix/queryAll',
    method: 'post',
    data
  })
}

export function deleteFile(rowId) {
  return request({
    url: '/affix/delete/' + rowId,
    method: 'post'
  })
}
