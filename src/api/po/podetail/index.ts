import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PodetailVO, PodetailForm, PodetailQuery } from '@/api/po/podetail/types';

/**
 * 查询订单数据列表
 * @param query
 * @returns {*}
 */

export const listPodetail = (query?: PodetailQuery): AxiosPromise<PodetailVO[]> => {
  return request({
    url: '/po/podetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询订单数据详细
 * @param sheetCode
 */
export const getPodetail = (sheetCode: string | number): AxiosPromise<PodetailVO> => {
  return request({
    url: '/po/podetail/' + sheetCode,
    method: 'get'
  });
};

/**
 * 新增订单数据
 * @param data
 */
export const addPodetail = (data: PodetailForm) => {
  return request({
    url: '/po/podetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改订单数据
 * @param data
 */
export const updatePodetail = (data: PodetailForm) => {
  return request({
    url: '/po/podetail',
    method: 'put',
    data: data
  });
};

export const updatePodetailData = (data: PodetailVO) => {
  return request({
    url: '/po/podetail',
    method: 'put',
    data: data
  });
};

export const updatePodetailList = (list: PodetailVO[]) => {
  return request({
    url: '/po/podetail/updatelist',
    method: 'put',
    data: list
  });
};

/**
 * 删除订单数据
 * @param sheetCode
 */
export const delPodetail = (sheetCode: string | number | Array<string | number>) => {
  return request({
    url: '/po/podetail/' + sheetCode,
    method: 'delete'
  });
};
