import Vue from 'vue'
import App from './App.vue'

import { Button, Table,Modal ,Card,Select,Option,Input,Icon,Affix,BackTop,LoadingBar,Message} from 'iview';

Vue.component('Button', Button);
Vue.component('Table', Table);
Vue.component('Modal', Modal);
Vue.component('Card', Card);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('Input', Input);
Vue.component('Icon', Icon);
Vue.component('Affix', Affix);
Vue.component('BackTop', BackTop);
Vue.component('Message', Message);
Vue.component('Loading', LoadingBar);

Vue.prototype.$Message = Message;
Vue.prototype.$Loading = LoadingBar;
import 'iview/dist/styles/iview.css';
import '../theme/index.less';

// iView 按需导入组件
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
