export interface PodetailVO {
  /**
   * 主键
   */
  sheetCode: number;

  sheetStatus: string | number;
  /**
   * 主表id
   */
  sheetId: string | number;

  /**
   * 商品id
   */
  goodsId: string | number;

  /**
   * 类别id
   */
  clsId: string | number;

  /**
   * 类别名称
   */
  clsName: string;

  /**
   * 条码
   */
  barcodeNo: string;

  /**
   * 品名
   */
  goodsName: string;

  /**
   * 要货单位
   */
  orderUnitName: string;

  /**
   * 万
   */
  orderQty1: number | undefined;

  /**
   * 县
   */
  orderQty2: number | undefined;

  /**
   * 公
   */
  orderQty3: number | undefined;

  /**
   * 中
   */
  orderQty4: number | undefined;

  /**
   * 稼
   */
  orderQty5: number | undefined;

  /**
   * 云
   */
  orderQty6: number | undefined;

  /**
   * 万
   */
  realQty1: number | undefined;

  /**
   * 县
   */
  realQty2: number | undefined;

  /**
   * 公
   */
  realQty3: number | undefined;

  /**
   * 中
   */
  realQty4: number | undefined;

  /**
   * 稼
   */
  realQty5: number | undefined;

  /**
   * 云
   */
  realQty6: number | undefined;

}

export interface PodetailForm extends BaseEntity {
  /**
   * 主键
   */
  sheetCode?: number;

  /**
   * 主表id
   */
  sheetId?: string | number;

  /**
   * 商品id
   */
  goodsId?: string | number;

  /**
   * 类别id
   */
  clsId?: string | number;

  /**
   * 类别名称
   */
  clsName?: string;

  /**
   * 条码
   */
  barcodeNo?: string;

  /**
   * 品名
   */
  goodsName?: string;

  /**
   * 要货单位
   */
  orderUnitName?: string;

  /**
   * 万
   */
  orderQty1?: number;

  /**
   * 县
   */
  orderQty2?: number;

  /**
   * 公
   */
  orderQty3?: number;

  /**
   * 中
   */
  orderQty4?: number;

  /**
   * 稼
   */
  orderQty5?: number;

  /**
   * 云
   */
  orderQty6?: number;

  /**
   * 万
   */
  realQty1?: number;

  /**
   * 县
   */
  realQty2?: number;

  /**
   * 公
   */
  realQty3?: number;

  /**
   * 中
   */
  realQty4?: number;

  /**
   * 稼
   */
  realQty5?: number;

  /**
   * 云
   */
  realQty6?: number;

}

export interface PodetailQuery extends PageQuery {

  /**
   * 主表id
   */
  sheetId?: string | number;

  /**
   * 商品id
   */
  goodsId?: string | number;

  /**
   * 类别id
   */
  clsId?: string | number;

  /**
   * 类别名称
   */
  clsName?: string;

  /**
   * 条码
   */
  barcodeNo?: string;

  /**
   * 品名
   */
  goodsName?: string;

  /**
   * 要货单位
   */
  orderUnitName?: string;

  /**
   * 万
   */
  orderQty1?: number;

  /**
   * 县
   */
  orderQty2?: number;

  /**
   * 公
   */
  orderQty3?: number;

  /**
   * 中
   */
  orderQty4?: number;

  /**
   * 稼
   */
  orderQty5?: number;

  /**
   * 云
   */
  orderQty6?: number;

  /**
   * 万
   */
  realQty1?: number;

  /**
   * 县
   */
  realQty2?: number;

  /**
   * 公
   */
  realQty3?: number;

  /**
   * 中
   */
  realQty4?: number;

  /**
   * 稼
   */
  realQty5?: number;

  /**
   * 云
   */
  realQty6?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



