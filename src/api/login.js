import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/SERVICE-AUTH/oauth/token',
    method: 'post',
    params: { username: username, password: password, grant_type: 'password' }
  })
}

export function getInfo(token) {
  return request({
    url: '/SERVICE-AUTH/user/get' + '?access_token=' + token,
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/SERVICE-AUTH/logout/exit',
    method: 'post',
    params: { access_token: token }
  })
}
