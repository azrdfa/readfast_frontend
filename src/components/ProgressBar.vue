<template>
    <div id="progressbar">
        <b-progress :max="100" height="0.25rem">
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
            animation_time: 0,
            progress_value: 0,
            reading_machine_start: null,
            reading_machine_reset: null
        }
    },
    methods: {
        automateProgress(content_length, time_dict, reading_index) {
            let _this = this

            function nextStart(index) {
                if (!(index > content_length - 1)) {
                    _this.activateProgress(time_dict[index] - 50)
                    _this.reading_machine_start = setTimeout(nextStart, time_dict[index], index + 1)
                } 
            }

            function nextReset(index) {
                if (!(index > content_length - 1)) {
                    _this.resetProgress()
                    if (!(index >= content_length - 1)) {
                        _this.reading_machine_reset = setTimeout(nextReset, time_dict[index + 1], index + 1)
                    }
                }
            }
            
            this.reading_machine_start = setTimeout(nextStart, 0, reading_index)
            this.reading_machine_reset = setTimeout(nextReset, time_dict[reading_index] - 50, 0)
        },

        activateProgress(animation_time) {
            this.animation_time = animation_time
            this.progress_value = 100
        },

        resetProgress() {
            this.animation_time = 50
            this.progress_value = 0
        },

        stopProgress() {
            console.log("asdas")
            clearInterval(this.reading_machine_start)
            clearInterval(this.reading_machine_reset)
            this.resetProgress()
        }
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
        this.bus.$on("stopProgress", this.stopProgress)
    }
}
</script>