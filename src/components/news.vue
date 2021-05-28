<template>
	<el-container>
		<el-menu>
			<el-menu-item index="1">
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
			<el-submenu index="2">
				<template slot="title"
					><i class="el-icon-search"></i>Search your news</template
				>
				<el-menu-item-group>
					<el-menu-item index="2-1">
						<el-input
							placeholder="Type something"
							v-model="searchValue"
							style="width:250px;"
						>
						</el-input>

						<el-button
							type="default"
							icon="el-icon-search "
							@click="fetchSearchedNews()"
							style="margin-left:10px;"
						></el-button>
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title">
					<i class="el-icon-date"></i>Pick a date
				</template>
				<el-menu-item-group>
					<el-menu-item index="3-1">
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
			<el-submenu index="4">
				<template slot="title"
					><i class="el-icon-setting"></i>Rest of searching options
				</template>
				<el-menu-item-group>
					<template slot="title">Sort by:</template>
					<el-menu-item index="4-1">
						<el-select v-model="sortBy" placeholder="Sort by:">
							<el-option
								label="By publish date"
								value="publishedAt"
							>
							</el-option>
							<el-option label="By popularity" value="popularity">
							</el-option>
							<el-option label="By relevancy" value="relevancy">
							</el-option>
						</el-select>
					</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group>
					<template slot="title">News per page:</template>
					<el-menu-item index="4-2"
						><el-select
							v-model="maxPerPage"
							placeholder="News per page:"
						>
							<el-option label="5" value="5"> </el-option>
							<el-option label="10" value="10"> </el-option>
							<el-option label="15" value="15"> </el-option>
							<el-option label="20" value="20"> </el-option>
						</el-select>
					</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group>
					<template slot="title">Choose your language</template>
					<el-menu-item index="4-3">
						<el-select v-model="language">
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
		</el-menu>

		<el-container
			v-loading="loading"
			element-loading-text="Loading..."
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
		>
			<el-header style="text-align: right; font-size: 12px"> </el-header>

			<el-main>
				<article
					v-for="(article, index) in articles"
					:key="index"
					@click="navigateTo(article.url)"
				>
					<header>
						<img
							v-if="article.urlToImage"
							:src="article.urlToImage"
							alt=""
						/>
						<i v-else class="fas fa-image"></i>
					</header>
					<section>
						<title v-html="article.title"></title>
						<div
							class="description"
							v-html="article.description"
						></div>
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
			searchValue: null,
			pickerDate: null,
			value2: [],
			apiUrl: "",
			apiKey: "fa6b08f1472043538a7ae22d2ff6d84c",
			articles: [],
			isLoading: false,
			currentPage: 1,
			maxPerPage: 5,
			pages: 0,
			totalResults: null,
			loading: true,
			language: "en",
			date: "",
			fromDate: this.$dn.date(new Date(), "yyyy-mm-dd", "-"),
			toDate: this.$dn.date(new Date(), "yyyy-mm-dd", "-"),
			sortBy: "publishedAt",
			sortOptions: [
				{ value: "publishedAt", label: "By public date" },
				{ value: "popularity", label: "By popularity" },
				{ value: "relevancy", label: "By relevancy" },
			],
			languageOptions: [
				{ value: "en", label: "English" },
				{ value: "de", label: "Deutsche" },
				{ value: "es", label: "Española" },
				{ value: "fr", label: "Français" },
				{ value: "it", label: "Italiano" },
				{ value: "he", label: "עִברִית" },
				{ value: "nl", label: "Hollandsk" },
				{ value: "nr", label: "Norsk" },
				{ value: "ar", label: "عربى" },
				{ value: "pt", label: "Português" },
				{ value: "ru", label: "Pусский" },
				{ value: "se", label: "Sami" },
				{ value: "ud", label: "Universal Dependencies" },
				{ value: "zh", label: "汉语" },
			],
			database: firebase.database(),
			userId: this.$store.getters.user.data.userId,
		};
	},
	computed: {
		// map `this.user` to `this.$store.getters.user`
		...mapGetters({
			user: "user",
		}),
	},
	methods: {
		showValue() {
			console.log(this.apiUrl);
		},
		setDate() {
			this.fromDate == this.currentDate;
		},
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
		fetchNews() {
			this.resetData();
			this.apiUrl = `https://newsapi.org/v2/everything?q=a&pageSize=${this.maxPerPage}&apiKey=${this.apiKey}&sortBy=${this.sortBy}&language=${this.language}&from=${this.fromDate}&to=${this.toDate}&sortBy${this.sortBy}&page=${this.currentPage}`;
			this.isBusy = true;
			this.fetchData();
			console.log(this.apiUrl);
			console.log(this.articles);
		},
		fetchSearchedNews() {
			this.resetData();
			this.apiUrl = `https://newsapi.org/v2/everything?q=${this.searchValue}&pageSize=${this.maxPerPage}&apiKey=${this.apiKey}&sortBy=${this.sortBy}&language=${this.language}&from=${this.fromDate}&to=${this.toDate}&page=${this.currentPage}`;
			this.isBusy = true;
			this.fetchData();
		},
		fetchData() {
			let req = new Request(this.apiUrl);
			fetch(req)
				.then((resp) => resp.json())
				.then((data) => {
					this.totalResults = data.totalResults;
					console.log(this.totalResults);
					data.articles.forEach((element) => {
						this.articles.push(element);
					});
					this.loading = false;
				})
				.catch((err) => {
					console.log("Have some problems:", err);
				});
		},
		fetchSwitch() {
			if (this.searchValue == null || this.searchValue == "") {
				this.fetchNews();
			} else {
				this.fetchSearchedNews();
			}
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			console.log(`current page: ${this.currentPage}`);
			this.fetchSwitch();
		},
		getUserConfig() {
			firebase
				.database()
				.ref("userConfig/" + this.userId)
				.get()
				.then((snapshot) => {
					if (snapshot.exists()) {
						this.sortBy = snapshot.val().sortBy;
						this.maxPerPage = snapshot.val().pageSize;
						this.language = snapshot.val().language;
						this.category = snapshot.val().category;
						this.country = snapshot.val().country;
						console.log(snapshot.val());
						this.fetchSwitch();
					} else {
						console.log("No data available");
					}
				})
				.catch((error) => {
					console.error(error);
				});
		},
	},
	created() {
		this.fetchNews();
		this.showValue();
		this.setDate();
		this.getUserConfig();
	},
	watch: {
		searchValue(newValue) {
			this.searchValue = newValue;
			console.log(this.searchValue);
			this.currentPage = 1;
			this.fetchSwitch();
		},
		language(newValue) {
			this.language = newValue;
			this.loading = true;
			this.currentPage = 1;
			this.fetchSwitch();
		},
		sortBy(newValue) {
			this.sortBy = newValue;
			console.log(this.sortBy);
			this.currentPage = 1;
			this.loading = true;
			this.fetchSwitch();
		},
		pickerDate(newValue) {
			this.fromDate = moment(newValue[0]).format("YYYY-MM-DDTHH:mm:ss");
			this.toDate = moment(newValue[1]).format("YYYY-MM-DDTHH:mm:ss");
			this.currentPage = 1;
			console.log("From: ", this.fromDate, " To: ", this.toDate);
			this.fetchSwitch();
		},
		maxPerPage(newValue) {
			this.maxPerPage = newValue;
			this.currentPage = 1;
			this.fetchSwitch();
		},
		totalResults(newValue) {
			this.totalResults = newValue;
			this.pages = this.totalResults / this.maxPerPage;
			console.log(this.pages);
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
	height: auto;
	margin-left: 10%;
	border-radius: 2.604vw;
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
