export interface PomasterVO {
  /**
   * 主键
   */
  sheetId: string | number;

  /**
   * 单据状态
   */
  sheetStatus: string;

  /**
   * 备注
   */
  remark: string;

}

export interface PomasterForm extends BaseEntity {
  /**
   * 主键
   */
  sheetId?: string | number;

  /**
   * 单据状态
   */
  sheetStatus?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface PomasterQuery extends PageQuery {

  /**
   * 单据状态
   */
  sheetStatus?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



