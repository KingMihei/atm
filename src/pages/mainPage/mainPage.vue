<template>
    <div class="main">
        <div class="main__btn" v-if="ratesList[0]">
            <!-- V-select -->
            <v-select v-model="item" :options="symbolsList" label="text" :clearable="isCardShow">

                <!-- Dropdown Header -->
                <template #header>
                    <div style="opacity: 0.8; margin-bottom: 10px;">Press to choose rate</div>
                </template>

                <!-- Dropdown -->
                <template v-if="loading === false" v-slot:option="option" @click="chooseRate(option)"
                          style="width: 100%;">
                    <img :src="require('../../assets/svg/flags/'+option.flag+'.svg')" style="width: 2.4vw;
          height: 2.4vw; object-fit: fill; margin-right: 5px;" alt="">
                    <span :class="option.text"/>
                    {{ option.text }}
                </template>

                <!-- Loading spinner -->
                <template #spinner="{ loading }">
                    <div
                            v-if="loading === true"
                            style="border-left-color: rgba(88, 151, 251, 0.71)"
                            class="vs__spinner"/>
                </template>
            </v-select>
        </div>

        <loading style="margin-top: 20px;" v-else/>
        <!-- Rate Card -->
        <rateCard v-show="isCardShow" :data="{name: curName, amount: curAmount}" :flag="curFlag"></rateCard>
    </div>
</template>

<script>
    import electron from 'electron';

    import vSelect from 'vue-select'
    import loading from "@/components/loading";
    import rateCard from "@/pages/mainPage/components/rateCard";

    export default {
        name: "mainPage",
        components: {vSelect, loading, rateCard},
        data: function () {
            return {
                loading: true,
                item: {text: '', value: '', flag: ''},

                curAmount: '',
                curName: '',
                curFlag: 'empty',
                curAlt: '',
                isCardShow: false,

                ratesList: [],
                symbolsList: [],
            }
        },
        methods: {
            chooseRate(item) {
                this.ratesList.forEach(async (rate) => {
                    if (rate.name === item.value) {
                        this.curAmount = rate.amount;
                        this.curName = item.value;
                        this.curAlt = item.text;
                        this.curFlag = item.flag;
                        this.isCardShow = true;
                    }
                })
            }
        },
        computed: {},
        watch: {
            item(value) {
                this.chooseRate(value);
            }
        },
        mounted: async function () {
            await electron.ipcRenderer.send('get-events', {action: 'getList'});
            electron.ipcRenderer.on('get-events', (event, arg) => {
                switch (arg.action) {
                    case ('getList'):
                        if (arg.list) {
                            this.ratesList = arg.list.rates;
                            this.symbolsList = arg.list.symbols;
                        } else {
                            this.ratesList = arg.rates;
                            this.symbolsList = arg.symbols;
                        }

                        this.loading = false;
                        break
                }

            })
        },
    }
</script>

<style lang="scss">
    .main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;

        //============  Dropdown
        &__btn {
            position: relative;
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: center;
            width: 90vw;

            padding: 10px 0;
            margin: 2vw 0 5vw;
        }
    }

    //============  Dropdown content-menu
    .vs__dropdown-toggle {
        position: relative;
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        min-width: 20vw;
        width: 100%;
        padding: 5px 45px;
        box-shadow: 0 2px 15px 1px rgba(0, 0, 0, 0.15);

        cursor: pointer;
    }

    //============  Dropdown content-state
    .vs--open, .vs--single, .vs--searchable {
        width: 100% !important;
    }

    //============  Dropdown selected item
    .vs__selected-options {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex: 0 0 90%;
    }

    //============  Dropdown selected item span
    .vs__selected {
        text-align: left;
        width: 100%;
    }

    //============  Dropdown input (controls auto hide of list)
    .vs__search {
        //display: none;
        width: 0%;
    }

    //============  Dropdown content-list
    .vs__dropdown-menu {
        position: absolute;
        display: flex;
        flex-flow: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        padding: 10px;
        max-height: 20vw;
        overflow-y: auto;

        background: white;
        box-shadow: 0 4px 10px 0px rgba(0, 0, 0, 0.15);

        //============  Dropdown items
        > li {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            padding: 5px 5px;

            &:hover {
                background: rgba(0, 0, 0, 0.10);
            }
        }
    }
</style>