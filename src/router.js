import Vue from "vue";
import VueRouter from "vue-router";
import info from "./components/info.vue";
import mainPage from "./components/mainPage.vue";
import news from "./components/news.vue";
import topNews from "./components/topNews.vue";

Vue.use(VueRouter);

export default new VueRouter({
	mode: "history",
	routes: [
		{
			path: "/",
			name: "mainPage",
			component: mainPage,
		},
		{
			path: "/news",
			name: "news",
			component: news,
		},
		{
			path: "/top-news",
			name: "topNews",
			component: topNews,
		},
		{
			path: "/info",
			name: "info",
			component: info,
		},
	],
});
