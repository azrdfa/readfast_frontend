<template>
  <div id="app">
    <b-container>
      <b-row class="fill center">
        <b-col class="align-self-center">
          <home></home>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import home from "./views/Home"
export default {
  name: 'app',
  components: {
    home
  },
  data () {
    return {
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
.fill {
  min-height: 100vh;
}
</style>