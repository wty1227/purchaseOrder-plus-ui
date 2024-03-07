<template>
  <div class="p-2">
<!--    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">-->
<!--      <div class="search" v-show="showSearch">-->
<!--        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">-->
<!--          <el-form-item>-->
<!--            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--            <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--    </transition>-->

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" :disabled="pomaster.sheetStatus !== '0'" @click="handleAdd" v-hasPermi="['po:pomaster:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="pomaster.sheetStatus !== '0'"  @click="handleUpdateList()" v-hasPermi="['po:pomaster:edit-purchase']">保存要货信息</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="pomaster.sheetStatus === '2'"  @click="handleUpdateList()" v-hasPermi="['po:pomaster:edit-real']">保存配送信息</el-button>
          </el-col>
<!--          <el-col :span="1.5">-->
<!--            <el-button type="danger" plain icon="Delete" :disabled="pomaster.sheetStatus !== '0'" @click="handleDelete()" v-hasPermi="['po:pomaster:remove']">删除</el-button>-->
<!--          </el-col>-->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['po:pomaster:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="podetailList" @selection-change="handleSelectionChange" >
<!--        <el-table-column type="selection" width="55" align="center" />-->
<!--        <el-table-column label="主键" align="center" prop="sheetCode" v-if="true" />-->
<!--        <el-table-column label="主表id" align="center" prop="sheetId" />-->
<!--        <el-table-column label="商品id" align="center" prop="goodsId" />-->
<!--        <el-table-column label="类别id" align="center" prop="clsId" />-->
        <el-table-column label="类别名称" align="center" prop="clsName" />
        <el-table-column label="条码" align="center" prop="barcodeNo" />
        <el-table-column label="品名" align="center" prop="goodsName" fixed/>
        <el-table-column label="单位" align="center" prop="orderUnitName" fixed width="40"/>
        <el-table-column label="要货信息" align="center">
          <el-table-column label="万" align="center" prop="orderQty1">
            <template #default="scope">
              <el-input v-model="scope.row.orderQty1" controls-position="right" :min="0" :disabled="pomaster.sheetStatus !== '0' || !checkPermi(['po:pomaster:edit1'])"/>
            </template>
          </el-table-column>
          <el-table-column label="县" align="center" prop="orderQty2">
            <template #default="scope">
              <el-input v-model="scope.row.orderQty2" controls-position="right" :min="0" :disabled="pomaster.sheetStatus !== '0' || !checkPermi(['po:pomaster:edit2'])"/>
            </template>
          </el-table-column>
          <el-table-column label="公" align="center" prop="orderQty3">
            <template #default="scope">
              <el-input v-model="scope.row.orderQty3" controls-position="right" :min="0" :disabled="pomaster.sheetStatus !== '0' || !checkPermi(['po:pomaster:edit3'])"/>
            </template>
          </el-table-column>
          <el-table-column label="中" align="center" prop="orderQty4">
            <template #default="scope">
              <el-input v-model="scope.row.orderQty4" controls-position="right" :min="0" :disabled="pomaster.sheetStatus !== '0' || !checkPermi(['po:pomaster:edit4'])"/>
            </template>
          </el-table-column>
          <el-table-column label="稼" align="center" prop="orderQty5">
            <template #default="scope">
              <el-input v-model="scope.row.orderQty5" controls-position="right" :min="0" :disabled="pomaster.sheetStatus !== '0' || !checkPermi(['po:pomaster:edit5'])"/>
            </template>
          </el-table-column>
          <el-table-column label="云" align="center" prop="orderQty6">
            <template #default="scope">
              <el-input v-model="scope.row.orderQty6" controls-position="right" :min="0" :disabled="pomaster.sheetStatus !== '0' || !checkPermi(['po:pomaster:edit6'])"/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="配送信息" align="center">
            <el-table-column label="万" align="center" prop="realQty1" class-name="success-row">
              <template #default="scope">
                <el-input v-model="scope.row.realQty1" controls-position="right" :min="0" :disabled="pomaster.sheetStatus === '2' || !checkPermi(['po:pomaster:edit-real'])"/>
              </template>
            </el-table-column>
            <el-table-column label="县" align="center" prop="realQty2" class-name="success-row">
              <template #default="scope">
                <el-input v-model="scope.row.realQty2" controls-position="right" :min="0" :disabled="pomaster.sheetStatus === '2' || !checkPermi(['po:pomaster:edit-real'])"/>
              </template>
            </el-table-column>
            <el-table-column label="公" align="center" prop="realQty3" class-name="success-row">
              <template #default="scope">
                <el-input v-model="scope.row.realQty3" controls-position="right" :min="0" :disabled="pomaster.sheetStatus === '2' || !checkPermi(['po:pomaster:edit-real'])"/>
              </template>
            </el-table-column>
            <el-table-column label="中" align="center" prop="realQty4" class-name="success-row">
              <template #default="scope">
                <el-input v-model="scope.row.realQty4" controls-position="right" :min="0" :disabled="pomaster.sheetStatus === '2' || !checkPermi(['po:pomaster:edit-real'])"/>
              </template>
            </el-table-column>
            <el-table-column label="稼" align="center" prop="realQty5" class-name="success-row">
              <template #default="scope">
                <el-input v-model="scope.row.realQty5" controls-position="right" :min="0" :disabled="pomaster.sheetStatus === '2' || !checkPermi(['po:pomaster:edit-real'])"/>
              </template>
            </el-table-column>
            <el-table-column label="云" align="center" prop="realQty6" class-name="success-row">
              <template #default="scope">
                <el-input v-model="scope.row.realQty6" controls-position="right" :min="0" :disabled="pomaster.sheetStatus === '2' || !checkPermi(['po:pomaster:edit-real'])"/>
              </template>
            </el-table-column>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
<!--            <el-tooltip content="保存" placement="top">-->
<!--              <el-button v-if="scope.row.sheetStatus !== '2'" link type="primary" icon="Edit" @click="handleUpdate(scope.row)" :disabled="pomaster.sheetStatus === '2'" v-hasPermi="['po:pomaster:edit']"></el-button>-->
<!--            </el-tooltip>-->
            <el-tooltip content="删除" placement="top">
              <el-button v-if="scope.row.sheetStatus !== '2'" link type="primary" icon="Delete" @click="handleDelete(scope.row)" :disabled="pomaster.sheetStatus !== '0'" v-hasPermi="['po:pomaster:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改订单数据对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="podetailFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="品名" prop="goodsId">
              <el-select
                  style="width: 100%;"
                  v-model="form.goodsId" placeholder="请选择"
                  @change="handleNodeChange">
                <el-option
                    v-for="item in goodsinfoOptions"
                    :key="item.goodsId"
                    :label="item.goodsName"
                    :value="item.goodsId">
                  <span style="float: left">{{ item.goodsName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.barcodeNo }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条码" prop="barcodeNo">
              <el-input disabled v-model="form.barcodeNo" placeholder="请输入条码" />
            </el-form-item>
            <el-form-item label="要货单位" prop="orderUnitName">
              <el-input v-model="form.orderUnitName" placeholder="请输入要货单位" />
            </el-form-item>
<!--            <el-form-item label="万" prop="orderQty1">-->
<!--              <el-input v-model="form.orderQty1" placeholder="请输入万" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="县" prop="orderQty2">-->
<!--              <el-input v-model="form.orderQty2" placeholder="请输入县" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="公" prop="orderQty3">-->
<!--              <el-input v-model="form.orderQty3" placeholder="请输入公" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="中" prop="orderQty4">-->
<!--              <el-input v-model="form.orderQty4" placeholder="请输入中" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="稼" prop="orderQty5">-->
<!--              <el-input v-model="form.orderQty5" placeholder="请输入稼" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="云" prop="orderQty6">-->
<!--              <el-input v-model="form.orderQty6" placeholder="请输入云" />-->
<!--            </el-form-item>-->
          </el-col>

          <el-col :span="12">

<!--            <el-form-item label="品名" prop="goodsName">-->
<!--              <el-input v-model="form.goodsName" placeholder="请输入品名" />-->
<!--            </el-form-item>-->

            <el-form-item label="类别名称" prop="clsName">
              <!--              <el-input v-model="form.clsName" placeholder="请输入类别名称">-->
              <el-tree-select disabled
                              v-model="form.clsId"
                              :data="goodsclsOptions"
                              :props="{ value: 'clsId', label: 'clsName', children: 'children' }"
                              value-key="clsId"
                              placeholder="请输入类别"
                              check-strictly
              />
            </el-form-item>


            <!--            <el-form-item label="万" prop="realQty1">-->
<!--              <el-input v-model="form.realQty1" placeholder="请输入万" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="县" prop="realQty2">-->
<!--              <el-input v-model="form.realQty2" placeholder="请输入县" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="公" prop="realQty3">-->
<!--              <el-input v-model="form.realQty3" placeholder="请输入公" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="中" prop="realQty4">-->
<!--              <el-input v-model="form.realQty4" placeholder="请输入中" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="稼" prop="realQty5">-->
<!--              <el-input v-model="form.realQty5" placeholder="请输入稼" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="云" prop="realQty6">-->
<!--              <el-input v-model="form.realQty6" placeholder="请输入云" />-->
<!--            </el-form-item>-->
          </el-col>
<!--        <el-form-item label="主表id" prop="sheetId">-->
<!--          <el-input v-model="form.sheetId" placeholder="请输入主表id" />-->
<!--        </el-form-item>-->

<!--        <el-form-item label="类别id" prop="clsId">-->
<!--          <el-input v-model="form.clsId" placeholder="请输入类别id" />-->
<!--        </el-form-item>-->
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Podetail" lang="ts">
import {
  listPodetail,
  getPodetail,
  delPodetail,
  addPodetail,
  updatePodetail,
  updatePodetailData, updatePodetailList
} from '@/api/po/podetail';
import { PodetailVO, PodetailQuery, PodetailForm } from '@/api/po/podetail/types';
import {GoodsclsVO} from "@/api/po/goodscls/types";
import {listGoodscls} from "@/api/po/goodscls";
import {GoodsinfoVO} from "@/api/po/goodsinfo/types";
import {listGoodsinfo, optionSelect as goodsInfoOptionSelect} from "@/api/po/goodsinfo";

import { checkPermi, checkRole } from "@/utils/permission";
import {ElTree} from "element-plus";
import {PomasterVO} from "@/api/po/pomaster/types";
import {getPomaster} from "@/api/po/pomaster"; // 权限判断函数

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();

const sheetId = ref<number>();
const pomaster = ref<PomasterVO>({
  sheetId: '',
  sheetStatus: '0',
  remark: ''
});
const podetailList = ref<PodetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const goodsinfoOptions = ref<GoodsinfoVO[]>([])
const goodsclsOptions = ref<GoodsclsVO[]>([])

const queryFormRef = ref<ElFormInstance>();
const podetailFormRef = ref<ElFormInstance>();
const goodsinfoRef = ref<ElTreeInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: PodetailForm = {
  sheetCode: undefined,
  sheetId: undefined,
  goodsId: undefined,
  clsId: undefined,
  clsName: undefined,
  barcodeNo: undefined,
  goodsName: undefined,
  orderUnitName: undefined,
  orderQty1: undefined,
  orderQty2: undefined,
  orderQty3: undefined,
  orderQty4: undefined,
  orderQty5: undefined,
  orderQty6: undefined,
  realQty1: undefined,
  realQty2: undefined,
  realQty3: undefined,
  realQty4: undefined,
  realQty5: undefined,
  realQty6: undefined,
}
const data = reactive<PageData<PodetailForm, PodetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 50,
    sheetId: undefined,
    goodsId: undefined,
    clsId: undefined,
    clsName: undefined,
    barcodeNo: undefined,
    goodsName: undefined,
    orderUnitName: undefined,
    orderQty1: undefined,
    orderQty2: undefined,
    orderQty3: undefined,
    orderQty4: undefined,
    orderQty5: undefined,
    orderQty6: undefined,
    realQty1: undefined,
    realQty2: undefined,
    realQty3: undefined,
    realQty4: undefined,
    realQty5: undefined,
    realQty6: undefined,
    params: {
    }
  },
  rules: {
    sheetCode: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    sheetId: [
      { required: true, message: "主表id不能为空", trigger: "blur" }
    ],
    goodsId: [
      { required: true, message: "商品id不能为空", trigger: "blur" }
    ],
    clsId: [
      { required: true, message: "类别id不能为空", trigger: "blur" }
    ],
    /*
    clsName: [
      { required: true, message: "类别名称不能为空", trigger: "blur" }
    ],
    barcodeNo: [
      { required: true, message: "条码不能为空", trigger: "blur" }
    ],
    goodsName: [
      { required: true, message: "品名不能为空", trigger: "blur" }
    ],
    orderUnitName: [
      { required: true, message: "要货单位不能为空", trigger: "blur" }
    ],
    orderQty1: [
      { required: true, message: "万不能为空", trigger: "blur" }
    ],
    orderQty2: [
      { required: true, message: "县不能为空", trigger: "blur" }
    ],
    orderQty3: [
      { required: true, message: "公不能为空", trigger: "blur" }
    ],
    orderQty4: [
      { required: true, message: "中不能为空", trigger: "blur" }
    ],
    orderQty5: [
      { required: true, message: "稼不能为空", trigger: "blur" }
    ],
    orderQty6: [
      { required: true, message: "云不能为空", trigger: "blur" }
    ],
    realQty1: [
      { required: true, message: "万不能为空", trigger: "blur" }
    ],
    realQty2: [
      { required: true, message: "县不能为空", trigger: "blur" }
    ],
    realQty3: [
      { required: true, message: "公不能为空", trigger: "blur" }
    ],
    realQty4: [
      { required: true, message: "中不能为空", trigger: "blur" }
    ],
    realQty5: [
      { required: true, message: "稼不能为空", trigger: "blur" }
    ],
    realQty6: [
      { required: true, message: "云不能为空", trigger: "blur" }
    ],
     */
  }
});

