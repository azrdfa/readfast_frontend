<template>
  <div id="readingmaterial">
    <div class="custom-animation">
      <p>Reading Material</p>
      <b-icon-chevron-compact-down
        font-scale="3"
        class="library_toggle"
        @click="goToReadingMaterials"
      />
    </div>
    <div class="flex-wrap-container margin-component">
      <b-card
        class="text-truncate flex-wrap-multiple"
        v-for="(reading_material, index) in reading_materials"
        v-bind:key="index"
        :id="'reading_' + index"
        :bg-variant="changeVariantInvert"
      >
        <template v-slot:header>
          Available in {{ reading_material.language }}
        </template>
        <b-card-title>{{ reading_material.title }}</b-card-title>
        <b-card-sub-title>{{ reading_material.sub_title }}</b-card-sub-title>
        <div id="tag-container">
          <h6>Related Tags:</h6>
          <div id="flex-wrap">
            <b-badge
              v-for="(tag, index) in reading_material.tags"
              v-bind:key="index"
              class="flex-wrap-element"
              :variant="changeVariant"
              >{{ tag }}</b-badge
            >
          </div>
        </div>
        <template v-slot:footer>
          <b-button
            v-if="reading_material.category == 'book'"
            :variant="changeOutlineVariant"
            size="sm"
            @click="fetchBookChapter(index)"
            block
            >Show Chapter
            <b-spinner
              v-if="load_book && load_book_id == reading_material.id"
              class="ml-2"
              small
          /></b-button>
          <b-button
            v-else
            :variant="changeOutlineVariant"
            size="sm"
            @click="fetchStoryContent(index)"
            block
            >Read Story<b-spinner
              v-if="load_story && load_story_id == reading_material.id"
              class="ml-2"
              small
          /></b-button>
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
          @click="fetchChapterContent(chapter.id, chapter.title)"
        >
          Chapter {{ chapter.number }} : {{ chapter.title }}
          <b-spinner
            v-if="load_chapter && load_chapter_id == chapter.id"
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
import { BIconXCircle, BIconChevronCompactDown } from 'bootstrap-vue'
export default {
  name: 'readingmaterial',
  props: {
    mode: {
      type: String,
      required: true
    },
    reading_materials: {
      type: Array,
      required: true
    }
  },
  components: {
    BIconXCircle,
    BIconChevronCompactDown
  },
  data () {
    return {
      load_book: false,
      load_book_id: null,
      load_chapter: false,
      load_chapter_id: null,
      load_story: false,
      load_story_id: null,
      selected_book: {
        title: '',
        sub_title: '',
        chapters: []
      }
    }
  },
  methods: {
    goToReadingMaterials () {
      const library = this.$el.getElementsByClassName('library_toggle')[0]
      library.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    fetchBookChapter (index) {
      this.load_book = true
      this.load_book_id = this.reading_materials[index].id
      axios
        .get('http://localhost:8000/reading-material/book-chapters/' + this.reading_materials[index].id + '/')
        .then((response) => {
          this.selected_book.title = this.reading_materials[index].title
          this.selected_book.sub_title = this.reading_materials[index].sub_title
          this.selected_book.chapters = response.data.data
          this.load_book = false
          this.load_book_id = null
        })
      this.$bvModal.show('chapter-modal')
    },
    fetchStoryContent (index) {
      this.load_story = true
      this.load_story_id = this.reading_materials[index].id
      axios
        .get('http://localhost:8000/reading-material/story-content/' + this.reading_materials[index].id + '/')
        .then((response) => {
          this.$emit('content-changed', response.data.data)
          this.load_story = false
          this.load_story_id = null
          this.$bvToast.toast('Content ready - ' + this.reading_materials[index].title, {
            title: 'Notification',
            autoHideDelay: 5000,
            appendToast: true,
            variant: 'info',
            toaster: 'b-toaster-top-left'
          })
        })
    },
    fetchChapterContent (id, title) {
      this.load_chapter = true
      this.load_chapter_id = id
      axios
        .get('http://localhost:8000/reading-material/chapter-content/' + id + '/')
        .then((response) => {
          this.$emit('content-changed', response.data.data)
          this.load_chapter = false
          this.load_chapter_id = null
          this.$bvModal.hide('chapter-modal')
          this.$bvToast.toast('Content ready - ' + title, {
            title: 'Notification',
            autoHideDelay: 5000,
            appendToast: true,
            variant: 'info',
            toaster: 'b-toaster-top-left'
          })
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
  }
}
</script>
<style scoped src="./reading-material.css"></style>
