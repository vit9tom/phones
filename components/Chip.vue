<template>
	<div 
		class="chip" 
		:class="{selected: selected}" 
		@click="toggle"
	>
		<div class="company">{{company}}</div>
	</div>
</template>

<script>
	export default {
		props: ['company', 'selected'],
		methods: {
			toggle() {
				this.$store.dispatch('TOGGLE_CHIP', this.company);
			}
		}
	}
</script>

<style>
	.chip {
		background: #ccc;
		padding: 5px 8px;
		cursor: pointer;
		margin-right: 5px;
		border-radius: 2px;
	}

	.selected {
		background: indigo;
		color: #fff;
	}
</style>