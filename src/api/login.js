import request from '@/utils/request'
var qs = require('qs')

export function login(username, password) {
  return request.post('/login', qs.stringify({
    username: username,
    password: password
  }))
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
