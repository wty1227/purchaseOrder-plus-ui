import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { GoodsinfoVO, GoodsinfoForm, GoodsinfoQuery } from '@/api/po/goodsinfo/types';
import {DictTypeVO} from "@/api/system/dict/type/types";

/**
 * 查询商品资料列表
 * @param query
 * @returns {*}
 */

export const listGoodsinfo = (query?: GoodsinfoQuery): AxiosPromise<GoodsinfoVO[]> => {
  return request({
    url: '/po/goodsinfo/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商品资料详细
 * @param goodsId
 */
export const getGoodsinfo = (goodsId: string | number): AxiosPromise<GoodsinfoVO> => {
  return request({
    url: '/po/goodsinfo/' + goodsId,
    method: 'get'
  });
};

/**
 * 新增商品资料
 * @param data
 */
export const addGoodsinfo = (data: GoodsinfoForm) => {
  return request({
    url: '/po/goodsinfo',
    method: 'post',
    data: data
  });
};

/**
 * 修改商品资料
 * @param data
 */
export const updateGoodsinfo = (data: GoodsinfoForm) => {
  return request({
    url: '/po/goodsinfo',
    method: 'put',
    data: data
  });
};

/**
 * 删除商品资料
 * @param goodsId
 */
export const delGoodsinfo = (goodsId: string | number | Array<string | number>) => {
  return request({
    url: '/po/goodsinfo/' + goodsId,
    method: 'delete'
  });
};


export function optionSelect(): AxiosPromise<DictTypeVO[]> {
  return request({
    url: '/po/goodsinfo/optionselect',
    method: 'get'
  });
}
