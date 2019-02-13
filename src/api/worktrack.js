import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/SERVICE-WTIM/worktrack/private/query',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/SERVICE-WTIM/worktrack/private/update',
    method: 'post',
    data
  })
}
