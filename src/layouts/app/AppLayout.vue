<template>
    <div>
        <headerBar/>
        <router-view/>
    </div>
</template>

<script>
    import headerBar from "../../components/headerBar";

    export default {
        name: "AppLayout",
        components: { headerBar }
    }
</script>

<style lang="scss">

</style>