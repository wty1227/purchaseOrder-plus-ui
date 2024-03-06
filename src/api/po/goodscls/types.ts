export interface GoodsclsVO {
  /**
   * 主键
   */
  clsId: string | number;

  /**
   * 父类别id
   */
  parentId: string | number;

  /**
   * 显示顺序
   */
  orderNum: number;

  /**
   * 名称
   */
  clsName: string;

    /**
     * 子对象
     */
    children: GoodsclsVO[];
}

export interface GoodsclsForm extends BaseEntity {
  /**
   * 主键
   */
  clsId?: string | number;

  /**
   * 父类别id
   */
  parentId?: string | number;

  /**
   * 显示顺序
   */
  orderNum?: number;

  /**
   * 名称
   */
  clsName?: string;

}

export interface GoodsclsQuery {

  /**
   * 父类别id
   */
  parentId?: string | number;

  /**
   * 显示顺序
   */
  orderNum?: number;

  /**
   * 名称
   */
  clsName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



