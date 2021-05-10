<template>
	<el-container>
		<el-menu>
			<el-submenu index="1">
				<template slot="title"
					><i class="el-icon-search"></i>Search your news</template
				>
				<el-menu-item-group>
					<el-menu-item index="1-1">
						<el-input
							placeholder="Type something"
							v-model="searchValue"
						>
						</el-input>
						<i
							class="el-icon-search"
							@click="fetchSearchedNews"
						></i>
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-submenu index="2">
				<template slot="title">
					<i class="el-icon-date"></i>Pick a date
				</template>
				<el-menu-item-group>
					<el-menu-item index="2-1">
						<el-date-picker
							v-model="value"
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
					<el-menu-item index="2-2" @click="datePicker">
						<p>Component value：{{ value }}</p>
					</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title"
					><i class="el-icon-setting"></i>Rest of searching options
				</template>
				<el-menu-item-group>
					<template slot="title">Group 1</template>
					<el-menu-item index="3-1">Option 1</el-menu-item>
					<el-menu-item index="3-2">Option 2</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="Group 2">
					<el-menu-item index="3-3">Option 3</el-menu-item>
				</el-menu-item-group>
				<el-submenu index="3-4">
					<template slot="title">Option 4</template>
					<el-menu-item index="3-4-1">Option 4-1</el-menu-item>
				</el-submenu>
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
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
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
			value: [],
			value2: [],
			apiUrl: "",
			apiKey: "fa6b08f1472043538a7ae22d2ff6d84c",
			articles: [],
			isLoading: false,
			currentPage: 1,
			maxPerPage: 10,
			totalResults: null,
			loading: true,
			currentDate: "",
			fromDate: "",
			toDate: "",
		};
	},
	methods: {
		showValue() {
			console.log(this.searchValue);
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
			this.currentPage = 1;
			this.articles = [];
		},
		fetchNews() {
			this.apiUrl =
				"https://newsapi.org/v2/everything?q=a&pageSize=" +
				this.maxPerPage +
				"&apiKey=" +
				this.apiKey;
			this.isBusy = true;

			this.resetData();
			this.fetchData();
		},
		fetchSearchedNews() {
			if (this.searchValue == null || this.searchValue == "") {
				this.fetchNews();
			} else {
				this.apiUrl =
					"https://newsapi.org/v2/everything?q=" +
					this.searchValue +
					"&pageSize=" +
					this.maxPerPage +
					"&apiKey=" +
					this.apiKey;
				this.isBusy = true;

				this.resetData();
				this.fetchData();
			}
		},
		fetchData() {
			let req = new Request(this.apiUrl + "&page=" + this.currentPage);
			fetch(req)
				.then((resp) => resp.json())
				.then((data) => {
					this.totalResults = data.totalResults;
					data.articles.forEach((element) => {
						this.articles.push(element);
					});
					this.loading = false;
				})
				.catch((err) => {
					console.log("Have some problems:", err);
				});
		},
	},
	created() {
		this.fetchNews();
	},
	watch: {
		searchValue(newValue) {
			this.searchValue = newValue;
			console.log(this.searchValue);
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
.result-list {
	padding-top: 60px;
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
