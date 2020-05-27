<template>
	<div id="chips_wrapper">
		<template v-for="company in companies">
			<Chip :company="company" :selected="selectedCompanies.includes(company)" />
		</template>
	</div>
</template>

<script>
	import Chip from '~/components/Chip.vue'
	export default {
		props: ['selectedCompanies'],
		components: {
			Chip
		},
		data() {
			return {
				companies: ['Apple', 'Sony', 'Samsung', 'Nokia', 'Huawei']
			}; 
		},
		methods: {
		}
	}
</script>

<style>
	#chips_wrapper {
		width: 100%;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		-webkit-flex-direction: row;
		-moz-flex-direction: row;
		-ms-flex-direction: row;
		-o-flex-direction: row;
		flex-direction: row;
		flex-wrap: wrap;
	}
</style>