<template>
  <div id="app">
    <HomePage />
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import HomePage from '@/views/HomePage'
export default {
  name: 'app',
  components: {
    HomePage
  }
}
</script>
<style>
/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
