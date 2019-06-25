<template>
    <div class="bg-black ml-56 flex-1 text-white pt-10 px-10">
        <h1>This is the briefcases page</h1>
        <div class="mt-10">
            <transition-group name="company" tag="ul" class="flex flex-wrap list-reset justify-center">
                <li v-for=" (briefcase, index) in briefcases" :key="index" class="sym-briefcase-wrapper company">
                    <div class="sym-briefcase">
                        <div class="sym-briefcase-img">
                            <div>
                                <img :src="briefcase.thumb"
                                     :alt="briefcase.name">
                            </div>
                        </div>
                    </div>
                    <div class="sym-briefcase-details" style="margin-right: 15px;">
                        <div class="sym-briefcase-name">
                            <router-link :to="{ name: 'briefcase', params: { briefcaseId: briefcase._id } }"
                                         class="no-underline text-white">
                                {{ briefcase.name }}
                            </router-link>
                        </div>
                        <div class="sym-briefcase-actions"
                             style="display: flex; justify-content: center; align-items: center;">
                            <div class="fa fa-envelope"
                                 style="margin-top: 1px; margin-right: 5px; font-size: 20px;"></div>
                            <div class="fa fa-home" style="font-size: 20px; color: #2196f3"></div>
                        </div>
                    </div>
                </li>
            </transition-group>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                briefcases: []
            }
        },
        created() {
            if (this.$store.getters.user != null) {
                this.$store.dispatch('getBriefcases', {key: this.$store.getters.user._id})

                this.briefcases = this.$store.getters.briefcases
            }
        },
        methods: {}
    }
</script>

<style lang="css">
    .sym-briefcase-wrapper {
        padding: 20px;
    }

    .sym-briefcase {
        flex: 1 1 30%;
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
    }

    .sym-briefcase-img {
        padding: 50px 10px 0px 10px;
        background-image: url(../assets/briefcase.png);
        overflow: hidden;
        min-height: 190px;
        background-repeat: no-repeat !important;
        background-position: 0px 0px;
        background-size: 100% 100%;
        width: 220px;
        height: 215px;
        margin-right: 12px;
    }

    .sym-briefcase-img > div {
        overflow: hidden;
        border-radius: 5px;
    }

    .sym-briefcase-img > div img {
        display: inline;
        width: 100%;
    }

    .sym-briefcase-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .sym-briefcase-name {
        margin-top: 10px;
        margin-left: 10px;
    }

    /* base */
    .company {
        backface-visibility: hidden;
        z-index: 1;
    }

    /* moving */
    .company-move {
        transition: all 600ms ease-in-out 50ms;
    }

    /* appearing */
    .company-enter-active {
        transition: all 400ms ease-out;
    }

    /* disappearing */
    .company-leave-active {
        transition: all 200ms ease-in;
        position: absolute;
        z-index: 0;
    }

    /* appear at / disappear to */
    .company-enter,
    .company-leave-to {
        opacity: 0;
    }
</style>
