<template>
	<el-container>
		<el-menu>
			<el-menu-item>
				<router-link :to="{ name: 'mainPage' }">
					<el-button
						style="width:90%;margin: 10px 5% 10px 5%"
						type="primary"
						icon="el-icon-s-home"
					>
						Back to main page
					</el-button>
				</router-link>
			</el-menu-item>
			<el-submenu index="1">
				<template slot="title"
					><i class="el-icon-search"></i>Search your news</template
				>
				<el-menu-item-group>
					<el-menu-item>
						<el-input
							placeholder="Type something"
							v-model="searchValue"
							style="width:250px;"
						>
						</el-input>

						<el-button
							type="default"
							icon="el-icon-search "
							@click="
								resetPages();
								fetchNews();
							"
							style="margin-left:10px;"
						></el-button>
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-submenu index="2">
				<template slot="title">
					<i class="el-icon-date"></i>Pick a date
				</template>
				<el-menu-item-group>
					<el-menu-item>
						<el-date-picker
							v-model="pickerDate"
							type="daterange"
							align="right"
							unlink-panels
							range-separator="To"
							start-placeholder="Start date"
							end-placeholder="End date"
							:picker-options="pickerOptions"
							:default-time="['00:00:00', '23:59:59']"
						>
						</el-date-picker>
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title"
					><i class="el-icon-setting"></i>Rest of searching options
				</template>
				<el-menu-item-group>
					<template slot="title">Sort by:</template>
					<el-menu-item>
						<el-select v-model="sortBy" placeholder="Sort by:">
							<el-option
								label="By publish date"
								value="published_on"
							>
							</el-option>
							<el-option
								label="By relevancy"
								value="relevance_score"
							>
							</el-option>
						</el-select>
					</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group>
					<template slot="title"> Choose your category: </template>
					<el-menu-item>
						<el-select v-model="category" placeholder="Category:">
							<el-option
								v-for="item in categoriesOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group>
					<template slot="title"> Choose your language: </template>
					<el-menu-item>
						<el-select v-model="language" placeholder="Language:">
							<el-option
								v-for="item in languageOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-menu-item-group>
				<el-menu-item>
					<el-button icon="el-icon-search" @click="fetchNews"
						>Search with your preferences</el-button
					>
				</el-menu-item>
			</el-menu-item-group>
			<el-submenu index="4" v-if="status === 'success'">
				<template slot="title"
					><i class="el-icon-setting"></i>Your searching history
				</template>
				<el-menu-item-group>
					<el-menu-item>
						<el-select v-model="historyApiUrl" placeholder="Select">
							<el-option
								v-for="(historyUrl, index) in reversedHistory"
								:key="index"
								:label="historyUrl"
								:value="historyUrl"
							>
							</el-option>
						</el-select>
					</el-menu-item>
					<el-menu-item>
						<el-button
							icon="el-icon-search"
							@click="fetchHistoryNews"
							>Search with history</el-button
						>
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>

		<el-container
			v-loading="loading"
			element-loading-text="Loading..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
		>
			<el-header style="text-align: right; font-size: 12px"> </el-header>

			<el-main>
				<article v-for="(article, index) in articles" :key="index">
					<header>
						<img
							v-if="article.image_url"
							:src="article.image_url"
							alt=""
						/>
						<i v-else class="fas fa-image"></i>
					</header>
					<section>
						<title
							v-html="article.title"
							@click="navigateTo(article.url)"
						></title>
						<div
							class="description"
							v-html="article.description"
						></div>
						<el-button
							style="float:right;margin-right:10px;"
							type="danger"
							@click="addToFavorites(article.url)"
							v-if="status === 'success'"
						>
							Add to Favorites
						</el-button>
						<el-button
							style="float:right;margin-right:10px;"
							type="primary"
							@click="
								showSimiliarNews(article.uuid, article.language)
							"
						>
							Show similiar news
						</el-button>
					</section>
					<footer>
						<i class="fas fa-chevron-right "></i>
					</footer>
				</article>
				<div class="container">
					<el-pagination
						background
						layout="prev, pager, next"
						:total="pages"
						@current-change="handleCurrentChange"
						:current-page="currentPage"
						v-model="currentPage"
					>
					</el-pagination>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import firebase from "firebase";
