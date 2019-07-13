<template>
  <div id="app" class="bg">
    <div class="title">
      <h3 class="title-center">{{$t('title')}}</h3>
      <div class="title-right">
        <digital-clock 
        class="clock"
        :blink="true"
        :displaySeconds="true"
        :twelveHour="false"/>
        <Dropdown :transfer="true" @on-click="handleSelectedLang">
          <a href="javascript:void(0)" style="color:#19be6b;">
              {{languageName}}
              <Icon color="#19be6b" type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
              <DropdownItem v-for="item of $supportLang" :name="item.key" :key="item.key">{{item.value}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div>
          <a :href="githubURL">
            <svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
          </a>
        </div>
      </div>
    </div>
    <Modal v-model="showMarkdownModel" fullscreen :title="$t('title_build_md')" >
      <markdown v-model="mdData" ref="md" class="md" />
    </Modal>
    <Modal v-model="showDescModel" draggable scrollable :title="$t('btn_add_description')">
      <h6>请把描述字段值用“->”分割，如: 项目ID->节点ID->项目名称->项目全名->暂无->暂无->地址->描述信息</h6>
      <Input v-model="inputFillText" @on-change="fillDesc($event.target.value)" />
    </Modal>
    <Modal v-model="showPlayModel" :title="$t('voide_tutorial')" width="1000">
      <video
        autoplay
        controls
        width="100%"
        ref="video"
        @playing="handleVideoPlay"
        @ended="handleVideoEnd"
      >
        <source :src="playURL" type="video/mp4" />Sorry, your browser doesn't support embedded videos.
      </video>
    </Modal>
    <Modal v-model="showHeaderModel" :fullscreen="false" :closable="false" @on-ok="saveHeader">
      <div slot="header" style="color:#f60;display:flex;">
        <p>
          <Icon type="ios-cog-outline" :size="20" />
          <span>{{$t('btn_add_header')}}</span>
        </p>
        <Button shape="circle" icon="md-add" type="text" @click="addHeader" />
      </div>
      <Table   border :columns="headersColumns" :data="headersData"></Table>
    </Modal>
    <Card :padding="8" bordered dis-hover>
      <Input
        class="value-content"
        v-model="inputURL"
        @on-change="handleInputURL($event.target.value)"
      >
        <Select
          v-model="selectMethod"
          slot="prepend"
          style="width: 80px"
          @on-change="handleMethodChange"
        >
          <Option v-for="m in apiMethods" :value="m" :label="m" :key="m">{{m}}</Option>
        </Select>

        <Button slot="append" :loading="loading" icon="ios-send" @click="send" class="send">
          <span v-if="loading">Sending...</span>
          <span v-else>Send</span>
        </Button>
      </Input>
    </Card>
    <Card :padding="8" bordered dis-hover class="card">
      <Input class="value-content" v-model="requestName" placeholder="请输入接口名称">
        <Select v-model="nodeNumber" slot="prepend" style="width: 80px">
          <Option :value="1">1级标题</Option>
          <Option :value="2">2级标题</Option>
          <Option :value="3">3级标题</Option>
          <Option :value="4">4级标题</Option>
          <Option :value="5">5级标题</Option>
          <Option :value="6">6级标题</Option>
          <Option :value="7">7级标题</Option>
          <Option :value="8">8级标题</Option>
          <Option :value="9">9级标题</Option>
          <Option :value="10">10级标题</Option>
          <Option :value="11">11级标题</Option>
        </Select>
      </Input>
    </Card>
    <Card :padding="8" bordered dis-hover class="card">
      <div class="label">
        <div>
          <h6 class="title-label">{{typeLabel}}</h6>
          <Icon
            v-if="selectMethod === 'GET'"
            class="plus"
            size="16"
            type="md-add"
            @click="addQueryParam"
          />
        </div>
        <Button
          v-if="selectMethod === 'GET'"
          size="small"
          type="success"
          ghost
          @click="switchGetEditType"
        >{{switchEditTitle}}</Button>
      </div>
      <Input
        class="value-content"
        v-if="enableEdit"
        v-model="inputData"
        type="textarea"
        :rows="10"
        placeholder
        @on-change="handleWriteRequest"
      />
      <Table   v-else border :columns="requestColumns" :data="requestData"></Table>
    </Card>
    <Card :padding="8" bordered dis-hover class="card">
      <h6 class="title-label">{{$t('response')}}</h6>
      <Table   class="value-content" border :columns="responseColumns" :data="responseData"></Table>
    </Card>
    <Affix :offset-bottom="20">
      <div class="btn-group">
        <Button class="btn" :type="btnGroupStyle" ghost @click="showHeaders">{{$t('btn_add_header')}}</Button>
        <Button class="btn" :type="btnGroupStyle" ghost @click="showHow">{{$t('btn_tutorial')}}</Button>
        <Button class="btn" :type="btnGroupStyle" ghost @click="openCORS">{{$t('btn_cors')}}</Button>
        <Button class="btn" :type="btnGroupStyle" ghost @click="showDesc">{{$t('btn_add_description')}}</Button>
        <Button class="btn" :type="btnGroupStyle" ghost @click="cleanData">{{$t('btn_reset')}}</Button>
        <Button class="btn" :type="btnGroupStyle" ghost @click="showMarkdown">{{$t('btn_build_md')}}</Button>
      </div>
    </Affix>
    <BackTop :height="100" :bottom="20">
      <div class="top">{{$t('btn_back_top')}}</div>
    </BackTop>
  </div>
</template>

<script>
import DigitalClock from "vue-digital-clock";
import markdown from "./components/markdown";
import requset from "./utils/request";
import { setLanguage, getLanguage } from '@/utils/utils'

export default {
  name: "app",
  components: {
    markdown,
    DigitalClock
  },
  mounted() {
    this.updateQueryTableData();
    this.getGitWatchers();
    this.getHeaders();
    this.lang = getLanguage() || ''
  },
  computed: {
    languageName(){
      const defaultName = 'Language'
      console.log(this.lang)
      if(this.lang){
        let targetItem = this.$supportLang.find(item => item.key === this.lang);
        return targetItem ? targetItem.value : defaultName
      }else{
        return defaultName
      }
    },
    btnGroupStyle(){
      return this.responseData.length > 0 ? 'success' : 'default'
    },
    typeLabel() {
      return this.selectMethod === "GET"
        ? this.$t('request_string_params')
        : `${this.$t('request_post_payload')} <application/json>`;
    },
    bulkData() {},
    enableEdit() {
      if (this.selectMethod === "POST") {
        return true;
      }
      if (this.selectMethod === "GET" && this.editType === "BULK") {
        return true;
      }
      return false;
    },
    switchEditTitle() {
      return this.editType === "KV" ? "PARSED EDIT" : "KEY-VALUE EDIT";
    }
  },
  methods: {
    /**
     * 切换语言
     */
    handleSelectedLang(lang){
      setLanguage(lang)
      this.$i18n.locale = lang
      this.lang = lang
      window.location.reload();
    },
    /**
     * 得到项目的Start数
     */
    async getGitWatchers(){
       try {
        let body = await requset({url:this.githubAPIURL});
        if(body){
          this.gitWatchers = body.watchers || 0
        }
      } catch (error) {
        // this.$Message.error(error.toString());
      } finally {
        //nothing
      }
    },
    /**
     * 填充描述信息
     */
    fillDesc(v) {
      if (v) {
        let des = v.split("->");
        let len = this.responseData.length;
        for (let i = 0; i < des.length; i++) {
          this.responseData[i].description = des[i];
        }
      }
    },
    /**
     * 地址栏变化
     */
    handleInputURL(value) {
      if (value.includes("?")) {
        let [path, querystring] = value.split("?");
        if (querystring.startsWith("&")) {
          querystring = querystring.substr(1, querystring.length);
        }
        let qary = querystring.split("&");
        let rd = [];
        for (let qar of qary) {
          let [key, value] = qar.split("=");
          rd.push({
            key,
            value,
            description: key
          });
        }
        // this.inputURL = path;
        this.requestData = rd;
      }
    },
    /**
     * 清空调试数据
     */
    cleanData() {
      localStorage.clear();
      this.headersData = [];
      this.requestData = [];
      this.responseData = [];
      (this.responseBody = {}),
        (this.inputData = this.selectMethod === "GET" ? "" : "{}");
      this.$Message.success("清除成功");
    },
    /**
     * 视频进入全屏
     */
    handleVideoPlay() {
      if (this.showPlayModel) this.$refs.video.webkitRequestFullScreen();
    },
    /**
     * 视频退出全屏
     */
    handleVideoEnd() {
      if (this.showPlayModel) this.$refs.video.webkitExitFullscreen();
    },
    /**
     * 获取头信息
     */
    getHeaders() {
      let headers = localStorage.getItem("headers");
      if (headers) {
        this.headersData = JSON.parse(headers);
      }
    },
    /**
     * 添加头
     */
    addHeader() {
      this.headersData.push({
        key: this.headersData.length + 1,
        value: "",
        description: ""
      });
    },
    /**
     * 保存头信息
     */
    saveHeader() {
      console.log(JSON.stringify(this.headersData));
      localStorage.setItem("headers", JSON.stringify(this.headersData));
    },
    /**
     * 显示头
     */
    showHeaders() {
      this.showHeaderModel = true;
    },
    /**
     * 显示自动填充
     */
    showDesc() {
      this.showDescModel = true;
    },
    /**
     * 显示播放
     */
    showHow() {
      this.showPlayModel = true;
    },
    /**
     * 打开跨域支持
     */
    openCORS() {
      const link = 'https://enable-cors.org/server.html';
      window.open('javascript:window.name;', '<script>location.replace("'+link+'")<\/script>');

    },
    /**
     * 显示 Markdown
     */
    showMarkdown() {
      // if(!this.requestName){
      //   this.$Message.warning('请输入接口名称');
      //   return;
      // }

      this.showMarkdownModel = true;

      setTimeout(() => {
              
      let getType = "`GET` & `Query Params`";
      let postType = `${this.selectMethod} & application/json`;
      let requestBody = "?";
      if (this.selectMethod === "GET") {
        for (let i = 0; i < this.requestData.length; i++) {
          let { key, value } = this.requestData[i];
          requestBody += `${key}=${value}`;
          if (i < this.requestData.length - 1) {
            requestBody += "&";
          }
        }
      } else {
        try {
          let obj = JSON.parse(this.inputData);
          requestBody = JSON.stringify(obj, null, 4);
        } catch (error) {
          requestBody = "暂无";
        }
      }

      // 生成入参表格
      let requestBodyTable = `|参数名|参数类型|必填|参数说明|示例|
|------|-------|----|-------|----|`;
      if (this.selectMethod === "GET") {
        for (let i = 0; i < this.requestData.length; i++) {
          let { key, value, description } = this.requestData[i];

          let type = "字符串";
          let fieldValue = value;
          try {
            if (!Number.isNaN(Number.parseInt(fieldValue))) {
              if (Number.isInteger(fieldValue)) {
                type = "整型";
              } else {
                type = "浮点数";
              }
            }
          } catch (error) {
            //
          }
          requestBodyTable += `\n|${key}|${type}|是|${description}|${fieldValue}|`;
        }
      } else {
        try {
          let postBody = JSON.parse(this.inputData);
          for (let key in postBody) {
            let type = this.$t('data_type_string');
            let fieldValue = postBody[key];
            try {
              if (!Number.isNaN(Number.parseInt(fieldValue))) {
                if (Number.isInteger(fieldValue)) {
                  type = this.$t('data_type_int');
                } else {
                  type = this.$t('data_type_float');
                }
              }
            } catch (error) {
              //
            }
            requestBodyTable += `\n|${key}|${type}|是|-|${fieldValue}|`;
          }
        } catch (error) {
          requestBodyTable = "暂无";
        }
      }

      // 生成出参表格
      let responseBodyTable = `|参数名|参数类型|必填|参数说明|示例|
|------|-------|----|-------|----|`;
      for (let i = 0; i < this.responseData.length; i++) {
        let type = this.$t('data_type_string');
        let item = this.responseData[i];
        try {
          if (typeof item.value === "string") {
          } else {
            if (!Number.isNaN(Number.parseInt(item.value))) {
              if (Number.isInteger(item.value)) {
                type = this.$t('data_type_int');
              } else {
                type = this.$t('data_type_float');
              }
            }
          }
        } catch (error) {
          //
        }
        responseBodyTable += `\n|${item.key}|${type}|是|${item.description}|${item.value}|`;
      }
      let url = this.inputURL;
      if (url.startsWith("http")) {
      }
      let md = `
## ${this.nodeNumber}、${this.requestName}

> 请求方式通过 \`HTTP\` 方式进行通讯， \`${
        this.selectMethod
      }\` 方式传递参数，参数的编码格式采用 \`UTF-8\` 编码格式。

### ${this.nodeNumber}.1. ${this.$t('th_req_url')}

\`${url}\`

### ${this.nodeNumber}.2. ${this.$t('th_req_type')}

${this.selectMethod === "GET" ? getType : postType}

### ${this.nodeNumber}.3. ${this.$t('th_req_template')}
\`\`\`json
${requestBody}
\`\`\`
### ${this.nodeNumber}.4. ${this.$t('th_req_description')}

${requestBodyTable}

### ${this.nodeNumber}.5. ${this.$t('th_res_template')}

\`\`\`json
${JSON.stringify(this.responseBody, null, 4)}
\`\`\`
### ${this.nodeNumber}.6. ${this.$t('th_res_description')}
${responseBodyTable}
`;

      this.mdData = md;
      this.$refs.md.updateText(md);
      }, 600);

    },
    /**
     * 发送请求
     */
    async send() {
      this.loading = true;
      this.$Loading.start();
      let opt = {
        method: this.selectMethod,
        url: this.inputURL
      };
      let localHeaders = localStorage.getItem("headers");
      if (localHeaders) {
        let headers = JSON.parse(localHeaders);
        opt.headers = {};
        headers.forEach(item => {
          opt.headers[item.key] = item.value;
        });
      }
      if (this.selectMethod === "GET") {
        let params = {};
        for (let item of this.requestData) {
          params[item.key] = item.value;
        }
        opt.params = params;
      } else {
        opt.data = this.inputData;
      }
      let body;
      try {
        body = await requset(opt);
        this.$Message.success("请求成功");
        this.$Loading.finish();
      } catch (error) {
        if(!this.$Message.isShow){
          this.$Message.isShow = true
          this.$Message.error(error.toString());
          this.$Message.isShow = false
        }
        this.$Loading.error();
      } finally {
        this.loading = false;
      }

      this.responseBody = body;

      let arr = [];
      for (let key in body) {
        let v = body[key];
        let isData = key === "data";
        let isArray = v instanceof Array;
        arr.push({
          key,
          value: isArray ? "Array" : typeof v === "object" ? "Object" : v,
          description: isData ? "Object" : key
        });
        if (key === "data") {
          if (isArray) {
            if (v.length > 0) {
              v = v[0];
            }
          }
          for (let datakey in v) {
            arr.push({
              key: datakey,
              value: v[datakey],
              description: datakey
            });
          }
        }
      }
      this.responseData = arr;
    },
    /**
     * 请求方法切换事件
     */
    handleMethodChange(requestMethod) {
      if (requestMethod === "GET" && this.inputData.length > 0) {
        try {
          this.requestData = [];
          // JSON => 字符:
          let jsonObject = JSON.parse(this.inputData);
          for (let key in jsonObject) {
            this.requestData.push({
              key,
              value: jsonObject[key],
              description: "-"
            });
          }
          this.updateQueryTableData();
        } catch (error) {
          this.requestData = [];
        }
      } else if (requestMethod === "POST" && this.inputData.length > 0) {
        let requestBody = {};
        for (let i = 0; i < this.requestData.length; i++) {
          let item = this.requestData[i];
          requestBody[item.key] = item.value;
        }
        this.inputData = JSON.stringify(requestBody, null, 4);
      }
    },
    /**
     * 切换GET请求时的编辑类型
     */
    switchGetEditType() {
      this.editType = this.editType === "KV" ? "BULK" : "KV";
    },
    /**
     * 有新的请求数据输入
     */
    handleWriteRequest(v) {
      let data = [];
      try {
        let kvs = this.inputData.split("\n");
        for (let i = 0; i < kvs.length; i++) {
          let kv = kvs[i];
          let [key, value] = kv.split(":");
          let description = "-";
          if (this.requestData.length > i) {
            description = this.requestData[i].description;
          }
          data.push({
            key,
            value,
            description
          });
        }
      } catch (e) {
        //
      }

      this.requestData = data;
    },
    /**
     * 添加一行查参数
     */
    addQueryParam() {
      this.requestData.push({
        key: this.requestData.length,
        value: "",
        description: ""
      });
      this.updateQueryTableData();
    },
    /**
     * 更新查询参数表格数据
     */
    updateQueryTableData() {
      if (this.selectMethod === "GET") {
        let data = "";
        let len = this.requestData.length;
        for (let i = 0; i < len; i++) {
          let { key, value } = this.requestData[i];
          data += `${key}:${value}`;
          if (i < len) {
            data += "\n";
          }
        }
        this.inputData = data;
      }
    },
    /**
     * 移除表格中请求参数的某一行
     */
    removeRequestItem(index) {
      this.requestData.splice(index, 1);
    },
    /**
     * 移除表格中请求头的某一行
     */
    removeHeaderItem(index) {
      this.headersData.splice(index, 1);
      localStorage.setItem("headers", JSON.stringify(this.headersData));
    },
    /**
     * 移除表格中响应的某一行
     */
    removeResponseItem(index) {
      this.responseData.splice(index, 1);
    }
  },
  data() {
    return {
      loading: false,
      showDescModel: false,
      json: "",
      showMarkdownModel: false,
      showHeaderModel: false,
      nodeNumber: 1,
      requestName: "",
      responseBody: {},
      responseData: [],
      inputData: "",
      editType: "KV",
      mdData: `# Test`,
      headersData: [],
      headersColumns: [
        {
          title: this.$t('key'),
          key: "name",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.key
              },
              on: {
                "on-change": event => {
                  let { value, description } = this.headersData[params.index];
                  this.headersData[params.index] = {
                    key: event.target.value,
                    value,
                    description
                  };
                }
              }
            });
          }
        },
        {
          title: this.$t('value'),
          key: "age",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.value
              },
              on: {
                "on-change": event => {
                  let { key, description } = this.headersData[params.index];
                  this.headersData[params.index] = {
                    key,
                    value: event.target.value,
                    description
                  };
                }
              }
            });
          }
        },
        {
          title: this.$t('description'),
          key: "address",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.description
              },
              on: {
                "on-change": event => {
                  let { key, value } = this.headersData[params.index];
                  this.headersData[params.index] = {
                    key,
                    value,
                    description: event.target.value
                  };
                }
              }
            });
          }
        },
        {
          title: this.$t('action'),
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.removeHeaderItem(params.index);
                      this.getHeaders();
                    }
                  }
                },
                this.$t('btn_delete')
              )
            ]);
          }
        }
      ],
      requestColumns: [
        {
          title: this.$t('key'),
          key: "name",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.key
              },
              on: {
                "on-change": event => {
                  let { value, description } = this.requestData[params.index];
                  this.requestData[params.index] = {
                    key: event.target.value,
                    value,
                    description
                  };
                }
              }
            });
          }
        },
        {
          title: this.$t('value'),
          key: "age",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.value
              },
              on: {
                "on-change": event => {
                  let { key, description } = this.requestData[params.index];
                  this.requestData[params.index] = {
                    key,
                    value: event.target.value,
                    description
                  };
                }
              }
            });
          }
        },
        {
          title: this.$t('description'),
          key: "address",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.description
              },
              on: {
                "on-change": event => {
                  let { key, value } = this.requestData[params.index];
                  this.requestData[params.index] = {
                    key,
                    value,
                    description: event.target.value
                  };
                }
              }
            });
          }
        },
        {
          title: this.$t('action'),
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.removeRequestItem(params.index);
                    }
                  }
                },
                this.$t('btn_delete')
              )
            ]);
          }
        }
      ],
      responseColumns: [
        {
          title: this.$t('key'),
          key: "name",
          render: (h, params) => {
            return h("div", [params.row.key]);
          }
        },
        {
          title: this.$t('value'),
          key: "age",
          render: (h, params) => {
            return h("div", [params.row.value]);
          }
        },
        {
          title: this.$t('description'),
          key: "address",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.description
              },
              on: {
                "on-change": event => {
                  let { key, value } = this.responseData[params.index];
                  this.responseData[params.index] = {
                    key,
                    value,
                    description: event.target.value
                  };
                }
              }
            });
          }
        },
        {
          title: this.$t('action'),
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.removeResponseItem(params.index);
                    }
                  }
                },
                this.$t('btn_delete')
              )
            ]);
          }
        }
      ],
      requestData: [
        {
          key: "id",
          value: "100001",
          description: this.$t('input_id')
        }
      ],
      lang:'',
      gitWatchers: 0,
      githubAPIURL: "https://api.github.com/repos/yzb0101/genmd",
      githubURL: "https://www.github.com/yzb0101/genmd",
      inputURL: "https://api.github.com/repos/yzb0101/genmd",
      playURL: "https://github.com/yzb0101/genmd/raw/master/pic/genmd.mp4",
      showPlayModel: false,
      inputFillText: "",
      selectMethod: "GET",
      apiMethods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
        "PATCH",
        "TRACE",
        "HEAD",
        "CONNECT"
      ]
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 8px;
  height: 100%;
  width:100%;
}
html{
  height: 100%;
  width:100%;
}
body{
  height: 100%;
  width:100%;
}
.bg {
    /* background: rgb(51, 51, 51); */
  	background-image:url('./assets/fly.jpeg');
    background-size:cover;
    /* padding: 20px; */
    /* -moz-filter: blur(5px);
    -webkit-filter: blur(5px);
    -o-filter: blur(5px);
    -ms-filter: blur(5px);
    filter: blur(5px); */
}

