<template>
	<div>
		<el-menu
			class="el-menu-demo"
			mode="horizontal"
			background-color="gray"
			text-color="#fff"
			active-text-color="#ffd04b"
		>
			<el-menu-item index="1">
				<router-link :to="{ name: 'mainPage' }">
					Back to home page
				</router-link>
			</el-menu-item>
		</el-menu>
		<div class="container">
			<el-form
				:model="loginForm"
				status-icon
				:rules="rules"
				ref="loginForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="Login" prop="login">
					<el-input
						type="login"
						v-model="loginForm.login"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="Password" prop="pass">
					<el-input
						type="password"
						v-model="loginForm.pass"
						autocomplete="off"
					>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('loginForm')">
						Sign in
					</el-button>
					<el-button @click="resetForm('loginForm')">
						Reset
					</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import firebase from "firebase";
import bcrypt from "bcryptjs";

export default {
	data() {
		var validateEmail = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("Please input the e-mail"));
			} else {
				callback();
			}
		};
		var validatePass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("Please input the password"));
			} else {
				callback();
			}
		};
		return {
			loginForm: {
				login: "",
				pass: "",
			},
			rules: {
				email: [{ validator: validateEmail, trigger: "blur" }],
				pass: [{ validator: validatePass, trigger: "blur" }],
			},
			comparePass: false,
		};
	},
	methods: {
		submitForm() {
			try {
				firebase
					.database()
					.ref("Users/" + this.loginForm.login + "/credentials")
					.get()
					.then((snapshot) => {
						if (snapshot.exists()) {
							this.userAuth(
								snapshot.val().login,
								snapshot.val().password,
							);
						} else {
							console.log("No data available");
						}
					});
			} catch (error) {
				console.log("Something goes wrong: /n", error);
			}
		},
		resetForm(loginForm) {
			this.$refs[loginForm].resetFields();
		},
		userAuth(login, password) {
			this.comparePass = bcrypt.compareSync(
				this.loginForm.pass,
				password,
			);
			console.log(this.comparePass);
			console.log(login);
			if (this.loginForm.login == login && this.comparePass == true) {
				let login = this.loginForm.login;
				this.$store.dispatch("login", { login });
				alert("Sign in successfully");
				this.$router.replace({ name: "mainPage" });
			} else {
				alert("Something goes wrong. Check your login data!");
			}
		},
	},
};
</script>
<style scoped>
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-top: 25px;
	height: 500px;
}
</style>
