<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="queryCond.comFlag" clearable placeholder="完成情况">
              <el-option
                v-for="item in comFlag"
                :key="item.comFlag"
                :label="item.label"
                :value="item.comFlag">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-input placeholder="名称、编号、关联人名称" v-model="queryCond.commonCondition"></el-input>
        </el-form-item>
        <el-form-item>
           <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :height="tableHeight" :data="tableList" v-loading="listLoading" border element-loading-text="拼命加载中" style="width: 100%;" :row-class-name="tableRowClassName" :highlight-current-row="true">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="官兵掌握情况" >
              <span>{{ props.row.knowDesc }}</span>
            </el-form-item>
            <el-form-item label="对应记录">
              <span>{{ props.row.recordDesc }}</span>
            </el-form-item>
            <el-form-item label="笔记">
              <span>{{ props.row.workNote }}</span>
            </el-form-item>
            <el-form-item label="要事日记">
              <span>{{ props.row.impNote }}</span>
            </el-form-item>
            <el-form-item label="本级落实措施">
              <span>{{ props.row.impWay }}</span>
            </el-form-item>
            <el-form-item label="应知应会">
              <span>{{ props.row.shouldKnow }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="rowId" label="系统编号" width="80px">
      </el-table-column>
      <el-table-column prop="workName" width="200px" label="文件/活动/通知名称">
      </el-table-column>
      <el-table-column prop="workCode" label="编号" width="120px">
      </el-table-column>
      <el-table-column prop="receiveTime" :formatter="dateFormat" label="时间" width="100">
      </el-table-column>
      <el-table-column prop="sendUserName" label="发件人"  width="65">
      </el-table-column>
      <el-table-column prop="receiveUserName" label="接收人"  width="65">
      </el-table-column>
      <el-table-column prop="impUserName" label="落实人"  width="65">
      </el-table-column>
      <el-table-column prop="respUserName" label="责任人"  width="65">
      </el-table-column>
      <el-table-column prop="limitTime" :formatter="dateFormat" label="完成时限" width="100">
      </el-table-column>
      <el-table-column  label="完成标识" width="80" >
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.comFlag | comFlagFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.comFlag == 0">未完成</el-tag>
          <el-tag size="small"  :type="scope.row.comFlag | comFlagFilter" @click="isStatus(scope.$index, scope.row)" v-if="scope.row.comFlag == 1">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作 " width="200">
        <template slot-scope="scope" >
         <el-button size="small" type="primary"  @click="handleUpdate(scope.row)">编辑</el-button>
         <el-button size="small" type="primary"  @click="attachManager(scope.row)">附件</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-pagination layout="total, prev, pager, next"
                    background
                    :page-size="queryCond.pageSize"
                    @size-change="handleSizeChange"
                    :total="total"
                    @current-change="handleCurrentChange"
                    style="text-align:center;">
    </el-pagination>

    <!-- 新增编辑 -->
    <el-dialog title="编辑" :visible.sync="isShowEditVisible"  :modal-append-to-body='false' width='80%' fullscreen>
      <el-form label-width="120px" :model="temp" ref="dataForm" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12" >
            <el-form-item label="名称" prop="workName">
              <el-input v-model="temp.workName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="workCode">
              <el-input v-model="temp.workCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时间" prop="receiveTime">
              <el-date-picker v-model="temp.receiveTime" type="date" placeholder="选择时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成期限" prop="limitTime">
              <el-date-picker v-model="temp.limitTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="官兵掌握情况" prop="knowDesc">
          <el-input v-model="temp.knowDesc"></el-input>
        </el-form-item>
        <el-form-item label="对应记录" prop="recordDesc">
          <el-input v-model="temp.recordDesc"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="发件人" prop="sendUserName">
              <el-input v-model="temp.sendUserName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接收人" prop="receiveUserName">
              <el-input v-model="temp.receiveUserName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="落实人" prop="impUserName">
              <el-input v-model="temp.impUserName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="责任人" prop="respUserName">
              <el-input v-model="temp.respUserName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="笔记" prop="workNote">
          <el-input v-model="temp.workNote"></el-input>
        </el-form-item>
        <el-form-item label="要事日记" prop="impNote">
          <el-input v-model="temp.impNote"></el-input>
        </el-form-item>
        <el-form-item label="本级落实措施" prop="impWay">
          <el-input v-model="temp.impWay"></el-input>
        </el-form-item>
        <el-form-item label="应知应会" prop="shouldKnow">
          <el-input v-model="temp.shouldKnow"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="重要程度" v-model="temp.impFlag">
              <el-select v-model="temp.impFlag" placeholder="重要程度">
                <el-option v-for="item in impFlag"
                       :label="item.label"
                       :value="item.impFlag"
                       :key="item.impFlag"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="完成情况" v-model="temp.comFlag">
              <el-select v-model="temp.comFlag" placeholder="完成情况">
                <el-option v-for="item in comFlag"
                       :label="item.label"
                       :value="item.comFlag"
                       :key="item.comFlag"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEditVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="updateData" class="title1">保存</el-button>
      </div>
    </el-dialog>

    <!-- 附件编辑 -->
    <el-dialog title="附件管理" :visible.sync="isShowAttachVisible"  :modal-append-to-body='false' width='50%'>
      <el-tabs type="border-card">
        <el-tab-pane label="上传材料">
          <el-upload class="upload-demo"
            action="/api/affix/public/uploads"
            :data="{businessId: temp.rowId,businessCode: 'BN_WORK_TRACK', affixType: '上报材料'}"
            :on-success="uploadSuccess"
            :on-preview="previewFile"
            :on-remove="deleteFileLocal"
            :file-list="fileList.上报材料">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传文件大小不能超过100M</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="视频照片">
          <el-upload class="upload-demo"
            action="/api/affix/public/uploads"
            :data="{businessId: temp.rowId,businessCode: 'BN_WORK_TRACK', affixType: '视频照片'}"
            :on-success="uploadSuccess"
            :on-preview="previewFile"
            :on-remove="deleteFileLocal"
            :file-list="fileList.视频照片">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传文件大小不能超过100M</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="新闻稿">
          <el-upload class="upload-demo"
            action="/api/affix/public/uploads"
            :data="{businessId: temp.rowId,businessCode: 'BN_WORK_TRACK', affixType: '新闻稿'}"
            :on-success="uploadSuccess"
            :on-preview="previewFile"
            :on-remove="deleteFileLocal"
            :file-list="fileList.新闻稿">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传文件大小不能超过100M</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="相关资料">
          <el-upload class="upload-demo"
            action="/api/affix/public/uploads"
            :data="{businessId: temp.rowId,businessCode: 'BN_WORK_TRACK', affixType: '相关资料'}"
            :on-success="uploadSuccess"
            :on-preview="previewFile"
            :on-remove="deleteFileLocal"
            :file-list="fileList.相关资料">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传文件大小不能超过100M</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="其他">
          <el-upload class="upload-demo"
            action="/api/affix/public/uploads"
            :data="{businessId: temp.rowId,businessCode: 'BN_WORK_TRACK', affixType: '其他'}"
            :on-success="uploadSuccess"
            :on-preview="previewFile"
            :on-remove="deleteFileLocal"
            :file-list="fileList.其他">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传文件大小不能超过100M</div>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAttachVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      width="30%">
      <span>确认删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
    white-space: nowrap;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .form-content {
    margin: 20px;
  }
  /* .current-row > td {
    background: #218af3 !important;
  } */
  .el-table .important-row {
    background: #FFF68F !important;
  }
  tr:hover > td{background-color: #D4D4D4 !important}
</style>

<script>
import { queryList, updateOne } from '@/api/worktrack'
import { queryFile, deleteFile } from '@/api/file'
import moment from 'moment'
export default {
  data() {
    return {
      tableHeight: 500,
      tableList: [],
      listLoading: true,
      queryCond: { pageNum: 1, pageSize: 10, originFlag: 1,
        comFlag: '',
        commonCondition: ''
      },
      isShowEditVisible: false,
      isShowAttachVisible: false,
      deleteVisible: false,
      blankData: {
        rowId: '',
        originFlag: '',
        workCode: '',
        workName: '',
        receiveTime: '',
        knowDesc: '',
        recordDesc: '',
        sendUserName: '',
        receiveUserName: '',
        impUserName: '',
        limitTime: '',
        respUserName: '',
        workNote: '',
        impNote: '',
        impWay: '',
        shouldKnow: '',
        impFlag: '',
        comFlag: '',
        remark: ''
      },
      temp: {
        rowId: '',
        originFlag: '',
        workCode: '',
        workName: '',
        receiveTime: '',
        knowDesc: '',
        recordDesc: '',
        sendUserName: '',
        receiveUserName: '',
        impUserName: '',
        limitTime: '',
        respUserName: '',
        workNote: '',
        impNote: '',
        impWay: '',
        shouldKnow: '',
        impFlag: '',
        comFlag: '',
        remark: ''
      },
      total: 0,
      comFlag: [
        {
          comFlag: '1',
          label: '已完成'
        }, {
          comFlag: '0',
          label: '未完成'
        }
      ],
      impFlag: [
        {
          impFlag: '1',
          label: '重要'
        }, {
          impFlag: '0',
          label: '普通'
        }
      ],
      fileList: {
        上报材料: [],
        视频照片: [],
        新闻稿: [],
        相关资料: [],
        其他: []
      },
      filterTableDataEnd: []
    }
  },
  mounted() {
    this.queryCond.originFlag = this.$route.name
    this.blankData.originFlag = this.$route.name
    this.fetchData()
    // this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 80
    // window.innerHeight是浏览器可用高度，this.$refs.table.$el.offsetTop是表格距离浏览器可用高度顶部的距离
  },
  created() {
  },
  filters: {
    comFlagFilter(comFlag) {
      const statusMap = {
        0: 'danger',
        1: 'success'
      }
      return statusMap[comFlag]
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      queryList(this.queryCond).then(response => {
        this.total = response.total
        this.tableList = response.records
        this.listLoading = false
      })
    },
    doFilter() {
      this.fetchData()
    },
    clickfun(e) {
      console.log(e.target.innerText)
    },
    handleAdd() {
      this.isShowEditVisible = true
      this.temp = Object.assign({}, this.blankData)
    },
    handleUpdate(row) {
      this.isShowEditVisible = true
      this.temp = Object.assign({}, row)
      console.log(row)
    },
    attachManager(row) {
      this.temp = Object.assign({}, row)
      this.queryFileLocal({ businessId: this.temp.rowId, businessCode: 'BN_WORK_TRACK' })
      this.isShowAttachVisible = true
      console.log(row)
    },
    deleteUpdate(row) {
      console.log(row)
      this.deleteVisible = true
      this.temp = Object.assign({}, row)
      // console.log(row)
    },
    submitDelete() {
      const tempData = Object.assign({}, this.temp)
      console.log(tempData)
      console.log(this.tableList)
      for (const v of this.tableList) {
        if (v.uid === this.temp.uid) {
          const index = this.tableList.indexOf(v)
          this.tableList.splice(index, 1)
          this.fetchData()
          console.log(this.tableList)
          break
        }
      }
      this.deleteVisible = false
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      console.log(row)
      row.status = status
    },
    updateData() {
      const tempData = Object.assign({}, this.temp)
      console.log(tempData)
      updateOne(tempData).then(() => {
        this.fetchData()
        this.isShowEditVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSizeChange(val) {
      this.queryCond.pageNum = val
      console.log(this.queryCond.pageNum)
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryCond.pageNum = val
      console.log(this.queryCond.pageNum)
      this.fetchData()
    },
    currentChangePage(list) {
      let from = (this.queryCond.pageNum - 1) * this.pageSize
      const to = this.queryCond.pageNum * this.pageSize
      this.tableList = []
      for (; from < to; from++) {
        if (list[from]) {
          this.tableList.push(list[from])
        }
      }
    },
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD')
    },
    tableRowClassName({ row, rowIndex }) {
      var impFlag = row['impFlag']
      var style = ''
      if (impFlag === '1') {
        style = 'important-row'
      }
      return style
    },
    uploadSuccess(response, file, fileList) {
      if (!(response.returnValue && response.returnValue < 0)) {
        this.queryFileLocal({ businessId: this.temp.businessId, businessCode: this.temp.businessCode })
      }
    },
    previewFile(file) {
      window.open(file.path, '_blank', 'toolbar=yes, width=1300, height=900')
    },
    queryFileLocal: function(condition) {
      queryFile(condition).then(response => {
        this.fileList.上报材料 = []
        this.fileList.上报材料 = []
        this.fileList.视频照片 = []
        this.fileList.新闻稿 = []
        this.fileList.相关资料 = []
        this.fileList.其他 = []
        for (var i = 0; i < response.length; i++) {
          var file = { rowId: response[i].rowId, name: response[i].fileName, path: 'http://' + document.domain + ':9000/' + response[i].filePath }
          this.fileList[response[i].affixType].push(file)
        }
      })
    },
    deleteFileLocal: function(file, fileList) {
      deleteFile(file.rowId).then(response => {
        if (response.returnValue > 0) {
          this.$message('删除成功')
        } else {
          this.$message('删除失败')
        }
      })
    }
  },
  computed: {
    // TODO
  },
  watch: {
    // 监听路由，只要路由有变化(路径，参数等变化)都有执行下面的函数，你可以
    $route: {
      handler: function(val, oldVal) {
        this.queryCond.originFlag = this.$route.name
        this.blankData.originFlag = this.$route.name
        this.fetchData()
      },
      deep: true
    }
  }
}
</script>