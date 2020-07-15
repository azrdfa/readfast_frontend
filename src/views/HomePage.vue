<template>
  <div id="homepage">
    <b-container>
      <b-row class="fill-top center">
        <b-col class="align-self-end" style="text-align: center;">
          <h2 v-if="display == ''">-</h2>
          <h2 v-bind:style="displayStyle" v-else>{{ display }}</h2>
        </b-col>
      </b-row>
      <b-row class="fill-center center">
        <b-col class="align-self-start">
          <ReadingMachine
            @display-changed="editDisplay"
            v-bind:content.sync="content"
          />
        </b-col>
      </b-row>
      <b-row class="fill-bottom">
        <b-col class="align-self-start">
          <ReadingMaterial @content-changed="editContent" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import ReadingMachine from '@/components/readingmachine/ReadingMachine'
import ReadingMaterial from '@/components/readingmaterial/ReadingMaterial'
export default {
  name: 'homepage',
  components: {
    ReadingMachine,
    ReadingMaterial
  },
  data: function () {
    return {
      display: '',
      content: '',
      // default for h2 is 2rem
      display_size: 2
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
