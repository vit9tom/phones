<template>
	<v-layout
	column
	justify-center
	align-center
	>
	<div class="page_container">
		<h1>{{phone.name}}</h1>
		<v-app>
			<div class="flex_row">
				<v-carousel
				v-if="isLoaded"
				height="400"
				style="width: 300px"
				>
				<v-carousel-item
				v-for="(photo, i) in phone.photos"
				:key="i"
				:src="'http://localhost:1337' + photo.url"
				contain
				>
			</v-carousel-item>
		</v-carousel>
		
		<div id="description">
			<p><span class="light">Операционная система:</span> {{phone.OS}}</p>
			<p><span class="light">Количество SIM-карт:</span> {{phone.cards}}</p>
			<p><span class="light">Встроенная память:</span> {{phone.memory}}Гб</p>
			<p><span class="light">Цвет:</span> {{phone.color}}</p>
			<Rating :rating="phone.rating" id="rating"/>
			<div class="other_colors" v-if="hasOtherColors">
				<p><span class="light">Другие цвета:</span></p>
				<router-link v-for="item in phone.other_colors" :to="'/phones/'+item.id">
					<p>{{item.color}}</p>
				</router-link>
			</div>
		</div>

		<v-card
		class="mx-auto card"
		width="400"
		height="250"
		>
		<div id="price">{{phone.price}} &#8381</div>
		<div id="discount_price_cont" v-if="hasDiscount">
			<span id="discount_price">{{discountPrice}} &#8381</span>
			<span id="discount_price_text">Цена по акции</span>
		</div>
		<p v-if="hasCredit">Рассрочка на {{phone.creditTerm}} {{months}}</p>
		<v-btn x-large dark width="250" color="purple" class="btn">КУПИТЬ</v-btn>
	</v-card>
	
</div>
</v-app>
</div>
</v-layout>
</template>

<script>
	import gql from 'graphql-tag'
	import { ApolloClient } from 'apollo-client'
	import { createHttpLink } from "apollo-link-http";
	import { InMemoryCache } from "apollo-cache-inmemory";
	import Rating from '~/components/Rating.vue'
	export default {
		components: {
			Rating
		},
		data() {
			return {
				isLoaded: false,
				phone: {
					photos: [
					{url: ''}
					]
				}
			}
		},
		computed: {
			hasOtherColors() {
				if (this.phone.other_colors) return !!this.phone.other_colors.length;
			},
			hasDiscount() {
				if (this.phone.sale) return !!this.phone.sale;
			},
			discountPrice() {
				if (this.phone.price) return Math.floor(this.phone.price*(100-this.phone.sale)/100);
			},
			hasCredit() {
				if (this.phone.creditTerm) return !!this.phone.creditTerm;
			},
			months() {
				const lastDigit = this.phone.creditTerm % 10;
				if (lastDigit === 1) {
					return 'месяц';
				} else if (lastDigit > 1 && lastDigit < 5) {
					return 'месяца';
				} else {
					return 'месяцев';
				}
			}
		},
		created() {
			this.getPhone();
		},
		methods: {
			async getPhone() {
				const client = new ApolloClient({
					link: createHttpLink({ uri: "http://localhost:1337/graphql" }),
					cache: new InMemoryCache()
				});
				const id = this.$route.params.id;
				const res = await client.query({
					query: gql`
					query getPhone($id: ID!) {  
						phone(id: $id) {
							OS
							cards
							color
							name
							price
							memory
							creditTerm
							sale
							rating
							photos {
								url
							}
							other_colors {
								color,
								id
							}
						}
					}
					`, 
					variables: {
						id
					} 
				});
				this.phone = Object.assign({}, res.data.phone)
				this.isLoaded = true;
			}
		}
	}
</script>

<style scoped>
.page_container {
	background: #fff;
	padding: 30px;
}

h1 {
	margin-bottom: 30px;
}

.flex_row {
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

#description {
	margin: 30px;
	min-width: 250px;
}

.light {
	color: #777;
}

#rating {
	margin: 20px 0;
}

#price {
	font-weight: bold;
	font-size: 34px;
	margin-bottom: 15px;
}

.card {
	padding: 25px;
	margin-top: 30px;
}

#discount_price_cont {
	margin: 15px 0;
}

#discount_price {
	font-size: 20px;
	font-weight: bold;
	color: #D81B60;
}

#discount_price_text {
	margin-left: 15px;
}

@media (max-width: 600px) {
	.flex_row {
		-webkit-flex-direction: column;
		-moz-flex-direction: column;
		-ms-flex-direction: column;
		-o-flex-direction: column;
		flex-direction: column;
		-ms-align-items: center;
		align-items: center;
	}

	.page_container {
		padding: 10px;
	}
}
</style>