<template>
  <div class="p-2">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" style="">
        <el-card shadow="hover">
          <el-input v-model="clsName" placeholder="请输入类别名称" prefix-icon="Search" clearable />
          <el-tree
              class="mt-2"
              ref="clsTreeRef"
              node-key="clsId"
              :data="goodsclsOptions"
              :props="{ label: 'clsName', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>

      <el-col :lg="20" :xs="24">

        <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
          <div class="search" v-show="showSearch">
            <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
              <el-form-item label="条码" prop="barcodeNo">
                <el-input v-model="queryParams.barcodeNo" placeholder="请输入条码" clearable style="width: 240px" @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="品名" prop="goodsName">
                <el-input v-model="queryParams.goodsName" placeholder="请输入品名" clearable style="width: 240px" @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="状态" clearable>
                  <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>

        <el-card shadow="never">
          <template #header>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['po:goodsinfo:add']">新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['po:goodsinfo:edit']">修改</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['po:goodsinfo:remove']">删除</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['po:goodsinfo:export']">导出</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
          </template>

          <el-table v-loading="loading" :data="goodsinfoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
<!--            <el-table-column label="主键" align="center" prop="goodsId" v-if="true" />-->
            <el-table-column label="显示顺序" align="center" prop="orderNum" />
<!--            <el-table-column label="类别id" align="center" prop="clsId" />-->
            <el-table-column label="类别" align="center" prop="goodsClsVo.clsName" />
            <el-table-column label="条码" align="center" prop="barcodeNo" />
            <el-table-column label="品名" align="center" prop="goodsName" />
            <el-table-column label="单位" align="center" prop="unitName" />
            <el-table-column label="进价" align="center" prop="cost" />
            <el-table-column label="售价" align="center" prop="price" />
<!--            <el-table-column label="图片网址" align="center" prop="imgUrl" />-->
            <el-table-column label="图片" align="center" prop="imgUrl">
              <template #default="scope">
                <ImagePreview
                    :width="100"
                    :height="100"
                    :src="scope.row.imgUrl"
                    :preview-src-list="[scope.row.imgUrl]"
                />
                <!--                <span v-text="scope.row.imgUrl"/>-->
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-tooltip content="修改" placement="top">
                  <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['po:goodsinfo:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['po:goodsinfo:remove']"></el-button>
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

      </el-col>
    </el-row>
    <!-- 添加或修改商品资料对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="goodsinfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="条码" prop="barcodeNo">
              <el-input v-model="form.barcodeNo" placeholder="请输入条码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" placeholder="请输入显示顺序" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="品名" prop="goodsName">
              <el-input v-model="form.goodsName" placeholder="请输入品名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别" prop="clsId">
              <!--              <el-input v-model="form.clsId" placeholder="请输入类别id" />-->
              <el-tree-select
                  v-model="form.clsId"
                  :data="goodsclsOptions"
                  :props="{ value: 'clsId', label: 'clsName', children: 'children' }"
                  value-key="clsId"
                  placeholder="请输入类别"
                  check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unitName">
              <el-input v-model="form.unitName" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进价" prop="cost">
              <el-input v-model="form.cost" placeholder="请输入进价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售价" prop="price">
              <el-input v-model="form.price" placeholder="请输入售价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                  }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" prop="imgUrl">
              <el-input v-model="form.imgUrl" placeholder="请输入图片地址" />
            </el-form-item>
          </el-col>
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

<script setup name="Goodsinfo" lang="ts">
import { listGoodsinfo, getGoodsinfo, delGoodsinfo, addGoodsinfo, updateGoodsinfo } from '@/api/po/goodsinfo';
import { GoodsinfoVO, GoodsinfoQuery, GoodsinfoForm } from '@/api/po/goodsinfo/types';
import {GoodsclsVO} from "@/api/po/goodscls/types";
import {listGoodscls} from "@/api/po/goodscls";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const {sys_normal_disable} = toRefs<any>(proxy?.useDict("sys_normal_disable"));

const goodsinfoList = ref<GoodsinfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

// const merchantName = ref('');
// const merchantOptions = ref<MerchantVO[]>([]);
const clsName = ref('')
const goodsclsOptions = ref<GoodsclsVO[]>([])

const clsTreeRef = ref<ElTreeInstance>();
const queryFormRef = ref<ElFormInstance>();
const goodsinfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: GoodsinfoForm = {
  goodsId: undefined,
  orderNum: 0,
  clsId: undefined,
  barcodeNo: undefined,
  goodsName: undefined,
  unitName: undefined,
  cost: 0.00,
  price: 0.00,
  status: '0',
  imgUrl: undefined
}
const data = reactive<PageData<GoodsinfoForm, GoodsinfoQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNum: undefined,
    clsId: undefined,
    barcodeNo: undefined,
    goodsName: undefined,
    unitName: undefined,
    cost: undefined,
    price: undefined,
    imgUrl: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {
    goodsId: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    orderNum: [
      { required: true, message: "显示顺序不能为空", trigger: "blur" }
    ],
    clsId: [
      { required: true, message: "类别id不能为空", trigger: "blur" }
    ],
    barcodeNo: [
      { required: true, message: "条码不能为空", trigger: "blur" }
    ],
    goodsName: [
      { required: true, message: "品名不能为空", trigger: "blur" }
    ],
    unitName: [
      { required: true, message: "单位不能为空", trigger: "blur" }
    ],
    cost: [
      { required: true, message: "进价不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "售价不能为空", trigger: "blur" }
    ],
    // imgUrl: [
    //   { required: false, message: "图片网址未填写", trigger: "blur" }
    // ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);


/** 通过条件过滤节点  */
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

/** 根据名称筛选部门树 */
watchEffect(
    () => { clsTreeRef.value?.filter(clsName.value); },
    {
      flush: 'post' // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
    }
);

const getTreeSelect = async () => {
  const res = await listGoodscls();
  console.log(res)
  const data = proxy?.handleTree<GoodsclsVO>(res.data, "clsId")
  if (data) {
    goodsclsOptions.value = data
  }
  console.log(goodsclsOptions.value)
};


/** 节点单击事件 */
const handleNodeClick = (data: GoodsclsVO) => {
  queryParams.value.clsId = data.clsId;
  handleQuery()
}
/** 查询商品资料列表 */
const getList = async () => {
  loading.value = true;
  const res = await listGoodsinfo(queryParams.value);
  goodsinfoList.value = res.rows;
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
  goodsinfoFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: GoodsinfoVO[]) => {
  ids.value = selection.map(item => item.goodsId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加商品资料";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: GoodsinfoVO) => {
  reset();
  const _goodsId = row?.goodsId || ids.value[0]
  const res = await getGoodsinfo(_goodsId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商品资料";
}

/** 提交按钮 */
const submitForm = () => {
  goodsinfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.goodsId) {
        await updateGoodsinfo(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addGoodsinfo(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: GoodsinfoVO) => {
  const _goodsIds = row?.goodsId || ids.value;
  await proxy?.$modal.confirm('是否确认删除商品资料编号为"' + _goodsIds + '"的数据项？').finally(() => loading.value = false);
  await delGoodsinfo(_goodsIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('po/goodsinfo/export', {
    ...queryParams.value
  }, `goodsinfo_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getTreeSelect();
  getList();
});
</script>
