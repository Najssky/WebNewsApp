import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import moment from "moment";
import Vue from "vue";
import VueDateNow from "vue-date-now";
import App from "./App.vue";
import router from "./router";

Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.use(VueDateNow);
Vue.use(require("vue-moment"));
Vue.use(require("vue-moment"), {
	moment,
});

Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
