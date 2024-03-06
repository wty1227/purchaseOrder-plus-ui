export interface GoodsinfoVO {
  /**
   * 主键
   */
  goodsId: string | number;

  /**
   * 显示顺序
   */
  orderNum: number;

  /**
   * 类别id
   */
  clsId: string | number;

  /**
   * 条码
   */
  barcodeNo: string;

  /**
   * 品名
   */
  goodsName: string;

  /**
   * 单位
   */
  unitName: string;

  /**
   * 进价
   */
  cost: number;

  /**
   * 售价
   */
  price: number;

  /**
   * 图片网址
   */
  imgUrl: string;

  /**
   * 状态（0正常 1停用）
   */
  status: string;

}

export interface GoodsinfoForm extends BaseEntity {
  /**
   * 主键
   */
  goodsId?: string | number;

  /**
   * 显示顺序
   */
  orderNum?: number;

  /**
   * 类别id
   */
  clsId?: string | number;

  /**
   * 条码
   */
  barcodeNo?: string;

  /**
   * 品名
   */
  goodsName?: string;

  /**
   * 单位
   */
  unitName?: string;

  /**
   * 进价
   */
  cost?: number;

  /**
   * 售价
   */
  price?: number;

  /**
   * 图片网址
   */
  imgUrl?: string;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

}

export interface GoodsinfoQuery extends PageQuery {

  /**
   * 显示顺序
   */
  orderNum?: number;

  /**
   * 类别id
   */
  clsId?: string | number;

  /**
   * 条码
   */
  barcodeNo?: string;

  /**
   * 品名
   */
  goodsName?: string;

  /**
   * 单位
   */
  unitName?: string;

  /**
   * 进价
   */
  cost?: number;

  /**
   * 售价
   */
  price?: number;

  /**
   * 图片网址
   */
  imgUrl?: string;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



