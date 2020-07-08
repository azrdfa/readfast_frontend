<template>
    <div id="home">
        <h1 v-if="text_turbo != null" class="text">{{ text_turbo }}</h1>
        <h1 v-else class="text">-</h1>
        <progressbar :bus="bus"></progressbar>
        <b-form-textarea class="component-margin" rows="5" no-resize v-model="text_raw" placeholder="Tulis kalimat di sini ..."></b-form-textarea>
        <b-dropdown
            size="sm"
            class="component-margin"
            split-variant="outline-primary"
            variant="primary"
            v-bind:text="read_word ? 'Kata Kilat' : 'Kalimat Kilat'"
            v-bind:disabled="is_reading || text_raw == ''"
            @click="applyReadType()"
            dropright
            split
            block
        >
            <b-dropdown-item @click="changeReadType('kata')">Kata Kilat</b-dropdown-item>
            <b-dropdown-item @click="changeReadType('kalimat')">Kalimat Kilat</b-dropdown-item>
        </b-dropdown>
        <b-row class="component-margin">
            <b-col cols=6>
                <b-button size="sm" variant="primary" block v-b-toggle.sidebar-1>Bahan Bacaan</b-button>
            </b-col>
        </b-row>
        <b-sidebar 
        id="sidebar-1" 
        title="Bahan Bacaan" 
        backdrop-variant="info"
        backdrop
        shadow>
            <div class="px-3 py-2">
                <beta @clicked="readChapter"></beta>
            </div>
        </b-sidebar>
    </div>
</template>
<script>
import Vue from "vue"
import beta from "../components/beta"
import progressbar from "../components/ProgressBar"
export default {
    name:"home",
    components: {
        beta,
        progressbar
    },
    data () {
        return {
            is_reading: false,
            text_turbo: null,
            text_splitted: null,
            reading_index: 0,
            reading_time: {},
            text_raw: '',
            reading_machine: null,
            read_word: true,
            bus: new Vue()
        }
    },
    methods: {
        readChapter(value) {
            this.text_raw = value
        },
        changeReadType(value) {
            if (value == "kata") {
                this.read_word = true
            } else if (value == "kalimat") {
                this.read_word = false
            }
        },

        applyReadType() {
            if (this.read_word) {
                this.text_splitted = this.text_raw.split(" ")
                this.cleanText()
                for (let i = 0; i < this.text_splitted.length; i++) {
                    this.reading_time[i] = 300
                }
            }
            else {
                let sentence_word
                this.text_splitted = this.text_raw.split(".")
                this.cleanText()
                for (let i = 0; i < this.text_splitted.length; i++) {
                    sentence_word = this.text_splitted[i].split(" ")
                    this.reading_time[i] = sentence_word.length * 300
                }
            }
            this.startReading()
            this.bus.$emit("automateProgress", this.text_splitted.length)
        },

        cleanText() {
            let tmp_text_splitted = new Array()
            this.text_splitted.forEach(function(value) {
                if (value != "") {
                    tmp_text_splitted.push(value)
                }
            })
            this.text_splitted = tmp_text_splitted
        },

        startReading() {
            let _this = this
            this.is_reading = true
            this.text_turbo = this.text_splitted[0]
            function next() {
                if (_this.reading_index > _this.text_splitted.length - 2) {
                    _this.resetReading()
                } else {
                     _this.text_turbo = _this.text_splitted[_this.reading_index + 1]
                    _this.reading_index++
                    _this.reading_machine = setTimeout(next, _this.reading_time[_this.reading_index]);
                }
            }
            this.reading_machine = setTimeout(next, this.reading_time[this.reading_index]);
        },

        resetReading() {
            clearInterval(this.reading_machine)
            this.is_reading = false
            this.text_turbo = null
            this.text_splitted = null
            this.reading_index = 0
            this.reading_time = {}
        },

        stopReading() {
            clearInterval(this.reading_machine)
            this.is_reading = false
        },
    }
}
</script>
<style>
.text {
    text-align: center;
}
.component-margin {
    margin-top: 10px;
}
</style>