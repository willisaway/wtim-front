import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/worktrack/private/query',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/worktrack/private/update',
    method: 'post',
    data
  })
}
