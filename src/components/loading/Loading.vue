<template>
  <div id="loading">
    <div id="spinner-group">
      <b-spinner variant="dark" type="grow" small />
      <b-spinner variant="dark" type="grow" small />
      <b-spinner variant="dark" type="grow" small />
    </div>
    <h3>preparing readings</h3>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
export default {
  name: 'loading',
  data () {
    return {
      asd: ''
    }
  }
}
</script>
<style scoped src="./loading.css"></style>
