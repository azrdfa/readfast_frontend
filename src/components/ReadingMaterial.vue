<template>
    <div id="readingmaterial">
        <b-card-group deck>
            <b-card v-for="(book,index) in books" v-bind:key="index" class="text-truncate">  
                <b-card-title>{{ book.title }}</b-card-title>
                <b-card-sub-title>{{ book.sub_title }}</b-card-sub-title>
                <template v-slot:footer>
                    <b-button size="sm" @click="openModal(index)" variant="primary" block>Lihat Chapter</b-button>
                </template>
            </b-card>
        </b-card-group>
        <b-modal id="chapter-modal" hide-footer>
            <template v-slot:modal-header>
                <div>
                    <h5>{{ title }}</h5>
                    {{ sub_title }}
                </div>
                <b-button size="sm" variant="primary" @click="$bvModal.hide('chapter-modal')">
                    <b-icon-x-circle />
                </b-button>
            </template>
            <div class="chapter-container">
                <b-button size="sm" 
                v-for="(chapter, index) in chapters" 
                variant="outline-primary" 
                class="chapter-card"
                v-bind:key="index"
                >
                    Chapter {{ chapter }}
                </b-button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import { BIcon, BIconXCircle } from 'bootstrap-vue'
export default {
    name: "readingmaterial",
    components: {
        BIcon,
        BIconXCircle
    },
    data() {
        return {
            title:"",
            sub_title:"",
            chapters: [],
            books: [
                {
                    title: "Harry Potter", 
                    sub_title: "and The Philosopher's Stone",
                    chapters: [1,2,3]
                },
                {
                    title: "Harry Potter", 
                    sub_title: "and The Chamber of Secrets",
                    chapters: [1,2,3,4]
                },
                {
                    title: "Harry Potter", 
                    sub_title: "and The Prisoner of Azkaban",
                    chapters: [1,2,3,4,5]
                },
                {
                    title: "Harry Potter", 
                    sub_title: "and The Goblet of Fire",
                    chapters: [1,2,3,4,5,6]
                }
            ]
        }
    },
    methods: {
        openModal(index) {
            this.title = this.books[index].title
            this.sub_title = this.books[index].sub_title
            this.chapters = this.books[index].chapters
            this.$bvModal.show("chapter-modal")
        }
    }
}
</script>
<style scoped>
    .chapter-container {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }
    .chapter-card {
        flex-basis: 30%;
        margin-bottom: 5%;
    }
</style>