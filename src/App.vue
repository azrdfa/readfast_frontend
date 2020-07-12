<template>
  <div id="app">
    <b-container>
      <b-row class="fill-top center">
        <b-col class="align-self-end">
          <h2 v-if="text == null" style="text-align: center">-</h2>
          <h2 v-else style="text-align: center">{{ text }}</h2>
        </b-col>
      </b-row>
      <b-row class="fill-center center">
        <b-col>
          <home @valueChanged="changeText"></home>
        </b-col>
      </b-row>
      <b-row class="fill-bottom">
        <b-col class="align-self-start">
          <readingmaterial />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import home from "./views/Home"
import readingmaterial from './components/ReadingMaterial'
export default {
  name: 'app',
  components: {
    home,
    readingmaterial
  },
  data () {
    return {
      text: null
    }
  },
  methods: {
    changeText(value) {
      this.text = value
    }
  }
}
</script>
<style scoped>
.center {
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  padding: 10px;
}
.fill-bottom {
  min-height: 25vh;
}
.fill-center {
  min-height: 35vh;
}
.fill-top {
  min-height: 40vh;
}
</style>