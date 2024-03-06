import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PomasterVO, PomasterForm, PomasterQuery } from '@/api/po/pomaster/types';

/**
 * 查询采购订单列表
 * @param query
 * @returns {*}
 */

export const listPomaster = (query?: PomasterQuery): AxiosPromise<PomasterVO[]> => {
  return request({
    url: '/po/pomaster/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询采购订单详细
 * @param sheetId
 */
export const getPomaster = (sheetId: string | number): AxiosPromise<PomasterVO> => {
  return request({
    url: '/po/pomaster/' + sheetId,
    method: 'get'
  });
};

/**
 * 新增采购订单
 * @param data
 */
export const addPomaster = (data: PomasterForm) => {
  return request({
    url: '/po/pomaster',
    method: 'post',
    data: data
  });
};

/**
 * 修改采购订单
 * @param data
 */
export const updatePomaster = (data: PomasterForm) => {
  return request({
    url: '/po/pomaster',
    method: 'put',
    data: data
  });
};

/**
 * 删除采购订单
 * @param sheetId
 */
export const delPomaster = (sheetId: string | number | Array<string | number>) => {
  return request({
    url: '/po/pomaster/' + sheetId,
    method: 'delete'
  });
};