import _ from "lodash";

export default {
	data() {
		return {
			pickerOptions: {
				shortcuts: [
					{
						text: "Last week",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(
								start.getTime() - 3600 * 1000 * 24 * 7,
							);
							picker.$emit("pick", [start, end]);
						},
					},
					{
						text: "Last month",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(
								start.getTime() - 3600 * 1000 * 24 * 30,
							);
							picker.$emit("pick", [start, end]);
						},
					},
					{
						text: "Last 3 months",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(
								start.getTime() - 3600 * 1000 * 24 * 90,
							);
							picker.$emit("pick", [start, end]);
						},
					},
				],
			},
			historyUrl: [],
			historyApiUrl: "",
			searchValue: "",
			pickerDate: null,
			apiUrl: "",
			apiKey: "MuxY4plSrRa54LHQWU4tureqf1i0HkeE16V5zb3u",
			articles: [],
			isLoading: false,
			currentPage: 1,
			pages: 0,
			loading: true,
			date: "",
			fromDate: "",
			toDate: "",
			category: "",
			categoriesOptions: [
				{ value: "business", label: "Business" },
				{ value: "entertainment", label: "Entertainment" },
				{ value: "general", label: "General" },
				{ value: "health", label: "Health" },
				{ value: "sports", label: "Sports" },
				{ value: "tech", label: "Technology" },
				{ value: "science", label: "Science" },
				{ value: "politics", label: "Politics" },
				{ value: "food", label: "Food" },
				{ value: "travel", label: "Travel" },
			],
			sortBy: "",
			sortOptions: [
				{ value: "publishedAt", label: "By public date" },
				{ value: "popularity", label: "By popularity" },
				{ value: "relevancy", label: "By relevancy" },
			],
			language: "",
			languageOptions: [
				{ value: "en", label: "English" },
				{ value: "pl", label: "Polski" },
				{ value: "cs", label: "čeština" },
				{ value: "da", label: "Dansk" },
				{ value: "el", label: "Ελληνικά" },
				{ value: "et", label: "Eestlane" },
				{ value: "fa", label: "فارسی" },
				{ value: "fi", label: "Suomalainen" },
				{ value: "hi", label: "हिंदी" },
				{ value: "hr", label: "Hrvatski" },
				{ value: "hu", label: "Magyar" },
				{ value: "id", label: "bahasa Indonesia" },
				{ value: "ja", label: "日本語" },
				{ value: "ko", label: "한국어" },
				{ value: "lt", label: "Lietuvis" },
				{ value: "ro", label: "Română" },
				{ value: "sk", label: "Slovák" },
				{ value: "sv", label: "Svenska" },
				{ value: "th", label: "ไทย" },
				{ value: "ta", label: "தமிழ்" },
				{ value: "tr", label: "Türk" },
				{ value: "vi", label: "Tiếng Việt" },
				{ value: "de", label: "Deutsche" },
				{ value: "es", label: "Española" },
				{ value: "fr", label: "Français" },
				{ value: "it", label: "Italiano" },
				{ value: "he", label: "עִברִית" },
				{ value: "nl", label: "Hollandsk" },
				{ value: "no", label: "Norsk" },
				{ value: "bg", label: "Belgian" },
				{ value: "ar", label: "عربى" },
				{ value: "pt", label: "Português" },
				{ value: "ru", label: "Pусский" },
				{ value: "uk", label: "" },
				{ value: "zh", label: "汉语" },
			],
			database: firebase.database(),
			userId: "",
			favorites: [],
		};
	},
	computed: {
		...mapGetters({
			status: "authStatus",
			user: "user",
		}),
		reversedHistory: function() {
			return _.reverse(this.historyUrl);
		},
	},
	methods: {
		navigateTo(url) {
			window.open(url);
		},
		datePicker() {
			try {
				console.log("Picked date: ", this.value);
			} catch (error) {
				console.log("Problem", error);
			}
		},
		handleSelect(key, keyPath) {
			console.log(key, keyPath);
		},
		resetData() {
			this.articles = [];
		},
		resetPages() {
			this.currentPage = 1;
		},
		fetchNews() {
			if (
				this.status === "success" &&
				(this.category !== "" ||
					this.sortBy !== "" ||
					this.searchValue !== "" ||
					this.language !== "")
			) {
				if (this.pickerDate == null) {
					this.apiUrl = `https://api.thenewsapi.com/v1/news/all?api_token=${this.apiKey}&search=${this.searchValue}&language=${this.language}&categories=${this.category}&sort=${this.sortBy}&page=${this.currentPage}`;
				} else {
					this.apiUrl = `https://api.thenewsapi.com/v1/news/all?api_token=${this.apiKey}&search=${this.searchValue}&language=${this.language}&categories=${this.category}&sort=${this.sortBy}&page=${this.currentPage}&published_after=${this.fromDate}&published_before=${this.toDate}`;
				}
				this.resetData();
				this.isBusy = true;
				this.fetchData();
				this.sendToHistory();
			} else {
				if (this.pickerDate == null) {
					this.apiUrl = `https://api.thenewsapi.com/v1/news/all?api_token=${this.apiKey}&search=${this.searchValue}&language=${this.language}&categories=${this.category}&sort=${this.sortBy}&page=${this.currentPage}`;
				} else {
					this.apiUrl = `https://api.thenewsapi.com/v1/news/all?api_token=${this.apiKey}&search=${this.searchValue}&language=${this.language}&categories=${this.category}&sort=${this.sortBy}&page=${this.currentPage}&published_after=${this.fromDate}&published_before=${this.toDate}`;
				}
				this.resetData();
				this.isBusy = true;
				this.fetchData();
			}
		},
		fetchHistoryNews() {
			this.apiUrl = this.historyApiUrl;
			this.resetData();
			this.isBusy = true;
			this.fetchData();
			this.sendToHistory();
		},
		showSimiliarNews(newsId, newsLanguage) {
			if (this.status === "success") {
				this.resetData();
				this.apiUrl = `https://api.thenewsapi.com/v1/news/similar/${newsId}?api_token=${this.apiKey}&language=${newsLanguage}`;
				this.isBusy = true;
				this.fetchData();
				this.sendToHistory();
			} else {
				this.resetData();
				this.apiUrl = `https://api.thenewsapi.com/v1/news/similar/${newsId}?api_token=${this.apiKey}&language=${newsLanguage}`;
				this.isBusy = true;
				this.fetchData();
			}
		},
		fetchData() {
			let req = new Request(this.apiUrl);
			fetch(req)
				.then((resp) => resp.json())
				.then((result) => {
					result.data.forEach((element) => {
						this.articles.push(element);
					});
					this.pages = result.meta.found / 5;
					console.log(this.articles);
					this.loading = false;
				})
				.catch((err) => {
					console.log("Have some problems:", err);
				});
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			console.log(`current page: ${this.currentPage}`);
			this.fetchNews();
		},
		getUserConfig() {
			if (this.status == "success") {
				firebase
					.database()
					.ref("Users/" + this.user.login + "/Preferences")
					.get()
					.then((snapshot) => {
						if (snapshot.exists()) {
							if (snapshot.val().sortBy == undefined) {
								this.sortBy = "";
							} else {
								this.sortBy = snapshot.val().sortBy;
							}
							if (snapshot.val().categories == undefined) {
								this.category = "";
							} else {
								this.category = snapshot.val().categories;
							}
							if (snapshot.val().language == undefined) {
								this.language = "";
							} else {
								this.language = snapshot.val().language;
							}
							this.fetchNews();
						} else {
							this.fetchNews();
							console.log("No data available");
						}
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				this.fetchNews();
				console.log("User is not logged");
			}
		},
		sendToHistory() {
			try {
				firebase
					.database()
					.ref("Users/" + this.user.login + "/History")
					.get()
					.then((snapshot) => {
						if (snapshot.exists()) {
							this.historyUrl = [];
							snapshot.val().forEach((element) => {
								this.historyUrl.push(element);
							});
							console.log(this.historyUrl);
							this.historyUrl.push(this.apiUrl);
							firebase
								.database()
								.ref("Users/" + this.user.login + "/History")
								.set(this.historyUrl);
							console.log(this.historyUrl);
						} else {
							this.historyUrl.push(this.apiUrl);
							firebase
								.database()
								.ref("Users/" + this.user.login + "/History")
								.set(this.historyUrl);
							console.log(this.historyUrl);
							console.log("No data available");
						}
					});
			} catch (error) {
				console.log("Something goes wrong: /n", error);
			}
		},
		addToFavorites(value) {
			try {
				firebase
					.database()
					.ref("Users/" + this.user.login + "/Favorites")
					.get()
					.then((snapshot) => {
						if (snapshot.exists()) {
							this.favorites = [];
							snapshot.val().forEach((element) => {
								this.favorites.push(element);
							});
							console.log(this.favorites);
							this.favorites.push(value);
							firebase
								.database()
								.ref("Users/" + this.user.login + "/Favorites")
								.set(this.favorites);
							console.log(this.favorites);
							alert("News added successfully");
						} else {
							this.favorites.push(value);
							firebase
								.database()
								.ref("Users/" + this.user.login + "/Favorites")
								.set(this.favorites);
							console.log(this.favorites);
							alert("News added successfully");
							console.log("No data available");
						}
					});
			} catch (error) {
				console.log("Something goes wrong: /n", error);
			}
		},
	},
	created() {
		this.getUserConfig();
	},
	watch: {
		language(newValue) {
			this.language = newValue;
			this.currentPage = 1;
		},
		sortBy(newValue) {
			this.sortBy = newValue;
			this.currentPage = 1;
		},
		pickerDate(newValue) {
			this.fromDate = moment(newValue[0]).format("YYYY-MM-DDTHH:mm:ss");
			this.toDate = moment(newValue[1]).format("YYYY-MM-DDTHH:mm:ss");
			this.currentPage = 1;
		},
		category(newValue) {
			this.category = newValue;
			this.currentPage = 1;
		},
	},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@200&display=swap");
html,
body {
	font-family: "Roboto", sans-serif;
	margin: 0px !important;
	padding: 0px !important;
}
.el-header {
	background: rgb(47, 47, 47);
	color: #333;
	line-height: 2.604vw;
}

.el-main {
	overflow: visible;
	background: rgb(47, 47, 47);
	color: white;
	font-family: "Roboto", sans-serif;
}
.el-submenu {
	width: 400px;
}
el-menu {
	width: 400px;
}
.result-list {
	padding-top: 60px;
}
.container {
	display: flex;
	justify-content: center;
}
article {
	display: grid;
	grid-template-columns: 23.438vw auto;
	grid-template-rows: 15.625vw;
	border: 2px solid gray;
	border-radius: 2.604vw;
	overflow: hidden;
	margin: 0 auto 30px auto;
	width: 80%;
	cursor: pointer;
}
article:hover {
	border: 3px solid gray;
	background: rgb(59, 59, 59);
	transition: 300ms;
}
article > header {
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: visible;
}
article > header > img {
	max-width: 100%;
	min-width: 100%;
	min-height: 100%;
}
article > header > i {
	font-size: 2rem;
}

article > section > title {
	display: flex;
	padding-left: 4vw;
	margin: 0;
	padding-top: 2.604vw;
	font-size: 1.042vw;
}
article > section > .description {
	display: flex;
	margin: 0;
	padding-top: 2.604vw;
	padding-left: 4vw;
	font-size: 0.833vw;
	width: 80%;
}
article > footer {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.6rem;
	color: #888;
}
</style>
