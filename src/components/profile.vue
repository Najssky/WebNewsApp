<template>
	<div class="app">
		<el-menu
			class="el-menu-demo"
			mode="horizontal"
			background-color="gray"
			text-color="#fff"
			active-text-color="#ffd04b"
			><template class="navbar">
				<el-menu-item> Hi {{ user.login }}! </el-menu-item>
				<el-menu-item @click="signOut">
					Sign Out
				</el-menu-item>
				<el-menu-item>
					<router-link :to="{ name: 'mainPage' }">
						Back to home page
					</router-link>
				</el-menu-item>
			</template>
		</el-menu>
		<div class="profileData">
			<div class="container">
				<h1>
					Choose/edit your news searching options
				</h1>

				<div class="searchOption">
					<i class="el-icon-news">Top News Category</i>
					<el-select
						v-model="category"
						placeholder="Choose your category:"
					>
						<el-option
							v-for="item in categoriesOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</div>
				<div class="searchOption">
					<i class="el-icon-news">News sorting:</i>
					<el-select v-model="sortBy" placeholder="Sort by:">
						<el-option label="By publish date" value="published_on">
						</el-option>
						<el-option label="By relevancy" value="relevance_score">
						</el-option>
					</el-select>
				</div>
				<div class="searchOption">
					<i class="el-icon-news">News language</i>
					<el-select
						v-model="language"
						placeholder="Choose your language:"
					>
						<el-option
							v-for="item in languageOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</div>
			</div>

			<div class="favoritesNews">
				<el-button @click="writeUserData">Save your options</el-button>
				<br />
				<h1>Your favorites</h1>
				<el-button
					v-for="(favorite, index) in favorites"
					:key="index"
					style="display:block; margin:0 0 10px 50px"
					@click="buttonHref(favorite)"
				>
					{{ favorite }}
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";

export default {
	data() {
		return {
			favorites: [],
			sortBy: "",
			maxPerPage: "",
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
			isEditing: false,
			database: firebase.database(),
		};
	},
	methods: {
		signOut() {
			sessionStorage.clear();
			localStorage.clear();
			this.$store.dispatch("logout");
			this.$router.replace({
				name: "mainPage",
			});
		},
		writeUserData() {
			firebase
				.database()
				.ref("Users/" + this.user.login + "/Preferences")
				.set({
					categories: this.category,
					sortBy: this.sortBy,
					language: this.language,
				});
			alert("Your preferences have been saved!");
		},
		getUserConfig() {
			firebase
				.database()
				.ref("Users/" + this.user.login + "/Preferences")
				.get()
				.then((snapshot) => {
					if (snapshot.exists()) {
						console.log;
						this.sortBy = snapshot.val().sortBy;
						this.language = snapshot.val().language;
						this.category = snapshot.val().categories;
					} else {
						console.log("No data available");
					}
				})
				.catch((error) => {
					console.error(error);
				});
		},
		getFavorites() {
			firebase
				.database()
				.ref("Users/" + this.user.login + "/Favorites")
				.get()
				.then((snapshot) => {
					if (snapshot.exists()) {
						snapshot.val().forEach((element) => {
							this.favorites.push(element);
						});
					} else {
						console.log("No data available");
					}
				})
				.catch((error) => {
					console.error(error);
				});
			console.log(this.favorites);
		},
		buttonHref(value) {
			window.open(value);
		},
	},
	computed: {
		...mapGetters({
			status: "authStatus",
			user: "user",
		}),
	},
	created() {
		this.getUserConfig();
		this.getFavorites();
	},
	watch: {
		maxPerPage(newValue) {
			this.maxPerPage = newValue;
		},
		language(newValue) {
			this.language = newValue;
		},
		country(newValue) {
			this.country = newValue;
		},
		category(newValue) {
			this.category = newValue;
		},
		sortBy(newValue) {
			this.sortBy = newValue;
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
.profileData {
	width: 80%;
	min-height: 500px;
	background: gray;
	margin: 50px 10% 0 10%;
	-webkit-border-radius: 50px;
	-moz-border-radius: 50px;
	border-radius: 50px;
	font-family: "roboto";
	padding-top: 10px;
	padding-bottom: 10px;
}
.searchOption {
	display: inline-flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: 20px;
	margin-left: 10px;
	margin-top: 20px;
	flex-direction: column;
	float: left;
}
.container {
	margin: auto;
}
.el-select {
	margin-top: 10px;
}
.el-button {
	display: inline-flex;
	justify-content: center;
	flex-direction: column;
	clear: both;
}
.profileData h1 {
	text-align: center;
	font-family: "Roboto", sans-serif;
	color: white;
}
.favoritesNews {
	clear: both;
}
</style>
