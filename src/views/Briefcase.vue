<template>
    <div class="bg-black ml-56 flex-1 text-white pt-10 px-10">
        <transition name="briefcase-enter" mode="out-in" enter-active-class="animated bounceIn faster">
            <div class="container mx-auto" style="position: relative; width: 985px; height: 655px; margin-bottom: 20px;">
                <div class="sym-tile cursor-pointer"
                     v-for="(tile, i) in briefcase.tiles"
                     @click.prevent="goToTileDetails(tile)"
                     :key="i"
                     :style="computedTileStyles(tile)">
                    <div class="sym-tile-title"
                         :style="computedTileTitleStyles(tile)">
                        <span>{{ tile.title }}</span>
                    </div>
                    <div class="sym-tile-body mt-10">
                        <ul class="sym-tile-body-files list-reset" style="padding: 10px 20px; height: 510px; overflow-y: auto;">
                            <li v-for="(file, j) in tile.tree"
                                :key="j"
                                class="sym-tile-file py-1">
                                <div style="color: #fff; font-size: 18px;">
                                    <span class="flex items-center">
                                        <span class="text-black mr-1" :class="getIconClass(file)"></span>
                                        <span class="text-black">{{ computedFileName(file) }}</span>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="sym-tile-footer"
                         style="display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; position: absolute; right: 0; bottom: 10px;">
                        <span style="padding: 5px 20px; background-color: #fff; color: #6c717a; border-radius: 20px;">42 file (s) / 2 new</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { getClassNameForExtension } from "../utils/_files/_types";

    export default {
        created() {
            this.fetchBriefcase()
        },
        data() {
            return {
                show: false,
                briefcase: null
            }
        },
        watch: {
            '$route': 'fetchBriefcase'
        },
        methods: {
            fetchBriefcase() {
                let briefcaseId = this.$route.params.briefcaseId
                this.briefcase = this.$store.getters.briefcases.filter(function (b) {
                    return b._id == briefcaseId
                })[0]
            },
            goToTileDetails(tile) {
                let briefcaseId = this.$route.params.briefcaseId

                this.$router.push({name: 'tile', params: { briefcaseId: briefcaseId, tileId: tile.id }})
            },
            computedTileStyles(tile) {
                return `style="opacity: ${tile.bg_opacity}; background: ${tile.bg_color}; top: ${tile.start_y - 3}px; left: ${tile.start_x - 3}px; width: ${tile.width}px; height: ${tile.height}px; position: absolute;"`;
            },
            computedTileTitleStyles(tile) {
                return `style="min-height: 31px; overflow: hidden; text-overflow: ellipsis; margin: 10px 0 0 10px; padding-left: 40px; padding-right: 10px; background-image: url(${tile.icon_link}); background-size: 30px auto; background-repeat: no-repeat; background-position: 0px center; font-family: 'OS_B', sans-serif; line-height: 121%; color: #fff; font-size: 26px;"`;
            },
            getIconClass(file) {
                if (!this.isFolder(file)) {
                    const extension = file.node_name.split('.').pop()

                    return 'fa ' +  getClassNameForExtension(extension)
                } else {
                    return 'fa fa-folder'
                }
            },
            isFolder(file) {
                return file.node_type == 2
            },
            computedFileName(file) {
                var length = 22;
                return file.node_name.length > length ? file.node_name.substring(0, length - 3) + " ..." : file.node_name;
            }
        }
    }
</script>

<style>

</style>