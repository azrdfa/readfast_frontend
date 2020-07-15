<template>
  <div id="readingmaterial">
    <b-card-group v-if="!load_book" deck>
      <b-card
        class="text-truncate"
        v-for="(book, index) in books"
        v-bind:key="index"
      >
        <b-card-title>{{ book.title }}</b-card-title>
        <b-card-sub-title>{{ book.sub_title }}</b-card-sub-title>
        <template v-slot:footer>
          <b-button variant="primary" size="sm" @click="openModal(index)" block
            >Lihat Chapter</b-button
          >
        </template>
      </b-card>
    </b-card-group>
    <div v-else class="custom-animation">
      <b-icon-arrow-clockwise animation="spin" font-scale="2" />
      <p>Wait a second...</p>
    </div>
    <b-modal id="chapter-modal" hide-footer>
      <template v-slot:modal-header>
        <div>
          <h5>{{ selected_book.title }}</h5>
          {{ selected_book.sub_title }}
        </div>
        <b-button
          size="sm"
          variant="primary"
          @click="$bvModal.hide('chapter-modal')"
        >
          <b-icon-x-circle />
        </b-button>
      </template>
      <div class="chapter-container">
        <b-button
          size="sm"
          v-for="(chapter, index) in selected_book.chapters"
          variant="outline-primary"
          class="chapter-button"
          v-bind:key="index"
          style="text-align: start;"
          @click="readChapter(chapter.id)"
        >
          Chapter {{ chapter.number }} : {{ chapter.title }}
          <b-spinner
            v-if="load_chapter && selected_chapter == chapter.id"
            class="ml-2"
            small
          />
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import axios from 'axios'
import { BIcon, BIconXCircle, BIconArrowClockwise } from 'bootstrap-vue'
export default {
  name: 'readingmaterial',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    BIcon,
    BIconXCircle,
    BIconArrowClockwise
  },
  data () {
    return {
      load_book: true,
      load_chapter: false,
      selected_chapter: 0,
      selected_book: {
        title: '',
        sub_title: '',
        chapters: []
      },
      books: []
    }
  },
  methods: {
    openModal (index) {
      this.selected_book.title = this.books[index].title
      this.selected_book.sub_title = this.books[index].sub_title
      this.selected_book.chapters = this.books[index].chapters
      this.$bvModal.show('chapter-modal')
    },
    readChapter (id) {
      this.load_chapter = true
      this.selected_chapter = id
      axios
        .get('http://localhost:8000/readingmaterial/chapter/' + id)
        .then((response) => {
          this.$emit('content-changed', response.data.content)
          this.load_chapter = false
          this.selected_chapter = 0
          this.$bvModal.hide('chapter-modal')
        })
    }
  },
  mounted () {
    axios.get('http://localhost:8000/readingmaterial/book/').then(response => {
      this.books = response.data
      this.load_book = false
    })
  }
}
</script>
<style scoped src="./reading-material.css"></style>
