<template>
    <section class="headerBar">
  <span class="headerBar__name">
    ATM
  </span>
        <div class="headerBar__controls">
            <button href="" class="iconBtn icon24" @click="hideWin">
                <img class="headerBar__icon" src="../assets/svg/controls/hide.svg" alt="-">
            </button>
            <button href="" class="iconBtn icon24" @click="closeWin">
                <img class="headerBar__icon" src="../assets/svg/controls/close.svg" alt="x">
            </button>
        </div>
    </section>
</template>

<script>
    import electron from "electron";

    export default {
        name: "headerBar",
        components: {},
        data: function () {
            return {}
        },
        methods: {
            hideWin: function () {
                electron.ipcRenderer.send('service-events', {action: 'hide-win'});
            },
            closeWin: function () {
                electron.ipcRenderer.send('service-events', {action: 'close-win'});
            },
        },
        computed: {},
        watch: {},
        mounted() {

        },
    }
</script>

<style lang="scss">
    .headerBar {
        -webkit-app-region: drag;

        z-index: 9999;
        display: flex;
        flex-flow: row;

        justify-content: space-between;
        align-items: center;
        padding: 0px 16px;
        height: 32px;
        width: 100%;
        background: #3C3C3C;

        &__name {
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            line-height: 28px;

            color: white;
        }

        &__controls {
            -webkit-app-region: none;
            z-index: 1000;

            display: flex;
            justify-content: space-between;
            align-items: center;
            //width: 58px;
            &.icon24 {
                width: 24px;
                height: 24px;
            }

            .iconBtn {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 27px;
            }
        }

        &__icon {
            width: 21px;
            height: 21px;
        }

    }


</style>