<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="单据状态" prop="sheetStatus">
            <el-select v-model="queryParams.sheetStatus" placeholder="请选择单据状态" clearable>
              <el-option
                v-for="dict in sheet_po_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" style="width: 308px">
            <el-date-picker
                v-model="dateRangeCreateTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
            />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['po:pomaster:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['po:pomaster:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['po:pomaster:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['po:pomaster:export']">导出</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleCopy()" v-hasPermi="['po:pomaster:add']">复制选中的单据</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="pomasterList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="sheetId" v-if="true">
          <template #default="scope">
            <router-link :to="'/po/po-data/index/' + scope.row.sheetId" class="link-type">
              <span>{{ scope.row.sheetId }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" align="center" prop="sheetStatus">
          <template #default="scope">
            <dict-tag :options="sheet_po_status" :value="scope.row.sheetStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['po:pomaster:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['po:pomaster:remove']"></el-button>
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
    <!-- 添加或修改采购订单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="pomasterFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单据状态" prop="sheetStatus">
          <el-radio-group v-model="form.sheetStatus">
            <el-radio
                v-for="dict in sheet_po_status"
                :key="dict.value"
                :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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

<script setup name="Pomaster" lang="ts">
import {listPomaster, getPomaster, delPomaster, addPomaster, updatePomaster, copyPomaster} from '@/api/po/pomaster';
import { PomasterVO, PomasterQuery, PomasterForm } from '@/api/po/pomaster/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sheet_po_status } = toRefs<any>(proxy?.useDict('sheet_po_status'));

const pomasterList = ref<PomasterVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);


const queryFormRef = ref<ElFormInstance>();
const pomasterFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: PomasterForm = {
  sheetId: undefined,
  sheetStatus: undefined,
  remark: undefined,
}
const data = reactive<PageData<PomasterForm, PomasterQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sheetStatus: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
    sheetId: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    sheetStatus: [
      { required: true, message: "单据状态不能为空", trigger: "change" }
    ],
    remark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);


// 获取当前日期
const getToday = () =>{
  //获取当前日期
  let myDate = new Date();

  let nowY = myDate.getFullYear();
  let nowM = myDate.getMonth() + 1;
  let nowD = myDate.getDate();
  let endDate =
      nowY +
      "-" +
      (nowM < 10 ? "0" + nowM : nowM) +
      "-" +
      (nowD < 10 ? "0" + nowD : nowD) + " 23:59:59"; //当前日期
  return endDate;
};

// 获取三十天之前的日期
const getThreeDaysAgo = () => {
  const myDate: any = new Date();
  let lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30); //最后一个数字30可改，30天的意思
  let lastY = lw.getFullYear();
  let lastM = lw.getMonth() + 1;
  let lastD = lw.getDate();
  let startData =
      lastY +
      "-" +
      (lastM < 10 ? "0" + lastM : lastM) +
      "-" +
      (lastD < 10 ? "0" + lastD : lastD) + " 00:00:00"; //三十天之前日期
  return startData;
};
/** 查询采购订单列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listPomaster(queryParams.value);
  pomasterList.value = res.rows;
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
  pomasterFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: PomasterVO[]) => {
  ids.value = selection.map(item => item.sheetId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加采购订单";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: PomasterVO) => {
  reset();
  const _sheetId = row?.sheetId || ids.value[0]
  const res = await getPomaster(_sheetId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改采购订单";
}


const handleCopy = async (row?: PomasterVO) => {
  const _sheetId = row?.sheetId || ids.value[0]
  await copyPomaster(_sheetId);
  proxy?.$modal.msgSuccess("复制成功");
  getList();
}
/** 提交按钮 */
const submitForm = () => {
  pomasterFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.sheetId) {
        await updatePomaster(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addPomaster(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: PomasterVO) => {
  const _sheetIds = row?.sheetId || ids.value;
  await proxy?.$modal.confirm('是否确认删除采购订单编号为"' + _sheetIds + '"的数据项？').finally(() => loading.value = false);
  await delPomaster(_sheetIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('po/pomaster/export', {
    ...queryParams.value
  }, `pomaster_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});

const dateRangeCreateTime = ref<[DateModelType, DateModelType]>([getThreeDaysAgo(), getToday()]);
</script>
