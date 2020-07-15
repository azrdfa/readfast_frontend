<template>
  <div id="homepage">
    <b-container>
      <b-row class="fill-top center">
        <b-col class="align-self-end" style="text-align: center;">
          <h2 v-if="display == ''">-</h2>
          <h2 v-else>{{ display }}</h2>
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
      content: ''
    }
  },
  methods: {
    editDisplay (value) {
      this.display = value
    },
    editContent (value) {
      this.content = value
    }
  }
}
</script>
<style scoped src="./home-page.css"></style>