const { queryParams, form, rules } = toRefs(data);

// watchEffect(
//     () => { goodsinfoRef.value?.filter(clsName.value); },
//     {
//       flush: 'post' // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
//     }
// );
const handleNodeChange = (value: number) => {
  console.log(value)
  const list: GoodsinfoVO[] = goodsinfoOptions.value.filter((item) => item.goodsId === value)
  form.value.clsId = list[0].clsId;
  // form.value.clsName = "";
  form.value.goodsName = list[0].goodsName;
  form.value.barcodeNo = list[0].barcodeNo;
  form.value.orderUnitName = list[0].unitName;
}
const getGoodsinfoOptions = async () => {
  const res = await goodsInfoOptionSelect();
  console.log(res)
  const data = proxy?.handleTree<GoodsinfoVO>(res.data, "goodsId")
  if (data) {
    goodsinfoOptions.value = data
  }
  console.log('goodsinfoOptions: ', goodsinfoOptions.value)
};
const getGoodsclsOptions = async () => {
  const res = await listGoodscls();
  console.log(res)
  const data = proxy?.handleTree<GoodsclsVO>(res.data, "clsId")
  if (data) {
    goodsclsOptions.value = data
  }
  console.log(goodsclsOptions.value)
};

const getSheets = async (value: number) => {
  queryParams.value.sheetId = value;
  getList();
}

