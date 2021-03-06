<template>
    <v-layout column justify-center align-center>
        <v-app>
            <div class="page_container">
                <div class="sidebar">
                    <v-expansion-panels :multiple="true" :accordion="true">
                        <v-expansion-panel>
                            <v-expansion-panel-header>Производитель</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <CompaniesFilter :selectedCompanies="selectedCompanies" />
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Стоимость</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col class="px-4">
                                        <v-range-slider v-model="range" :min="minPrice" :max="maxPrice" hide-details class="align-center" color="indigo" @change="setPriceRange">
                                            <template v-slot:prepend>
                                                <v-text-field v-model="range[0]" class="mt-0 pt-0 v-text-field" hide-details single-line type="number" style="width: 60px" @change="setMinPrice"></v-text-field>
                                            </template>
                                            <template v-slot:append>
                                                <v-text-field v-model="range[1]" class="mt-0 pt-0 v-text-field" hide-details single-line type="number" style="width: 60px" @change="setMaxPrice"></v-text-field>
                                            </template>
                                        </v-range-slider>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Специальные предложения</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col class="px-4">
                                        <v-checkbox v-model="hasDiscount" label="Скидка" color="indigo" @change="onDiscount"></v-checkbox>
                                        <v-checkbox v-model="hasCredit" label="Рассрочка" color="indigo" @change="onCredit"></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Встроенная память, Гб</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-range-slider :tick-labels="memories" v-model="memoryRange" @change="setMemoryRange" min="0" max="7" ticks="always" tick-size="4">
                                </v-range-slider>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Операционная система</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col class="px-4">
                                        <v-checkbox v-model="iOS" label="iOS" color="indigo" @change="iOSHandler"></v-checkbox>
                                        <v-checkbox v-model="android" label="Android" color="indigo" @change="androidHandler"></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>SIM-карты</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col class="px-4">
                                        <v-checkbox v-model="hasTwoSimCards" label="С двумя SIM-картами" color="indigo" @change="twoSimCardsHandler"></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
                <div class="r_column">
                    <div class="header">
                        <div class="search">
                            <v-text-field label="Поиск" solo v-model="queryString" @blur="search" @keydown.enter="search" clearable></v-text-field>
                        </div>
                    </div>
                    <div class="goods">
                        <template>
                            <div class="card_wrapper" v-for="phone in phones">
                                <Card :phone="phone" />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </v-app>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag'
import Card from '~/components/Card.vue'
import CompaniesFilter from '~/components/CompaniesFilter.vue'
export default {
    components: {
        Card,
        CompaniesFilter
    },
    data() {
        return {
            queryString: '',
            hasDiscount: false,
            hasCredit: false,
            memories: ["4", "8", "16", "32", "64", "128", "256", "512"],
        }
    },
    computed: {
        selectedCompanies() {
            return this.$store.state.selectedCompanies;
        },
        range() {
            return this.$store.state.range;
        },
        minPrice() {
            return this.$store.state.minPrice;
        },
        maxPrice() {
            return this.$store.state.maxPrice;
        },
        memoryRange() {
            return this.$store.state.memoryRange;
        },
        iOS() {
            return this.$store.state.iOS;
        },
        android() {
            return this.$store.state.android;
        },
        hasTwoSimCards() {
            return this.$store.state.hasTwoSimCards;
        },
        phones() {
            return this.$store.state.phones;
        },
    },
    created() {
        this.getPriceRange();
        this.getPhones();
    },
    methods: {
        getPriceRange() {
            this.$store.dispatch('GET_PRICE_RANGE', {
                companies: this.selectedCompanies,
                queryString: this.queryString
            });
        },
        search() {
            this.$store.dispatch('SET_SEARCH', {
                queryString: this.queryString
            });
        },
        getPhones() {
            this.$store.dispatch('GET_PHONES');
        },
        setMinPrice(e) {
            this.$store.dispatch('SET_MIN_RANGE_PRICE', {
                minPrice: +e
            });
        },
        setMaxPrice(e) {
            this.$store.dispatch('SET_MAX_RANGE_PRICE', {
                maxPrice: +e
            });
        },
        setPriceRange(e) {
            if (e[0] > e[1]) {
                this.range[0] = this.range[1]
                return
            }
            this.$store.dispatch('SET_PRICE_RANGE', {
                range: e
            });
        },
        onDiscount(e) {
            this.$store.dispatch('SET_DISCOUNT', {
                value: e
            });
        },
        onCredit(e) {
            this.$store.dispatch('SET_CREDIT', {
                value: e
            });
        },
        setMemoryRange(e) {
            this.$store.dispatch('SET_MEMORY_RANGE', {
                range: e
            });
        },
        iOSHandler(e) {
            this.$store.dispatch('SET_IOS', {
                value: e
            });
        },
        androidHandler(e) {
            this.$store.dispatch('SET_ANDROID', {
                value: e
            });
        },
        twoSimCardsHandler(e) {
            this.$store.dispatch('SET_TWO_SIM_CARDS', {
                value: e
            });
        },
    }
}

</script>

<style scoped>
.page_container {
    background: #fff;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    -moz-flex-direction: row;
    -o-flex-direction: row;
    flex-direction: row;
}

.sidebar {
    width: 400px;
    flex-shrink: 0;
    border-right: 1px solid #ccc;
}

.r_column {
    flex-grow: 1;
    flex-shrink: 1;
}

.header {
    border-bottom: 1px solid #ccc;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    -moz-flex-direction: row;
    -o-flex-direction: row;
    flex-direction: row;
    -ms-align-items: center;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
}

.search {
    width: 300px;
    margin-bottom: -35px;
}

.goods {
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    -moz-flex-direction: row;
    -o-flex-direction: row;
    flex-direction: row;
    flex-wrap: wrap;
    flex-shrink: 1;
}

.card_wrapper {
    width: 25%;
}

.v-text-field {
    font-size: 12px;
}

@media (max-width: 1050px) {
    .card_wrapper {
        width: 50%;
    }
}

@media (max-width: 1023px) {
    .page_container {
        -moz-flex-direction: column;
        -o-flex-direction: column;
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
    }
}

@media (max-width: 600px) {
    .card_wrapper {
        width: 100%;
    }
}

</style>
