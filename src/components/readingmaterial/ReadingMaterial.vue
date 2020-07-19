<template>
  <div id="readingmaterial">
    <div v-if="load_books" class="custom-animation">
      <b-icon-arrow-clockwise animation="spin" font-scale="2" />
      <p>Wait a second...</p>
    </div>
    <div v-else class="custom-animation">
      <p>Reading Material</p>
      <b-icon-chevron-compact-down
        v-if="!show_books"
        font-scale="3"
        class="library_toggle"
        @click="showBooks(true)"
      />
      <b-icon-chevron-compact-up
        v-else
        font-scale="3"
        class="library_toggle"
        @click="showBooks(false)"
      />
    </div>
    <div v-if="show_books" class="flex-wrap-container margin-component">
      <b-card
        class="text-truncate flex-wrap-multiple"
        v-for="(book, index) in books"
        v-bind:key="index"
        :bg-variant="changeVariantInvert"
      >
        <template v-slot:header> Available in {{ book.language }} </template>
        <b-card-title>{{ book.title }}</b-card-title>
        <b-card-sub-title>{{ book.sub_title }}</b-card-sub-title>
        <template v-slot:footer>
          <b-button
            :variant="changeOutlineVariant"
            size="sm"
            @click="openModal(index)"
            block
            >Chapter List</b-button
          >
        </template>
      </b-card>
    </div>
    <b-modal
      id="chapter-modal"
      :body-bg-variant="changeVariantInvert"
      :header-bg-variant="changeVariantInvert"
      :header-text-variant="changeVariant"
      scrollable
      hide-footer
    >
      <template v-slot:modal-header>
        <div>
          <h5>{{ selected_book.title }}</h5>
          {{ selected_book.sub_title }}
        </div>
        <b-button
          size="sm"
          :variant="changeOutlineVariant"
          @click="$bvModal.hide('chapter-modal')"
        >
          <b-icon-x-circle />
        </b-button>
      </template>
      <div class="flex-wrap-container">
        <b-button
          size="sm"
          v-for="(chapter, index) in selected_book.chapters"
          :variant="changeOutlineVariant"
          class="flex-wrap-single"
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
import Vue from 'vue'
import axios from 'axios'
import { BIcon, BIconXCircle, BIconArrowClockwise, BIconChevronCompactDown, BIconChevronCompactUp } from 'bootstrap-vue'
export default {
  name: 'readingmaterial',
  props: {
    mode: {
      type: String,
      required: true
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    BIcon,
    BIconXCircle,
    BIconArrowClockwise,
    BIconChevronCompactDown,
    BIconChevronCompactUp
  },
  data () {
    return {
      show_books: false,
      load_books: true,
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
    showBooks (value) {
      const _this = this
      if (value === true) {
        this.show_books = true
        Vue.nextTick(function () {
          const library = _this.$el.getElementsByClassName('library_toggle')[0]
          library.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      } else {
        this.show_books = false
      }
    },
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
  computed: {
    changeVariantInvert: function () {
      return this.mode
    },
    changeVariant: function () {
      if (this.mode === 'dark') {
        return 'light'
      } else {
        return 'dark'
      }
    },
    changeOutlineVariant: function () {
      if (this.mode === 'dark') {
        return 'outline-light'
      } else {
        return 'outline-dark'
      }
    }
  },
  mounted () {
    axios.get('http://localhost:8000/readingmaterial/book/').then(response => {
      this.books = response.data
      this.load_books = false
    })
  }
}
</script>
<style scoped src="./reading-material.css"></style>
