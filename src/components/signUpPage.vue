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
				:model="ruleForm"
				status-icon
				:rules="rules"
				ref="ruleForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="Login" prop="login">
					<el-input
						type="login"
						v-model="ruleForm.login"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="Password" prop="pass">
					<el-input
						type="password"
						v-model="ruleForm.pass"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="Confirm" prop="checkPass">
					<el-input
						type="password"
						v-model="ruleForm.checkPass"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')"
						>Submit</el-button
					>
					<el-button @click="resetForm('ruleForm')">Reset</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		var validateLogin = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("Please input the login"));
			}
		};
		var validatePass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("Please input the password"));
			} else {
				if (this.ruleForm.checkPass !== "") {
					this.$refs.ruleForm.validateField("checkPass");
				}
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("Please input the password again"));
			} else if (value !== this.ruleForm.pass) {
				callback(new Error("Two inputs don't match!"));
			} else {
				callback();
			}
		};
		return {
			ruleForm: {
				login: "",
				pass: "",
				checkPass: "",
			},
			rules: {
				login: [{ validator: validateLogin, trigger: "blur" }],
				pass: [{ validator: validatePass, trigger: "blur" }],
				checkPass: [{ validator: validatePass2, trigger: "blur" }],
			},
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					alert("submit!");
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
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
