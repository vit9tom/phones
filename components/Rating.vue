<template>
	<div id="rating" >
		<div id="stars">
			<img src="~/assets/img/rate.svg" alt="">
		</div>
		<div id="rating_bar" ref="rating_bar">
			<img src="~/assets/img/filled-stars.svg" alt="">
		</div>
	</div>
</template>

<script>
	export default {
		props: ['rating'],
		watch: {
			rating: function (val) {
				const ratingPercents = 100 * val / 5;
				const ratingBar = this.$refs.rating_bar;
				ratingBar.style.width = `${ratingPercents}%`;
			}
		}
	}
</script>

<style scoped>
	#rating {
		position: relative;
		display: inline-block;
	}

	#rating_bar {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
	}
</style>