<template>
  <div id="readingmaterial">
    <div v-if="load_reading_materials" class="custom-animation">
      <b-icon-arrow-clockwise animation="spin" font-scale="2" />
      <p>Wait a second...</p>
    </div>
    <div v-else class="custom-animation">
      <p>Reading Material</p>
      <b-icon-chevron-compact-down
        v-if="!show_reading_materials"
        font-scale="3"
        class="library_toggle"
        @click="showReadingMaterials(true)"
      />
      <b-icon-chevron-compact-up
        v-else
        font-scale="3"
        class="library_toggle"
        @click="showReadingMaterials(false)"
      />
    </div>
    <div
      v-if="show_reading_materials"
      class="flex-wrap-container margin-component"
    >
      <b-card
        class="text-truncate flex-wrap-multiple"
        v-for="(reading_material, index) in reading_materials"
        v-bind:key="index"
        :bg-variant="changeVariantInvert"
      >
        <template v-slot:header>
          Available in {{ reading_material.language }}
        </template>
        <b-card-title>{{ reading_material.title }}</b-card-title>
        <b-card-sub-title>{{ reading_material.sub_title }}</b-card-sub-title>
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
          @click="fetchChapterContent(chapter.id)"
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
      show_reading_materials: false,
      load_reading_materials: true,
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
      },
      reading_materials: []
    }
  },
  methods: {
    showReadingMaterials (value) {
      const _this = this
      if (value === true) {
        this.show_reading_materials = true
        Vue.nextTick(function () {
          const library = _this.$el.getElementsByClassName('library_toggle')[0]
          library.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      } else {
        this.show_reading_materials = false
      }
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
        })
    },
    fetchChapterContent (id) {
      this.load_chapter = true
      this.load_chapter_id = id
      axios
        .get('http://localhost:8000/reading-material/chapter-content/' + id + '/')
        .then((response) => {
          this.$emit('content-changed', response.data.data)
          this.load_chapter = false
          this.load_chapter_id = null
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
    axios.get('http://localhost:8000/reading-material/all/').then(response => {
      this.reading_materials = response.data.data
      this.load_reading_materials = false
    })
  }
}
</script>
<style scoped src="./reading-material.css"></style>
