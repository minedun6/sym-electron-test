<template>
    <div id="app" style="-webkit-app-region: drag" class="font-sans flex min-h-screen bg-black">
        <sidebar></sidebar>
        <vue-progress-bar></vue-progress-bar>

        <transition name="router-animation" leave-active-class="animated fadeOut faster"
                    enter-active-class="animated fadeIn faster" mode="out-in">
            <router-view/>
        </transition>
    </div>
</template>

<script>
    import Sidebar from './components/Sidebar.vue'
    import 'animate.css/animate.css'
    import axios from 'axios'

    axios.defaults.baseURL = 'http://local.symmetryk.com/api/v2';

    export default {
        components: {
            Sidebar,
        },
        data() {
            return {
                polling: null
            }
        },
        mounted() {
            this.$store.watch(
                (state, getters) => getters.user,
                (newValue, oldValue) => {
                    console.log(`Updating from ${oldValue} to ${newValue}`);

                    if (newValue != null) {
                        this.listenForChanges(newValue)
                    }
                }
            )
            //  [App.vue specific] When App.vue is finish loading finish the progress bar
            this.$Progress.finish()
        },
        created() {
            //  [App.vue specific] When App.vue is first loaded start the progress bar
            this.$Progress.start()
            //  hook the progress bar to start before we move router-view
            this.$router.beforeEach((to, from, next) => {
                //  does the page we want to go to have a meta.progress object
                if (to.meta.progress !== undefined) {
                    let meta = to.meta.progress
                    // parse meta tags
                    this.$Progress.parseMeta(meta)
                }
                //  start the progress bar
                this.$Progress.start()
                //  continue to next page
                next()
            })
            //  hook the progress bar to finish after we've finished moving router-view
            this.$router.afterEach((to, from) => {
                //  finish the progress bar
                this.$Progress.finish()
            })

            this.pollUpdates()
        },
        beforeDestroy() {
            clearInterval(this.polling);
        },
        methods: {
            listenForChanges: function (user) {
                console.log('Start listening for changes on changes')
                let vm = this
                window.Echo.channel('devices_key_' + user._id)
                    .listen('RemoveBriefcase', function (e) {
                        if (e.data.device.key == user._id) {
                            vm.$store.dispatch('removeBriefcase', {
                                briefcase: e.data.briefcase
                            })
                        }
                    }).listen('AddBriefcase', function (e) {
                    if (e.data.device.key == user._id) {
                        vm.$store.dispatch('addBriefcase', {
                            briefcase: e.data.briefcase
                        })
                    }
                })
            },
            pollUpdates() {
                const vm = this
                vm.polling = setInterval(() => {
                    vm.$store.dispatch('getUpdates', {key: vm.$store.getters.user._id})
                }, 100000)
            }
        }
    }
</script>


<style src="./assets/main.css"/>
