<template>
    <div class="pdf-zoom">
        <a @click.prevent.stop="zoomIn" class="icon" :disabled="isDisabled">+</a>
        <a @click.prevent.stop="zoomOut" class="icon" :disabled="isDisabled">-</a>
        <a @click.prevent.stop="fitWidth" class="icon" :disabled="isDisabled">2x</a>
        <a @click.prevent.stop="fitAuto" class="icon" :disabled="isDisabled">1/2x</a>
    </div>
</template>

<script>
    export default {
        name: 'PDFZoom',
        props: {
            scale: {
                type: Number,
            },
            increment: {
                type: Number,
                default: 0.25,
            },
        },
        computed: {
            isDisabled() {
                return !this.scale;
            },
        },
        methods: {
            zoomIn() {
                this.updateScale(this.scale + this.increment);
            },
            zoomOut() {
                if (this.scale <= this.increment) return;
                this.updateScale(this.scale - this.increment);
            },
            updateScale(scale) {
                this.$emit('change', {scale});
            },
            fitWidth() {
                this.$emit('fit', 'width');
            },
            fitAuto() {
                this.$emit('fit', 'auto');
            },
        },
    }
</script>

<style>
    .pdf-zoom a {
        float: left;
        cursor: pointer;
        display: block;
        border: 1px #333 solid;
        background: white;
        color: #333;
        font-weight: bold;
        line-height: 1.5em;
        width: 1.5em;
        height: 1.5em;
        font-size: 1.5em;
    }
</style>