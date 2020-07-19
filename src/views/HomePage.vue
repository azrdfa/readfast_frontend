<template>
  <div id="homepage" class="relative-container" :class="mode">
    <div class="absolute-container" style="text-align: right;">
      <toggle-button
        @change="editMode"
        :switch-color="{ checked: '#192734', unchecked: '#ffffff' }"
        :color="{ checked: '#ffffff', unchecked: '#192734' }"
        :speed="500"
      />
      <h3>{{ mode }} mode</h3>
    </div>
    <b-container id="homebody">
      <b-img
        :class="{ invert_effect: mode === 'dark' }"
        center
        :src="logo"
        alt="logo"
      />
      <b-row class="fill-top center">
        <b-col class="align-self-end" style="text-align: center;">
          <h2 v-if="display == ''">-</h2>
          <h2 v-bind:style="displayStyle" v-else>{{ display }}</h2>
        </b-col>
      </b-row>
      <b-row class="center">
        <b-col class="align-self-start">
          <ReadingMachine
            @display-changed="editDisplay"
            v-bind:content.sync="content"
            :mode="mode"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col class="align-self-start">
          <ReadingMaterial @content-changed="editContent" :mode="mode" />
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import ReadingMachine from '@/components/readingmachine/ReadingMachine'
import ReadingMaterial from '@/components/readingmaterial/ReadingMaterial'
import Footer from '@/components/footer/Footer'
export default {
  name: 'homepage',
  components: {
    ReadingMachine,
    ReadingMaterial,
    Footer
  },
  data: function () {
    return {
      logo: 'src/assets/read_fast.png',
      display: '',
      content: '',
      // default for h2 is 2rem
      display_size: 2,
      mode: 'light'
    }
  },
  methods: {
    editDisplay (value) {
      if (value.length >= 210) {
        this.display_size = 1.5
      } else {
        this.display_size = 2
      }
      this.display = value
    },
    editContent (value) {
      this.content = value
    },
    editMode (object) {
      if (object.value === true) {
        this.mode = 'dark'
      } else {
        this.mode = 'light'
      }
    }
  },
  computed: {
    displayStyle () {
      return {
        'font-size': `${this.display_size}rem`
      }
    }
  }
}
</script>
<style scoped src="./home-page.css"></style>
