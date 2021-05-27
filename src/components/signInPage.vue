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
				<el-form-item label="Email" prop="email">
					<el-input
						type="email"
						v-model="loginForm.email"
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
					<el-button type="primary" @click="submitForm('ruleForm')">
						Sign in
					</el-button>
					<el-button @click="resetForm('ruleForm')">
						Reset
					</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import firebase from "firebase";

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
				email: "",
				pass: "",
			},
			rules: {
				email: [{ validator: validateEmail, trigger: "blur" }],
				pass: [{ validator: validatePass, trigger: "blur" }],
			},
		};
	},
	methods: {
		submitForm() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					firebase
						.auth()
						.signInWithEmailAndPassword(
							this.loginForm.email,
							this.loginForm.pass,
						)
						// eslint-disable-next-line
						.then((data) => {
							this.$router.replace({ name: "mainPage" });
						})
						.catch((err) => {
							this.error = err.message;
						});
					alert("submit!");
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		resetForm(loginForm) {
			this.$refs[loginForm].resetFields();
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
