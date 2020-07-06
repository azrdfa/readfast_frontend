<template>
  <div id="app">
    <b-container>
      <b-row class="fill center">
        <b-col class="align-self-center">
          <alpha></alpha>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import alpha from "./views/alpha"
export default {
  name: 'app',
  components: {
    alpha
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