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
    memoryRange: [0, 7],
    iOS: true,
    android: true,
    hasTwoSimCards: false
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
    setMemoryRange (state, range) {
    	state.memoryRange = range;
    },
    setIOS (state, value) {
    	state.iOS = value;
    },
    setAndroid (state, value) {
    	state.android = value;
    },
    setTwoSimCards (state, value) {
    	state.hasTwoSimCards = value;
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
  	SET_MEMORY_RANGE: ({commit, dispatch, state}, {range}) => {
  		commit('setMemoryRange', range);
  		dispatch('GET_PHONES');
  	},
  	SET_IOS: ({commit, dispatch, state}, {value}) => {
  		commit('setIOS', value);
  		dispatch('GET_PHONES');
  	},
  	SET_ANDROID: ({commit, dispatch, state}, {value}) => {
  		commit('setAndroid', value);
  		dispatch('GET_PHONES');
  	},
  	SET_TWO_SIM_CARDS: ({commit, dispatch, state}, {value}) => {
  		commit('setTwoSimCards', value);
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
		const memoryRangeMinIndex = state.memoryRange[0];
		const memoryRangeMaxIndex = state.memoryRange[1];
		const memoryList = [4, 8, 16, 32, 64, 128, 256, 512];
		const minMemory = memoryList[memoryRangeMinIndex];
		const maxMemory = memoryList[memoryRangeMaxIndex];
		const iOS = state.iOS;
		const android = state.android;
		const OSList = [];
		if (iOS) OSList.push('iOS');
		if (android) OSList.push('Android');
		const minSimCards = state.hasTwoSimCards ? 2 : 1;
		const res = await client.query({
	        query: gql`
			  query getPhones(
			  	$companies: [String!], 
			  	$queryString: String, 
			  	$minPrice: Int, 
			  	$maxPrice: Int,
			  	$minDiscount: Int,
			  	$minCredit: Int,
			  	$minMemory: Int,
			  	$maxMemory: Int,
			  	$OSList: [String!],
			  	$minSimCards: Int
			  	) {  
			  phones(
			    where: {
			    	company_in: $companies,
			    	name_contains: $queryString,
					price_gte: $minPrice,
					price_lte: $maxPrice,
					sale_gte: $minDiscount,
					creditTerm_gte: $minCredit,
					memory_gte: $minMemory,
					memory_lte: $maxMemory,
					OS_in: $OSList,
					cards_gte: $minSimCards
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
	          minCredit,
	          minMemory,
	          maxMemory,
	          OSList,
	          minSimCards
	        } 
	    });
		commit('setPhones', res.data.phones);
  	},
  }
})

export default store