.content {
  margin-top: 10px;
}

.label {
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plus {
  margin-left: 4px;
}
input {
  color: #515a6e;
}
h6 {
  display: inline;
  margin: 0, 0, 10px, 0;
}

.md {
  width: 100%;
  height: 100%;
}

.tip {
  color: #19be6b;
  margin-top: 20px;
}
.btn {
  color: white;
  margin-top: 12px;
  margin-left: 5px;
}

.title-label {
  color: #17233d;
}

.value-content {
  margin-top: 6px;
}
.card {
  margin-top: 10px;
}
.top {
  padding: 10px;
  background: #19be6b95;
  color: #fff;
  text-align: center;
  border-radius: 2px;
}
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding-bottom: 5px;
}

.title-right{
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding-bottom: 5px;
}

.title a  {
  width:20px;
  height: 20px;
}

 .title svg{
  width:inherit;
  height:inherit;
}

.title-center {
  color: white;
  text-decoration: underline;
}

.clock {
  background-color: #263238;
  color: #eceff1;
  padding: 0.3rem 0.6rem;
  margin-right: 5px;
  font-size: 0.5rem;
  font-family: "Menlo", monospace;

}

/* github theme */
.gh-text, .gh-text, .gh-count{
  color: #19be6b90;
}
</style>