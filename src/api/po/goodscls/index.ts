import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { GoodsclsVO, GoodsclsForm, GoodsclsQuery } from '@/api/po/goodscls/types';

/**
 * 查询商品类别列表
 * @param query
 * @returns {*}
 */

export const listGoodscls = (query?: GoodsclsQuery): AxiosPromise<GoodsclsVO[]> => {
  return request({
    url: '/po/goodscls/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商品类别详细
 * @param clsId
 */
export const getGoodscls = (clsId: string | number): AxiosPromise<GoodsclsVO> => {
  return request({
    url: '/po/goodscls/' + clsId,
    method: 'get'
  });
};

/**
 * 新增商品类别
 * @param data
 */
export const addGoodscls = (data: GoodsclsForm) => {
  return request({
    url: '/po/goodscls',
    method: 'post',
    data: data
  });
};

/**
 * 修改商品类别
 * @param data
 */
export const updateGoodscls = (data: GoodsclsForm) => {
  return request({
    url: '/po/goodscls',
    method: 'put',
    data: data
  });
};

/**
 * 删除商品类别
 * @param clsId
 */
export const delGoodscls = (clsId: string | number | Array<string | number>) => {
  return request({
    url: '/po/goodscls/' + clsId,
    method: 'delete'
  });
};
