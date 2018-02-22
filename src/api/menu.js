import request from '@/utils/request'
import { MENU_LIST, MENU_UPDATE, MENU_ADD, MENU_DEL } from '../utils/constant'
var qs = require('qs')
export function getList(params) {
  return request({
    url: MENU_LIST,
    method: 'get',
    params
  })
}

export function update(params) {
  return request.post(MENU_UPDATE, qs.stringify(params))
}

export function create(params) {
  return request.post(MENU_ADD, qs.stringify(params))
}

export function drop(id) {
  return request.post(MENU_DEL, qs.stringify({
    id: id
  }))
}
