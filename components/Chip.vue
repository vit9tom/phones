<template>
	<div 
		class="chip" 
		:class="{selected: selected}" 
		@click="toggle"
	>
		<div class="company">{{company}}</div>
		<!-- <div class="quantity">{{quantity}}</div> -->
	</div>
</template>

<script>
	import phonesQuery from '~/apollo/queries/phones/phones'
	export default {
		props: ['company', 'selected'],
		// здесь надо получить кол-во смартфонов определённой марки из БД
		// разделять выделенные и нет, наследовать пропс, записывать в стор,
		methods: {
			toggle() {
				// this.selected = !this.selected;
				this.$store.dispatch('TOGGLE_CHIP', this.company);
			}
		},
		apollo: {
		    phones: {
		    	prefetch: true,
		    	query: phonesQuery
		    }
		},
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