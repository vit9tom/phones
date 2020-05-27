<template>
	<v-card tile height="100%">
		<div class="wrapper">
			<div class="flex_item" @mouseover="onMouseOver" @mouseout="onMouseOut">
				<v-img 
					:src="'http://localhost:1337' + phone.photos[1].url" 
					alt="" height="200" 
					width="100%" 
					contain
					v-show="isMouseOver"
				></v-img>
				<v-img 
					:src="'http://localhost:1337' + phone.photos[0].url" 
					alt="" height="200" 
					width="100%" 
					contain
					v-show="!isMouseOver"
				>
					<template v-slot:placeholder>
				        <v-row
				          class="fill-height ma-0"
				          align="center"
				          justify="center"
				          width="100%"
				          style="margin: 90px"
				        >
				        	<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
				        </v-row>
				    </template>
				</v-img>
				<div id="name">{{phone.name}}</div>
				<div id="rating" v-if="hasRating">
					<div id="stars">
						<img src="~/assets/img/rate.svg" alt="">
					</div>
					<div id="rating_bar" ref="rating_bar">
						<img src="~/assets/img/filled-stars.svg" alt="">
					</div>
				</div>
			</div>
			<div class="credit" v-if="hasCredit">
				<div class="credit_numbers">0|0|{{phone.creditTerm}}</div>
				<div class="credit_text">рассрочка</div>
			</div>
			<div id="price_section">
				<div id="new_price" v-if="hasDiscount">{{newPrice}} &#8381 - по акции</div>
				<div class="flex-row">
					<div id="price">{{phone.price}} &#8381</div>
					<v-btn small dark>
				    	<v-icon dark>mdi-plus</v-icon>
				    </v-btn>
				</div>
			</div>
		</div>
	</v-card>
</template>

<script>
	export default {
		props: ['phone'],
		data() {
		  return {
		  	isMouseOver: false
		  }
		},
		computed: {
			hasCredit() {
				return !!this.phone.creditTerm;
			},
			hasDiscount() {
				return !!this.phone.sale;
			},
			newPrice() {
				return Math.floor(this.phone.price*(100 - this.phone.sale)/100);
			},
			hasRating() {
				return !!this.phone.rating;
			},
			ratingPercents() {
				return 100 * this.phone.rating / 5;
			}
		},
		mounted: function() {
			if (this.phone.rating) {
				const ratingBar = this.$refs.rating_bar;
				ratingBar.style.width = `${this.ratingPercents}%`;
			}
		},
		methods: {
			onMouseOver(e) {
				this.isMouseOver = true;
			},
			onMouseOut(e) {
				this.isMouseOver = false;
			}
		}
	}
</script>

<style>
	.wrapper {
		position: relative;
		padding: 15px;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		-webkit-flex-direction: column;
		-moz-flex-direction: column;
		-ms-flex-direction: column;
		-o-flex-direction: column;
		flex-direction: column;
		justify-content: space-between;
		-ms-align-items: stretch;
		align-items: stretch;
		height: 100%;
		cursor: pointer;
	}

	.image {
		height: 200px;
		width: 100%;
		position: relative;
	}

	#name {
		margin: 10px 0;
	}

	.credit {
		background: yellow;
		border-radius: 50%;
		position: absolute;
		left: 5px;
		top: 5px;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		-webkit-flex-direction: column;
		-moz-flex-direction: column;
		-ms-flex-direction: column;
		-o-flex-direction: column;
		flex-direction: column;
		justify-content: center;
		-ms-align-items: center;
		align-items: center;
		width: 60px;
		height: 60px;
	}

	.credit_text {
		font-size: 8px;
	    text-transform: uppercase;
	    font-weight: bold;
	}

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

	#price {
		font-size: 24px;
		font-weight: bold;
	}

	#new_price {
		font-size: 14px;
		font-weight: bold;
		color: #D81B60;
	}

	.flex-row {
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
		justify-content: space-between;
		-ms-align-items: center;
		align-items: center;
	}

	#price_section {
		margin-top: 20px;
	}
</style>