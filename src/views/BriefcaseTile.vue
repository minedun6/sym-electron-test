<template>
    <div class="bg-black ml-56 flex-1 text-white pt-10 px-10">
        <div class="container mx-auto">
           <webview :src="url" plugins></webview>
        </div>
    </div>
</template>

<script>
    import PdfViewer from './../components/Pdf/PDFViewer'

    import _ from 'lodash'

    export default {
        created() {
            this.fetchTileData()
        },
        mounted() {
        },
        data() {
            return {
                url: 'http://localhost:8081/assets/sample.pdf',
                scale: 2.5,
                tile: null,
                briefcase: null,
                show: false,
                data: 'https://calibre-ebook.com/downloads/demos/demo.docx'
            }
        },
        methods: {
            fetchTileData: function () {
                let vm = this

                let briefcaseId = this.$route.params.briefcaseId
                this.briefcase = _.find(this.$store.getters.briefcases, (b) => { return briefcaseId == b.id })

                console.log(briefcaseId, this.briefcase)

                // let tileId = this.$route.params.tileId
                // this.tile = _.find(this.briefcase.tiles, (t) => { return tileId == t.id })

                setTimeout(() => {
                    vm.show = true
                }, 1000)
            },
            computedFileImg(file) {
                return this.getImageForFile(file)
            },
            getImageForFile: function (file) {
                if ([9].includes(file.node_type)) {
                    return require('@/assets/thumb-image.jpg');
                } else if ([8].includes(file.node_type)) {
                    return require('@/assets/thumb-video.jpg');
                } else if ([4, 5, 6, 7, 10].includes(file.node_type)) {
                    return require('@/assets/thumb-pdf.jpg');
                } else if ([10].includes(file.node_type)) {
                    return require('@/assets/thumb-html.jpg');
                } else {
                    return require('@/assets/thumb-slide.jpg');
                }
            },
            goBackToTiles: function () {
                let briefcaseId = this.$route.params.briefcaseId

                this.$router.push({name: 'briefcase', params: { briefcaseId: briefcaseId }})
            },
            computedShortcutTileStyles (tile) {
                return `display: flex;justify-content: space-between;align-items: center; border-bottom: 1px solid #eee; border-right: 10px solid ${tile.bg_color} ; padding: 20px 10px; color: ${tile.text_color};"`
            },
            computedFileName(file) {
                var length = 20;
                return file.node_name.length > length ? file.node_name.substring(0, length - 3) + " ..." : file.node_name;
            },
            goToTileShortcut: function (tile) {
                let briefcaseId = this.$route.params.briefcaseId

                this.$router.push({name: 'tile', params: { briefcaseId: briefcaseId, tileId: tile.id }})
            },
            onDocumentErrored(e) {
                this.documentError = e.text;

                console.log(e.text)
            },
        },
        watch: {
            '$route': 'fetchTileData'
        }
    }
</script>

<style scoped>

</style>