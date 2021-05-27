import axios from "axios";
import ElementUI from "element-ui";
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
import store from "./store";

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
	apiKey: "AIzaSyC3dbxai9K3bOI5TDJdi90hL5xDkzayrpU",
	authDomain: "webnewsapp-798db.firebaseapp.com",
	databaseURL:
		"https://webnewsapp-798db-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "webnewsapp-798db",
	storageBucket: "webnewsapp-798db.appspot.com",
	messagingSenderId: "681029281768",
	appId: "1:681029281768:web:7a294b051e9149c345e65d",
	measurementId: "G-2CYV93RDF9",
};

firebase.initializeApp(configOptions);
firebase.auth().onAuthStateChanged((user) => {
	store.dispatch("fetchUser", user);
});

axios.interceptors.request.eject(requestInterceptor);
axios.interceptors.request.eject(responseInterceptor);

Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(VueDateNow);
Vue.use(require("vue-moment"));
Vue.use(require("vue-moment"), {
	moment,
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
