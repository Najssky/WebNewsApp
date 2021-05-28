<template>
	<div class="app">
		<el-menu
			class="el-menu-demo"
			mode="horizontal"
			background-color="gray"
			text-color="#fff"
			active-text-color="#ffd04b"
			><template class="navbar">
				<el-menu-item> Hi {{ user.data.displayName }}! </el-menu-item>
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
			<h1
				style="text-align: center; font-family: 'Roboto', sans-serif;color:white;"
			>
				Choose/edit your news searching options
			</h1>
			<div class="container">
				<div class="searchOption">
					<i class="el-icon-news">News per page</i>

					<el-select
						v-model="maxPerPage"
						placeholder="News per page:"
					>
						<el-option label="5" value="5"> </el-option>
						<el-option label="10" value="10"> </el-option>
						<el-option label="15" value="15"> </el-option>
						<el-option label="20" value="20"> </el-option>
					</el-select>
				</div>
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
					<i class="el-icon-news">Top News Country</i>
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
				</div>
				<div class="searchOption">
					<i class="el-icon-news">News sorting:</i>
					<el-select v-model="sortBy" placeholder="Sort by:">
						<el-option label="By publish date" value="publishedAt">
						</el-option>
						<el-option label="By popularity" value="popularity">
						</el-option>
						<el-option label="By relevancy" value="relevancy">
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
			<el-button @click="writeUserData">Save your options</el-button>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";

export default {
	data() {
		return {
			sortBy: "",
			category: "",
			maxPerPage: "",
			categoriesOptions: [
				{ value: "business", label: "Business" },
				{ value: "entertainment", label: "Entertainment" },
				{ value: "general", label: "General" },
				{ value: "health", label: "Health" },
				{ value: "sports", label: "Sports" },
				{ value: "technology", label: "Technology" },
				{ value: "science", label: "Science" },
			],
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
			language: "",
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
			userId: this.$store.getters.user.data.userId,
			isEditing: false,
			database: firebase.database(),
		};
	},
	methods: {
		show() {
			console.log(this.email);
		},
		signOut() {
			console.log("here");
			firebase
				.auth()
				.signOut()
				.then(() => {
					this.$router.replace({
						name: "mainPage",
					});
				});
		},
		writeUserData() {
			firebase
				.database()
				.ref("userConfig/" + this.userId)
				.set({
					pageSize: this.maxPerPage,
					category: this.category,
					sortBy: this.sortBy,
					language: this.language,
					country: this.country,
				});
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
						console.log(snapshot.val().sortBy);
					} else {
						console.log("No data available");
					}
				})
				.catch((error) => {
					console.error(error);
				});
		},
	},
	computed: {
		...mapGetters({
			user: "user",
		}),
	},
	created() {
		this.getUserConfig();
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
	margin: 50px auto 0 auto;
	-webkit-border-radius: 50px;
	-moz-border-radius: 50px;
	border-radius: 50px;
	font-family: "roboto";
	padding-top: 10px;
}
.searchOption {
	display: inline-flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: 20px;
	margin-left: 10px;
	margin-top: 20px;
	flex-direction: column;
}
.container {
	width: 100%;
	margin-left: 11%;
}
.el-select {
	margin-top: 10px;
}
.el-button {
	display: inline-flex;
	justify-content: center;
	flex-direction: column;
}
</style>
