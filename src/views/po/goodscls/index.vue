<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="父类别id" prop="parentId">
            <el-input v-model="queryParams.parentId" placeholder="请输入父类别id" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="显示顺序" prop="orderNum">
            <el-input v-model="queryParams.orderNum" placeholder="请输入显示顺序" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="名称" prop="clsName">
            <el-input v-model="queryParams.clsName" placeholder="请输入名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd()" v-hasPermi="['po:goodscls:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="handleToggleExpandAll">展开/折叠</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>
      <el-table
        v-loading="loading"
        :data="goodsclsList"
        row-key="clsId"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        ref="goodsclsTableRef"
      >
        <el-table-column label="父类别id" align="center" prop="parentId" />
        <el-table-column label="显示顺序" align="center" prop="orderNum" />
        <el-table-column label="名称" align="center" prop="clsName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['po:goodscls:edit']" />
            </el-tooltip>
            <el-tooltip content="新增" placement="top">
              <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['po:goodscls:add']" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['po:goodscls:remove']" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改商品类别对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="goodsclsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父类别id" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="goodsclsOptions"
            :props="{ value: 'clsId', label: 'clsName', children: 'children' }"
            value-key="clsId"
            placeholder="请选择父类别id"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
        </el-form-item>
        <el-form-item label="名称" prop="clsName">
          <el-input v-model="form.clsName" placeholder="请输入名称" />
        </el-form-item>
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

<script setup name="Goodscls" lang="ts">
import { listGoodscls, getGoodscls, delGoodscls, addGoodscls, updateGoodscls } from "@/api/po/goodscls";
import { GoodsclsVO, GoodsclsQuery, GoodsclsForm } from '@/api/po/goodscls/types';

type GoodsclsOption = {
  clsId: number;
  clsName: string;
  children?: GoodsclsOption[];
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance;;


const goodsclsList = ref<GoodsclsVO[]>([]);
const goodsclsOptions = ref<GoodsclsOption[]>([]);
const buttonLoading = ref(false);
const showSearch = ref(true);
const isExpandAll = ref(true);
const loading = ref(false);

const queryFormRef = ref<ElFormInstance>();
const goodsclsFormRef = ref<ElFormInstance>();
const goodsclsTableRef = ref<ElTableInstance>()

const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
});


const initFormData: GoodsclsForm = {
    clsId: undefined,
    parentId: undefined,
    orderNum: undefined,
    clsName: undefined,
}

const data = reactive<PageData<GoodsclsForm, GoodsclsQuery>>({
  form: {...initFormData},
  queryParams: {
    parentId: undefined,
    orderNum: undefined,
    clsName: undefined,
    params: {
    }
  },
  rules: {
    clsId: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    parentId: [
      { required: true, message: "父类别id不能为空", trigger: "blur" }
    ],
    orderNum: [
      { required: true, message: "显示顺序不能为空", trigger: "blur" }
    ],
    clsName: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商品类别列表 */
const getList = async () => {
  loading.value = true;
  const res = await listGoodscls(queryParams.value);
  const data = proxy?.handleTree<GoodsclsVO>(res.data, "clsId", "parentId");
  if (data) {
    goodsclsList.value = data;
    loading.value = false;
  }
}

/** 查询商品类别下拉树结构 */
const getTreeselect = async () => {
  const res = await listGoodscls();
  goodsclsOptions.value = [];
  const data: GoodsclsOption = { clsId: 0, clsName: '顶级节点', children: [] };
  data.children = proxy?.handleTree<GoodsclsOption>(res.data, "clsId", "parentId");
  goodsclsOptions.value.push(data);
}

// 取消按钮
const cancel = () => {
  reset();
  dialog.visible = false;
}

// 表单重置
const reset = () => {
  form.value = {...initFormData}
  goodsclsFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 新增按钮操作 */
const handleAdd = (row?: GoodsclsVO) => {
  reset();
  getTreeselect();
  if (row != null && row.clsId) {
      form.value.parentId = row.clsId;
  } else {
      form.value.parentId = 0;
  }
  dialog.visible = true;
  dialog.title = "添加商品类别";
}

/** 展开/折叠操作 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
  toggleExpandAll(goodsclsList.value, isExpandAll.value)
}

/** 展开/折叠操作 */
const toggleExpandAll = (data: GoodsclsVO[], status: boolean) => {
  data.forEach((item) => {
    goodsclsTableRef.value?.toggleRowExpansion(item, status)
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status)
  })
}

/** 修改按钮操作 */
const handleUpdate = async (row: GoodsclsVO) => {
  reset();
  await getTreeselect();
  if (row != null) {
    form.value.parentId = row.parentId;
  }
  const res = await getGoodscls(row.clsId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商品类别";
}

/** 提交按钮 */
const submitForm = () => {
  goodsclsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.clsId) {
        await updateGoodscls(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addGoodscls(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row: GoodsclsVO) => {
  await proxy?.$modal.confirm('是否确认删除商品类别编号为"' + row.clsId + '"的数据项？');
  loading.value = true;
  await delGoodscls(row.clsId).finally(() => loading.value = false);
  await getList();
  proxy?.$modal.msgSuccess("删除成功");
}

onMounted(() => {
  getList();
});
</script>
