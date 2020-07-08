<template>
    <div id="progressbar">
        <b-progress :max="100" height="0.5rem">
            <b-progress-bar :value="progress_value" v-bind:style="animationTransition"></b-progress-bar>
        </b-progress>
    </div>
</template>
<script>
export default {
    name: "progressbar",
    props: {
        bus: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            animation_time: 250,
            progress_value: 0
        }
    },
    methods: {
        automateProgress(content_length) {
            let _this = this

            function nextStart(index) {
                if (index > content_length - 1) {
                } else {
                    _this.activateProgress()
                    setTimeout(nextStart, 300, index + 1)
                }
            }

            function nextReset(index) {
                if (index > content_length - 1) {
                } else {
                    _this.resetProgress()
                    setTimeout(nextReset, 300, index + 1)
                }
            }
            
            setTimeout(nextStart, 0, 0)
            setTimeout(nextReset, 250, 0)
        },

        activateProgress() {
            this.animation_time = 250
            this.progress_value = 100
        },

        resetProgress() {
            this.animation_time = 50
            this.progress_value = 0
        },
    },
    computed: {
        animationTransition() {
            return {
                transition: `width ${this.animation_time}ms`
            }
        }
    },
    mounted() {
        this.bus.$on("automateProgress", this.automateProgress)
    }
}
</script>