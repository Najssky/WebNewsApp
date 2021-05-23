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
			<el-menu-item-group> </el-menu-item-group>
			<el-submenu index="2">
				<template slot="title">
					<i class="el-icon-s-flag"></i> Countries
				</template>
				<el-menu-item-group>
					<el-menu-item index="2-1">
						<el-select
							v-model="country"
							placeholder="Choose your country:"
						>
							<el-option
								v-for="item in countryOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title">
					<i class="el-icon-price-tag"></i> Categories
				</template>
				<el-menu-item-group>
					<template slot="title">Choose your category::</template>
					<el-menu-item index="3-1">
						<el-select v-model="category">
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
			</el-submenu>
			<el-submenu index="4">
				<template slot="title"
					><i class="el-icon-news"></i>News per page
				</template>

				<el-menu-item-group>
					<el-menu-item index="4-1"
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
export default {
	data() {
		return {
			searchValue: null,
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
			country: "",
			countryOptions: [
				{ value: "ae", label: "United Arab Emirates" },
				{ value: "ar", label: "Argentina" },
				{ value: "at", label: "Austria" },
				{ value: "au", label: "Australia" },
				{ value: "be", label: "Belgium" },
				{ value: "bg", label: "Bulgaria" },
				{ value: "br", label: "Brazil" },
				{ value: "ca", label: "Canada" },
				{ value: "ch", label: "Switzerland" },
				{ value: "cn", label: "China" },
				{ value: "co", label: "Colombia" },
				{ value: "cu", label: "Cuba" },
				{ value: "cz", label: "Czechia" },
				{ value: "de", label: "Germany" },
				{ value: "eg", label: "Egypt" },
				{ value: "fr", label: "Frances" },
				{ value: "gb", label: "United Kingdom of Great Britain" },
				{ value: "gr", label: "Greece" },
				{ value: "hk", label: "Hong Kongs" },
				{ value: "hu", label: "Hungary" },
				{ value: "id", label: "Indonesia" },
				{ value: "ie", label: "Ireland" },
				{ value: "il", label: "Israel" },
				{ value: "in", label: "India" },
				{ value: "it", label: "Italy" },
				{ value: "jp", label: "Japan" },
				{ value: "kr", label: "Korea" },
				{ value: "lt", label: "Lithuania" },
				{ value: "lv", label: "Latvia" },
				{ value: "ma", label: "Morocco" },
				{ value: "mx", label: "Mexico" },
				{ value: "my", label: "Malaysia" },
				{ value: "ng", label: "Nigeria" },
				{ value: "nl", label: "Netherlands" },
				{ value: "no", label: "Norway" },
				{ value: "nz", label: "New Zealand" },
				{ value: "ph", label: "Philippines" },
				{ value: "pl", label: "Poland" },
				{ value: "pt", label: "Portugal" },
				{ value: "ro", label: "Romania" },
				{ value: "rs", label: "Serbia" },
				{ value: "ru", label: "Russia" },
				{ value: "sa", label: "Saudi Arabia" },
				{ value: "se", label: "Sweden" },
				{ value: "sg", label: "Singapore" },
				{ value: "si", label: "Slovenia" },
				{ value: "sk", label: "Slovakia" },
				{ value: "th", label: "Thailand" },
				{ value: "tr", label: "Turkey" },
				{ value: "tw", label: "Taiwan" },
				{ value: "ua", label: "Ukraine" },
				{ value: "us", label: "United States of America" },
				{ value: "ve", label: "Venezuela" },
				{ value: "za", label: "South Africa" },
			],
			category: "business",
			categoriesOptions: [
				{ value: "business", label: "Business" },
				{ value: "entertainment", label: "Entertainment" },
				{ value: "general", label: "General" },
				{ value: "health", label: "Science" },
				{ value: "sports", label: "Sports" },
				{ value: "technology", label: "Technology" },
				{ value: "science", label: "Science" },
			],
		};
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
		handleSelect(key, keyPath) {
			console.log(key, keyPath);
		},
		resetData() {
			this.articles = [];
		},
		fetchNews() {
			this.resetData();
			this.apiUrl = `https://newsapi.org/v2/top-headlines?apiKey=${this.apiKey}&country=${this.country}&category=${this.category}&pageSize=${this.maxPerPage}&page=${this.currentPage}`;
			this.isBusy = true;
			this.fetchData();
			console.log(this.apiUrl);
			console.log(this.articles);
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
		handleCurrentChange(val) {
			this.currentPage = val;
			console.log(`current page: ${this.currentPage}`);
			this.isLoading = true;
			this.fetchNews();
		},
	},
	created() {
		this.fetchNews();
		this.showValue();
		this.setDate();
	},
	watch: {
		maxPerPage(newValue) {
			this.maxPerPage = newValue;
			this.currentPage = 1;
			this.fetchNews();
		},
		totalResults(newValue) {
			this.totalResults = newValue;
			this.pages = this.totalResults / this.maxPerPage;
			console.log(this.pages);
		},
		category(newValue) {
			this.category = newValue;
			this.currentPage = 1;
			this.fetchNews();
		},
		country(newValue) {
			this.country = newValue;
			this.currentPage = 1;
			this.fetchNews();
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