const getPomasterData = async (value: string | number) => {
  // loading.value = true;
  const res = await getPomaster(value);
  // console.log('getPomasterData: ', res)
  pomaster.value = res.data;
  console.log('getPomasterData: ', pomaster.value)
}

/** 查询订单数据列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPodetail(queryParams.value);
  podetailList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  podetailFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: PodetailVO[]) => {
  ids.value = selection.map(item => item.sheetCode);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加订单数据";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: PodetailVO | undefined) => {
  /*reset();
  const _sheetCode = row?.sheetCode || ids.value[0]
  const res = await getPodetail(_sheetCode);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改订单数据";*/
  if(row === undefined)
    return;
  let ele = Object.assign({}, row);
  if(!checkPermi(['po:pomaster:edit1'])){
    ele.orderQty1 = undefined;
  }
  if(!checkPermi(['po:pomaster:edit2'])){
    ele.orderQty2 = undefined;
  }
  if(!checkPermi(['po:pomaster:edit3'])){
    ele.orderQty3 = undefined;
  }
  if(!checkPermi(['po:pomaster:edit4'])){
    ele.orderQty4 = undefined;
  }
  if(!checkPermi(['po:pomaster:edit5'])){
    ele.orderQty5 = undefined;
  }
  if(!checkPermi(['po:pomaster:edit6'])){
    ele.orderQty6 = undefined;
  }
  if(!checkPermi(['po:pomaster:edit-real'])){
    ele.realQty1 = undefined;
    ele.realQty2 = undefined;
    ele.realQty3 = undefined;
    ele.realQty4 = undefined;
    ele.realQty5 = undefined;
    ele.realQty6 = undefined;
  }
  await updatePodetailData(ele).finally(() =>  buttonLoading.value = false);
  proxy?.$modal.msgSuccess("修改成功");
}

