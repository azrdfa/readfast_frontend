<template>
  <div id="readingmachine" class="relative-container">
    <b-button
      class="absolute-container"
      id="reading_machine_skip"
      size="sm"
      :variant="changeVariant"
      :disabled="!(is_reading && !read_word)"
      @click="skipReading"
      ><b-icon-skip-forward
    /></b-button>
    <b-form-textarea
      class="component-margin"
      id="reading_machine_text_area"
      rows="5"
      no-resize
      :value="content"
      v-on:change="changeContent"
      placeholder="Write something here.."
    ></b-form-textarea>
    <b-dropdown
      class="component-margin"
      id="reading_machine_reading_type"
      size="sm"
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
          id="reading_machine_adjust_speed"
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
          id="reading_machine_stop_continue"
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
          id="reading_machine_reset"
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
import { BIconPlay, BIconPause, BIconArrowClockwise, BIconSkipForward } from 'bootstrap-vue'
export default {
  name: 'readingmachine',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    progressbar,
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
    // method to prepare readings ==>
    changeContent (value) {
      this.$emit('update:content', value)
    },
    changeReadingStyle (value) {
      if (value === 'word') {
        this.read_word = true
      } else if (value === 'sentence') {
        this.read_word = false
      }
    },
    removeInvalidChar (content) {
      const validChar = [33, 45, 63]
      const result = []
      for (var i = 0; i < content.length; i++) {
        const element = content[i]
        let newElement = ''
        for (var j = 0; j < element.length; j++) {
          const charCode = element.charCodeAt(j)
          // match alphanumeric
          if ((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) {
            newElement += String.fromCharCode(charCode)
          } else if (validChar.includes(charCode)) {
            newElement += String.fromCharCode(charCode)
          }
        }
        newElement = newElement.toLowerCase()
        newElement = newElement.charAt(0).toUpperCase() + newElement.slice(1)
        result.push(newElement)
      }
      for (var k = 0; k < content.length; k++) {
        console.log(`before: ${content[k]}`)
        console.log(`after: ${result[k]}`)
      }
      return result
    },
    customSplit (content, separator) {
      // iteration to clean content from \n and \r
      let cleanContent = ''
      content.split('').map(char => {
        if (char !== '\n' && char !== '\r') {
          cleanContent += char
        }
      })
      // iteration to split content based on separator
      const result = []
      let resultElement = ''
      let startIndex = 0
      cleanContent.split('').map((char, index) => {
        if (char === separator) {
          resultElement = cleanContent.substring(startIndex, index)
          result.push(resultElement)
          startIndex = index + 1
        } else if (index === cleanContent.length - 1) {
          resultElement = cleanContent.substring(startIndex, index + 1)
          result.push(resultElement)
          startIndex = index + 1
        }
      })
      return result
    },
    initReadingMachine () {
      if (this.read_word) {
        this.text_splitted = this.customSplit(this.content, ' ')
        this.text_splitted = this.removeInvalidChar(this.text_splitted)
        this.text_splitted.map((element, index) => {
          this.reading_time[index] = this.reading_speed
        })
      } else {
        this.text_splitted = this.customSplit(this.content, '.')
        this.text_splitted.map((element, index) => {
          const wordCount = this.text_splitted[index].split(' ')
          this.reading_time[index] = wordCount.length * this.reading_speed
        })
      }
      this.is_reading = true
      this.startReading()
      // this.bus.$emit('start-progress', this.text_splitted.length, this.reading_time, this.reading_index)
    },

    // method to manipulate reading process ==>
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
      this.$emit('display-changed', '', false)
      // clear temporary value
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
