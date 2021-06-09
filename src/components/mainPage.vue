<template>
	<div class="app">
		<el-menu
			class="el-menu-demo"
			mode="horizontal"
			background-color="gray"
			text-color="#fff"
			active-text-color="#ffd04b"
			><template class="navbar" v-if="status === 'success'">
				<el-menu-item> Hi {{ user.login }}! </el-menu-item>
				<el-menu-item @click="signOut">
					Sign Out
				</el-menu-item>
				<el-menu-item>
					<router-link :to="{ name: 'profile' }">
						Your profile
					</router-link>
				</el-menu-item>
			</template>
			<div class="navbar" v-else>
				<router-link :to="{ name: 'signIn' }">
					<el-menu-item>
						Sign in
					</el-menu-item>
				</router-link>
				<router-link :to="{ name: 'signUp' }">
					<el-menu-item>
						Sign up
					</el-menu-item>
				</router-link>
			</div>
		</el-menu>
		<el-row>
			<el-col :span="8">
				<el-card :body-style="{ padding: '0px' }">
					<img src="../img/news-2444888_1280.jpg" class="image" />
					<div style="padding: 14px;background: gray;">
						<span>Everything</span>
						<div class="bottom clearfix">
							<router-link :to="{ name: 'news' }">
								<el-button type="text" class="button">
									Show everything news!
								</el-button>
							</router-link>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card :body-style="{ padding: '0px' }">
					<img
						src="../img/the-gap-message-2310064_1280.jpg"
						class="image"
					/>
					<div style="padding: 14px; background: gray;">
						<span> Top headlines </span>
						<div class="bottom clearfix">
							<router-link :to="{ name: 'topNews' }">
								<el-button type="text" class="button">
									Show top headline news!
								</el-button>
							</router-link>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	computed: {
		...mapGetters({
			status: "authStatus",
			user: "user",
		}),
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
	background: rgb(49, 49, 49);
}
.navbar {
	display: flex;
}
.app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
}
.el-card {
	border: black;
}
.el-row {
	justify-content: space-around;
}
.el-col {
	margin-left: 10%;
	margin-top: 10%;
}
.bottom {
	margin-top: 13px;
	line-height: 12px;
}

.button {
	padding: 0;
	float: center;
	font-weight: bold;
	color: rgb(0, 68, 177);
}

.image {
	width: 100%;
	display: block;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: "";
}

.clearfix:after {
	clear: both;
}
</style>
