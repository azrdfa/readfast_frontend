<template>
  <div id="readingmachine" class="relative-container">
    <b-button
      size="sm"
      :variant="changeVariant"
      class="absolute-container"
      :disabled="!(is_reading && !read_word)"
      @click="skipReading"
      ><b-icon-skip-forward
    /></b-button>
    <b-form-textarea
      class="component-margin"
      rows="5"
      no-resize
      :value="content"
      v-on:change="changeContent"
      placeholder="Write something here.."
    ></b-form-textarea>
    <b-dropdown
      size="sm"
      class="component-margin"
      :split-variant="changeOutlineVariant"
      :variant="changeVariant"
      :text="read_word ? 'Read by word' : 'Read by sentence'"
      :disabled="is_reading || content == ''"
      @click="initReadingMachine"
      dropright
      split
      block
    >
      <b-dropdown-item @click="changeReadingStyle('word')"
        >Read by word</b-dropdown-item
      >
      <b-dropdown-item @click="changeReadingStyle('sentence')"
        >Read by sentence</b-dropdown-item
      >
    </b-dropdown>
    <!-- <progressbar class="component-margin" :bus="bus" :mode="mode" /> -->
    <b-row class="component-margin">
      <b-col cols="4">
        <b-form-select
          v-model="reading_speed"
          :options="speed_option"
          size="sm"
          :disabled="is_reading"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled
              >-- Reading speed --</b-form-select-option
            >
          </template>
        </b-form-select>
      </b-col>
      <b-col cols="4">
        <b-button
          v-if="!is_stopped"
          size="sm"
          :variant="changeVariant"
          :disabled="!is_reading"
          @click="stopReading"
          block
        >
          <b-icon-pause />
        </b-button>
        <b-button
          v-else
          size="sm"
          :variant="changeVariant"
          :disabled="!is_reading"
          @click="continueReading"
          block
        >
          <b-icon-play />
        </b-button>
      </b-col>
      <b-col cols="4">
        <b-button
          :disabled="!is_reading"
          @click="forceStopReading"
          size="sm"
          :variant="changeVariant"
          block
        >
          <b-icon-arrow-clockwise />
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import Vue from 'vue'
import progressbar from '@/components/readingmachine/ProgressBar'
import { BIcon, BIconPlay, BIconPause, BIconArrowClockwise, BIconSkipForward } from 'bootstrap-vue'
export default {
  name: 'readingmachine',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    progressbar,
    // eslint-disable-next-line vue/no-unused-components
    BIcon,
    BIconPlay,
    BIconPause,
    BIconArrowClockwise,
    BIconSkipForward
  },
  props: {
    content: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      bus: new Vue(),
      // ====> temporary value
      is_reading: false,
      is_stopped: false,
      text_splitted: [],
      reading_index: 0,
      reading_time: {},
      reading_machine: null,
      // ====> temporary value
      read_word: true,
      reading_speed: 1000,
      speed_option: [
        { value: 1000, text: 'Slow' },
        { value: 700, text: 'Medium' },
        { value: 300, text: 'Fast' }
      ]
    }
  },
  methods: {
    changeReadingStyle (value) {
      if (value === 'word') {
        this.read_word = true
      } else if (value === 'sentence') {
        this.read_word = false
      }
    },

    initReadingMachine () {
      if (this.read_word) {
        this.text_splitted = this.content.split(' ')
        this.cleanText(this.read_word)
        for (let i = 0; i < this.text_splitted.length; i++) {
          this.reading_time[i] = this.reading_speed
        }
      } else {
        let sentenceWord
        this.text_splitted = this.content.split('.')
        this.cleanText(this.read_word)
        for (let i = 0; i < this.text_splitted.length; i++) {
          sentenceWord = this.text_splitted[i].split(' ')
          this.reading_time[i] = sentenceWord.length * this.reading_speed
        }
      }

      this.is_reading = true
      this.startReading()
      // this.bus.$emit('start-progress', this.text_splitted.length, this.reading_time, this.reading_index)
    },

    cleanText (isWord) {
      const tmpTextSplitted = []
      this.text_splitted.forEach(function (value) {
        if (value !== '') {
          tmpTextSplitted.push(value)
        }
      })
      if (isWord) {
        tmpTextSplitted.forEach(function (value) {
          var currentChar, i, len
          for (i = 0, len = value.length; i < len; i++) {
            currentChar = value.charCodeAt(i)
            if (!(currentChar > 47 && currentChar < 58) && !(currentChar > 64 && currentChar < 91) && !(currentChar > 96 && currentChar < 123)) {
              console.log(value + ' mistake at index ' + i)
            }
          }
        })
      }
      this.text_splitted = tmpTextSplitted
    },

    startReading () {
      const _this = this
      this.$emit('display-changed', this.text_splitted[this.reading_index], this.read_word)
      function next () {
        if (_this.reading_index > _this.text_splitted.length - 2) {
          _this.resetReading()
        } else {
          _this.$emit('display-changed', _this.text_splitted[_this.reading_index + 1], _this.read_word)
          _this.reading_index++
          _this.reading_machine = setTimeout(next, _this.reading_time[_this.reading_index])
        }
      }
      this.reading_machine = setTimeout(next, this.reading_time[this.reading_index])
    },

    resetReading () {
      this.$emit('display-changed', '', false, true)
      clearInterval(this.reading_machine)
      this.is_reading = false
      this.is_stopped = false
      this.text_splitted = []
      this.reading_index = 0
      this.reading_time = {}
    },

    stopReading () {
      clearInterval(this.reading_machine)
      // this.bus.$emit('stop-progress')
      this.is_stopped = true
    },

    continueReading () {
      this.is_stopped = false
      this.startReading()
      // this.bus.$emit('start-progress', this.text_splitted.length, this.reading_time, this.reading_index)
    },

    forceStopReading () {
      // this.bus.$emit('stop-progress')
      this.resetReading()
    },

    changeContent (value) {
      this.$emit('update:content', value)
    },

    skipReading () {
      // eslint-disable-next-line no-unused-vars
      const _this = this
      const currentIndex = this.reading_index + 1
      if (currentIndex === this.text_splitted.length) {
        // this.bus.$emit('stop-progress')
        this.resetReading()
      } else {
        clearInterval(this.reading_machine)
        // this.bus.$emit('stop-progress')
        this.reading_index++
        // setTimeout(function () {
        // _this.bus.$emit('start-progress', _this.text_splitted.length, _this.reading_time, _this.reading_index)
        // }, 50)
        this.startReading()
      }
    }

  },
  computed: {
    changeVariant: function () {
      if (this.mode === 'dark') {
        return 'light'
      } else {
        return 'dark'
      }
    },
    changeOutlineVariant: function () {
      if (this.mode === 'dark') {
        return 'outline-light'
      } else {
        return 'outline-dark'
      }
    }
  }
}
</script>
<style scoped src="./reading-machine.css"></style>
