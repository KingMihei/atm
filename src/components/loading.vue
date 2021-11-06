<template>
    <div>
      <span>
        Please wait, list is downloading
      </span>
        <b-progress :value="value" :max="max" show-progress animated style="width: 100%;">
            <b-progressBar :value="value" variant="danger" style="color: white; "/>
        </b-progress>
    </div>
</template>

<script>
    import electron from 'electron';

    export default {
        name: "loading",
        components: {},
        data: function () {
            return {
                value: 0,
                max: 100,
            }
        },
        methods: {},
        computed: {},
        watch: {},
        mounted: async function () {
            await electron.ipcRenderer.send('get-events', {action: 'get-progressBar-update'});
            electron.ipcRenderer.on('get-events', (event, arg) => {
                if (arg.action === 'get-progressBar-update') {
                    this.value++;
                    if (arg.max) {
                        this.max = arg.max;
                    }
                }
            })
        },
    }
</script>

<style>

</style>