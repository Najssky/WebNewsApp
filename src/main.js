import axios from "axios";
import ElementUI from "element-ui";
import elementLocale from "element-ui/lib/locale/lang/en";
import "element-ui/lib/theme-chalk/index.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import moment from "moment";
import Vue from "vue";
import VueAxios from "vue-axios";
import VueDateNow from "vue-date-now";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";

Vue.config.productionTip = false;

const requestInterceptor = axios.interceptors.request.use((config) => {
	console.log("Intercept request", config);
	return config;
});

const responseInterceptor = axios.interceptors.response.use((res) => {
	console.log("Intercept request", res);
	return res;
});

const configOptions = {
	apiKey: "AIzaSyD6djttIo0m2HcZzhaE0IlDSR9rIdXNCcI",
	authDomain: "newsapp-292a3.firebaseapp.com",
	databaseURL:
		"https://newsapp-292a3-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "newsapp-292a3",
	storageBucket: "newsapp-292a3.appspot.com",
	messagingSenderId: "125412184823",
	appId: "1:125412184823:web:db52a4a384155878ca79f2",
};

firebase.initializeApp(configOptions);

axios.interceptors.request.eject(requestInterceptor);
axios.interceptors.request.eject(responseInterceptor);

Vue.use(VueAxios, axios);
Vue.use(ElementUI, { locale: elementLocale });
Vue.use(VueDateNow);
Vue.use(require("vue-moment"));
Vue.use(require("vue-moment"), {
	moment,
});

Vue.config.productionTip = false;
Vue.filter("reverse", function(value) {
	return value.slice().reverse();
});
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
