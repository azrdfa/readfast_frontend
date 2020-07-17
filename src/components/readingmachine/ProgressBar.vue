<template>
  <div id="progressbar">
    <b-progress :max="100" height="0.25rem">
      <b-progress-bar
        :value="progress_value"
        :style="animationTransition"
        :class="changeVariant"
      ></b-progress-bar>
    </b-progress>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
export default {
  name: 'progressbar',
  props: {
    bus: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      animation_time: 0,
      progress_value: 0,
      reading_machine_start: null,
      reading_machine_reset: null
    }
  },
  methods: {
    automateProgress (contentLength, timeDict, readingIndex) {
      const _this = this

      function nextStart (index) {
        if (!(index > contentLength - 1)) {
          _this.activateProgress(timeDict[index] - 50)
          _this.reading_machine_start = setTimeout(nextStart, timeDict[index], index + 1)
        }
      }

      function nextReset (index) {
        if (!(index > contentLength - 1)) {
          _this.resetProgress()
          if (!(index >= contentLength - 1)) {
            _this.reading_machine_reset = setTimeout(nextReset, timeDict[index + 1], index + 1)
          }
        }
      }

      this.reading_machine_start = setTimeout(nextStart, 0, readingIndex)
      this.reading_machine_reset = setTimeout(nextReset, timeDict[readingIndex] - 50, 0)
    },

    activateProgress (animationTime) {
      this.animation_time = animationTime
      this.progress_value = 100
    },

    resetProgress () {
      this.animation_time = 50
      this.progress_value = 0
    },

    stopProgress () {
      clearInterval(this.reading_machine_start)
      clearInterval(this.reading_machine_reset)
      this.resetProgress()
    }
  },
  computed: {
    animationTransition: function () {
      return {
        transition: `width ${this.animation_time}ms ease-out`
      }
    },
    changeVariant: function () {
      if (this.mode === 'dark') {
        return 'bg-secondary'
      } else {
        return 'bg-dark'
      }
    }
  },
  mounted () {
    this.bus.$on('start-progress', this.automateProgress)
    this.bus.$on('stop-progress', this.stopProgress)
  }
}
</script>
