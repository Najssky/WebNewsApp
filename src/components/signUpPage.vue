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
				:model="regForm"
				status-icon
				:rules="rules"
				ref="regForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="Login" prop="login">
					<el-input
						type="login"
						v-model="regForm.login"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="Email" prop="email">
					<el-input
						type="email"
						v-model="regForm.email"
						autocomplete="off"
					></el-input>
				</el-form-item>

				<el-form-item label="Password" prop="pass">
					<el-input
						type="password"
						v-model="regForm.pass"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="Confirm" prop="checkPass">
					<el-input
						type="password"
						v-model="regForm.checkPass"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('regForm')"
						>Submit</el-button
					>
					<el-button @click="resetForm('regForm')">Reset</el-button>
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
				callback(new Error("Please input the email"));
			} else {
				callback();
			}
		};
		var validateLogin = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("Please input the login"));
			} else {
				callback();
			}
		};
		var validatePass = (rule, value, callback) => {
			if (value === "" || value.length < 4) {
				callback(new Error("Please input the password"));
			} else {
				if (this.regForm.checkPass !== "") {
					this.$refs.regForm.validateField("checkPass");
				}
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("Please input the password again"));
			} else if (value !== this.regForm.pass) {
				callback(new Error("Two inputs don't match!"));
			} else {
				callback();
			}
		};
		return {
			regForm: {
				email: "",
				login: "",
				pass: "",
				checkPass: "",
			},
			rules: {
				email: [{ validator: validateEmail, trigger: "blur" }],
				login: [{ validator: validateLogin, trigger: "blur" }],
				pass: [{ validator: validatePass, trigger: "blur" }],
				checkPass: [{ validator: validatePass2, trigger: "blur" }],
			},
			hashedPassword: "",
		};
	},
	methods: {
		submitForm() {
			this.$refs.regForm.validate((valid) => {
				if (valid) {
					try {
						this.hashedPassword = this.encryptPassword(
							this.regForm.pass,
						);
						firebase
							.database()
							.ref("Users/" + this.regForm.login + "/Credentials")
							.set({
								login: this.regForm.login,
								email: this.regForm.email,
								password: this.hashedPassword,
							});
						alert("User added successfully");
						this.$router.replace({ name: "mainPage" });
					} catch (error) {
						console.log("Something goes wrong: /n", error);
					}
				}
			});
		},
		resetForm(regForm) {
			this.$refs[regForm].resetFields();
		},
		encryptPassword(password) {
			const salt = bcrypt.genSaltSync(11);
			return bcrypt.hashSync(password, salt);
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
