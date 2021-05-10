<template>
	<div id="app">
		<div></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			articles: [],
			title: "",
			description: "",
		};
	},
	async created() {
		try {
			let { data } = await this.$axios.get(
				"https://newsapi.org/v2/everything?q=Apple&from=2021-04-15&sortBy=popularity&apiKey=fa6b08f1472043538a7ae22d2ff6d84c",
			);
			this.articles = data;
			this.title = this.articles.title;
			this.description = data.description;
			console.log("Data downloaded", this.articles);
			console.log("Elements", this.title);
		} catch (e) {
			console.log("Async Error", e);
		}
	},
};
</script>

<style></style>
