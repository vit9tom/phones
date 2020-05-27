import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
  	searchQuery: "",
    selectedCompanies: ['Apple', 'Sony', 'Samsung', 'Nokia', 'Huawei'],
    range: [0, 200000],
    minPrice: 0,
    maxPrice: 200000,
    phones: [],
    hasDiscount: false,
    hasCredit: false,
    memoryRange: [0, 7]
  },
  mutations: {
    toggleChip (state, company) {
      if (state.selectedCompanies.includes(company)) {
      	state.selectedCompanies = state.selectedCompanies.filter(item => item !== company);
      } else {
      	state.selectedCompanies.push(company);
      }
    },
    setPriceRange (state, range) {
    	state.range = range;
    },
    setMinPrice (state, minPrice) {
    	state.minPrice = minPrice;
    },
    setMaxPrice (state, maxPrice) {
    	state.maxPrice = maxPrice;
    },
    setMinRangePrice (state, minPrice) {
    	state.range[0] = minPrice;
    },
    setMaxRangePrice (state, maxPrice) {
    	state.range[1] = maxPrice;
    },
    setSearchQuery (state, query) {
    	state.searchQuery = query;
    },
    setDiscount (state, value) {
    	state.hasDiscount = value;
    },
    setCredit (state, value) {
    	state.hasCredit = value;
    },
    setPhones (state, phones) {
    	state.phones = phones;
    }
  },
  actions: {
  	TOGGLE_CHIP: ({commit, dispatch, state}, company) => {
  		commit('toggleChip', company);
  		dispatch('GET_PHONES');
  	},
  	GET_PRICE_RANGE: async ({commit, dispatch, state}, {companies, queryString}) => {
  		const client = new ApolloClient({
		  link: createHttpLink({ uri: "http://localhost:1337/graphql" }),
		  cache: new InMemoryCache()
		});
		const res = await client.query({
	        query: gql`
			  query getPriceRange($companies: [String!], $queryString: String) {  
			  phones(
			    where: {
			      company_in: $companies,
		    	  name_contains: $queryString
			    },
			    sort: "price"
			  ) {
			    price
			  }
			}
			`, 
	        variables: {
	          companies,
	          queryString
	        } 
	    });
	    const minPrice = res.data.phones[0].price;
	    const maxPrice = res.data.phones.pop().price;
  		commit('setPriceRange', [minPrice, maxPrice]);
  		commit('setMinPrice', minPrice);
  		commit('setMaxPrice', maxPrice);
  	},
  	SET_MIN_RANGE_PRICE: ({commit, dispatch, state}, {minPrice}) => {
  		commit('setMinRangePrice', minPrice);
  		dispatch('GET_PHONES');
  	},
  	SET_MAX_RANGE_PRICE: ({commit, dispatch, state}, {maxPrice}) => {
  		commit('setMaxRangePrice', maxPrice);
  		dispatch('GET_PHONES');
  	},
  	SET_PRICE_RANGE: ({commit, dispatch, state}, {range}) => {
  		commit('setPriceRange', range);
  		dispatch('GET_PHONES');
  	},
  	SET_SEARCH: ({commit, dispatch, state}, {queryString}) => {
  		commit('setSearchQuery', queryString);
  		dispatch('GET_PHONES');
  	},
  	SET_DISCOUNT: ({commit, dispatch, state}, {value}) => {
  		commit('setDiscount', value);
  		dispatch('GET_PHONES');
  	},
  	SET_CREDIT: ({commit, dispatch, state}, {value}) => {
  		commit('setCredit', value);
  		dispatch('GET_PHONES');
  	},
  	GET_PHONES: async ({commit, state}) => {
  		const client = new ApolloClient({
		  link: createHttpLink({ uri: "http://localhost:1337/graphql" }),
		  cache: new InMemoryCache()
		});
		const companies = state.selectedCompanies;
		const queryString = state.searchQuery;
		const minPrice = state.range[0];
		const maxPrice = state.range[1];
		const minDiscount = state.hasDiscount ? 1 : 0;
		const minCredit = state.hasCredit ? 1 : 0;
		const res = await client.query({
	        query: gql`
			  query getPhones(
			  	$companies: [String!], 
			  	$queryString: String, 
			  	$minPrice: Int, 
			  	$maxPrice: Int,
			  	$minDiscount: Int,
			  	$minCredit: Int
			  	) {  
			  phones(
			    where: {
			    	company_in: $companies,
			    	name_contains: $queryString,
					price_gte: $minPrice,
					price_lte: $maxPrice,
					sale_gte: $minDiscount,
					creditTerm_gte: $minCredit
			    }
			  ) {
			    id
			    name
			    price
			    creditTerm
			    sale
			    rating
			    company
			    photos {
			      url
			    }
			  }
			}
			`, 
	        variables: {
	          companies,
	          queryString,
	          minPrice,
	          maxPrice,
	          minDiscount,
	          minCredit
	        } 
	    });
		commit('setPhones', res.data.phones);
  	},
  }
})

export default store