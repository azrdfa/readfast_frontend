<template>
  <div id="readingmachine">
    <b-form-textarea
      class="component-margin"
      rows="5"
      no-resize
      :value="content"
      v-on:change="changeContent"
      placeholder="Tulis kalimat di sini ..."
    ></b-form-textarea>
    <b-dropdown
      size="sm"
      class="component-margin"
      split-variant="outline-primary"
      variant="primary"
      v-bind:text="read_word ? 'Kata Kilat' : 'Kalimat Kilat'"
      v-bind:disabled="is_reading || content == ''"
      @click="initReadingMachine"
      dropright
      split
      block
    >
      <b-dropdown-item @click="changeReadingStyle('word')"
        >Kata Kilat</b-dropdown-item
      >
      <b-dropdown-item @click="changeReadingStyle('sentence')"
        >Kalimat Kilat</b-dropdown-item
      >
    </b-dropdown>
    <progressbar class="component-margin" :bus="bus" />
    <b-row class="component-margin">
      <b-col cols="4">
        <b-form-select
          v-model="reading_speed"
          :options="speed_option"
          size="sm"
          v-bind:disabled="is_reading"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled
              >-- Pilih kecepatan membaca --</b-form-select-option
            >
          </template>
        </b-form-select>
      </b-col>
      <b-col cols="4">
        <b-button
          v-if="!is_stopped"
          size="sm"
          variant="primary"
          v-bind:disabled="!is_reading"
          @click="stopReading"
          block
        >
          <b-icon-pause />
        </b-button>
        <b-button
          v-else
          size="sm"
          variant="primary"
          v-bind:disabled="!is_reading"
          @click="continueReading"
          block
        >
          <b-icon-play />
        </b-button>
      </b-col>
      <b-col cols="4">
        <b-button
          v-bind:disabled="!is_reading"
          @click="forceStopReading"
          size="sm"
          variant="primary"
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
import { BIcon, BIconPlay, BIconPause, BIconArrowClockwise } from 'bootstrap-vue'
export default {
  name: 'readingmachine',
  components: {
    progressbar,
    // eslint-disable-next-line vue/no-unused-components
    BIcon,
    BIconPlay,
    BIconPause,
    BIconArrowClockwise
  },
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      is_reading: false,
      is_stopped: false,
      text_splitted: '',
      reading_index: 0,
      reading_time: {},
      reading_machine: null,
      read_word: true,
      bus: new Vue(),
      reading_speed: 850,
      speed_option: [
        { value: 850, text: 'Lamban' },
        { value: 450, text: 'Sedang' },
        { value: 250, text: 'Cepat' }
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
        this.cleanText()
        for (let i = 0; i < this.text_splitted.length; i++) {
          this.reading_time[i] = this.reading_speed
        }
      } else {
        let sentenceWord
        this.text_splitted = this.content.split('.')
        this.cleanText()
        for (let i = 0; i < this.text_splitted.length; i++) {
          sentenceWord = this.text_splitted[i].split(' ')
          this.reading_time[i] = sentenceWord.length * this.reading_speed
        }
      }

      this.is_reading = true
      this.startReading()
      this.bus.$emit('start-progress', this.text_splitted.length, this.reading_time, this.reading_index)
    },

    cleanText () {
      const tmpTextSplitted = []
      this.text_splitted.forEach(function (value) {
        if (value !== '') {
          tmpTextSplitted.push(value)
        }
      })
      this.text_splitted = tmpTextSplitted
    },

    startReading () {
      const _this = this
      this.$emit('display-changed', this.text_splitted[this.reading_index])
      function next () {
        if (_this.reading_index > _this.text_splitted.length - 2) {
          _this.resetReading()
        } else {
          _this.$emit('display-changed', _this.text_splitted[_this.reading_index + 1])
          _this.reading_index++
          _this.reading_machine = setTimeout(next, _this.reading_time[_this.reading_index])
        }
      }
      this.reading_machine = setTimeout(next, this.reading_time[this.reading_index])
    },

    resetReading () {
      this.$emit('display-changed', '')
      clearInterval(this.reading_machine)
      this.is_reading = false
      this.is_stopped = false
      this.text_splitted = ''
      this.reading_index = 0
      this.reading_time = {}
    },

    stopReading () {
      clearInterval(this.reading_machine)
      this.bus.$emit('stop-progress')
      this.is_stopped = true
    },

    continueReading () {
      this.is_stopped = false
      this.startReading()
      this.bus.$emit('start-progress', this.text_splitted.length, this.reading_time, this.reading_index)
    },

    forceStopReading () {
      this.bus.$emit('stop-progress')
      this.resetReading()
    },

    changeContent (value) {
      this.$emit('update:content', value)
    }

  }
}
</script>
<style scoped src="./reading-machine.css"></style>
