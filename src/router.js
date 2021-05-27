import Vue from "vue";
import VueRouter from "vue-router";
import mainPage from "./components/mainPage.vue";
import news from "./components/news.vue";
import profile from "./components/profile.vue";
import signInPage from "./components/signInPage.vue";
import signUpPage from "./components/signUpPage.vue";
import topNews from "./components/topNews.vue";

Vue.use(VueRouter);

export default new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
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
			path: "/sign-in",
			name: "signIn",
			component: signInPage,
		},
		{
			path: "/sign-up",
			name: "signUp",
			component: signUpPage,
		},
		{
			path: "/profile",
			name: "profile",
			component: profile,
		},
	],
});
