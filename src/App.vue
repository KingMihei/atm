<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "app"
    }
</script>

<style lang="scss">
    @import "~@/assets/scss/vendors/bootstrap-vue/index";
    @import "assets/scss/app";

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }
</style>
