import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import VueDateNow from "vue-date-now";
import App from "./App.vue";
import router from "./router";

Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.use(VueDateNow);

Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
