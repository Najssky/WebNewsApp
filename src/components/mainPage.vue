<template>
	<div class="app">
		<el-menu
			:default-active="activeIndex2"
			class="el-menu-demo"
			mode="horizontal"
			@select="handleSelect"
			background-color="gray"
			text-color="#fff"
			active-text-color="#ffd04b"
		>
			<el-menu-item index="1"
				><router-link :to="{ name: 'signIn' }"
					>Sign in</router-link
				></el-menu-item
			>
			<el-menu-item index="2"
				><router-link :to="{ name: 'signUp' }"
					>Sign up</router-link
				></el-menu-item
			>
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
export default {};
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
