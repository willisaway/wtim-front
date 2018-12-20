import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/oauth/token',
    method: 'post',
    params: { username: username, password: password, grant_type: 'password' }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/get' + '?access_token=' + token,
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/logout/exit',
    method: 'post',
    params: { token: token }
  })
}