const handleUpdateList = async (/*list: PodetailVO[] | undefined*/) => {
  /*reset();
  const _sheetCode = row?.sheetCode || ids.value[0]
  const res = await getPodetail(_sheetCode);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改订单数据";*/
  // if(podetailList === undefined)
  //   return;
  //[...podetailList.value] [].concat(podetailList.value); // podetailList.value.slice(); // Array.from(podetailList.value); // podetailList.value.slice();
  // let list: PodetailVO[] = podetailList.value.slice();
  const list: PodetailVO[] = [];
  for (let i = 0; i < podetailList.value.length; i++) {
    list[i] = Object.assign({}, podetailList.value[i]);// podetailList.value[i];
  }
  list.forEach((ele) => {
    if(!checkPermi(['po:pomaster:edit1'])){
      ele.orderQty1 = undefined;
    }
    if(!checkPermi(['po:pomaster:edit2'])){
      ele.orderQty2 = undefined;
    }
    if(!checkPermi(['po:pomaster:edit3'])){
      ele.orderQty3 = undefined;
    }
    if(!checkPermi(['po:pomaster:edit4'])){
      ele.orderQty4 = undefined;
    }
    if(!checkPermi(['po:pomaster:edit5'])){
      ele.orderQty5 = undefined;
    }
    if(!checkPermi(['po:pomaster:edit6'])){
      ele.orderQty6 = undefined;
    }
    if(!checkPermi(['po:pomaster:edit-real'])){
      ele.realQty1 = undefined;
      ele.realQty2 = undefined;
      ele.realQty3 = undefined;
      ele.realQty4 = undefined;
      ele.realQty5 = undefined;
      ele.realQty6 = undefined;
    }

  })
  // list[0].orderQty1 = 99;
  console.log(list[0].orderQty1, list[0].orderQty2, podetailList.value[0].orderQty1, podetailList.value[0].orderQty2)

  await updatePodetailList(list).finally(() =>  buttonLoading.value = false);
  proxy?.$modal.msgSuccess("修改成功");

  getList();
}
/** 提交按钮 */
const submitForm = () => {
  podetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.sheetCode) {
        await updatePodetail(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        form.value.sheetId = queryParams.value.sheetId;
        await addPodetail(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: PodetailVO) => {
  const _sheetCodes = row?.sheetCode || ids.value;
  await proxy?.$modal.confirm('是否确认删除订单数据编号为"' + _sheetCodes + '"的数据项？').finally(() => loading.value = false);
  await delPodetail(_sheetCodes);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('po/podetail/export', {
    ...queryParams.value
  }, `podetail_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getGoodsclsOptions();
  getGoodsinfoOptions();

  sheetId.value = route.params && route.params.sheetId as unknown as number
  if(sheetId === undefined)
    return
  getPomasterData(sheetId.value)
  getSheets(sheetId.value);
  // getList();

});
</script>
<style>
.success-row {
  background: #f0f9eb !important;
}
</style>
