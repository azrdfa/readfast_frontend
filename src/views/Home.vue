<template>
    <div id="home">
        <b-form-textarea class="component-margin" rows="5" no-resize v-model="text_raw" placeholder="Tulis kalimat di sini ..."></b-form-textarea>
        <b-dropdown
            size="sm"
            class="component-margin"
            split-variant="outline-primary"
            variant="primary"
            v-bind:text="read_word ? 'Kata Kilat' : 'Kalimat Kilat'"
            v-bind:disabled="is_reading || text_raw == ''"
            @click="applyReadType"
            dropright
            split
            block
        >
            <b-dropdown-item @click="changeReadType('kata')">Kata Kilat</b-dropdown-item>
            <b-dropdown-item @click="changeReadType('kalimat')">Kalimat Kilat</b-dropdown-item>
        </b-dropdown>
        <progressbar class="component-margin" :bus="bus"></progressbar>
        <b-row class="component-margin">
            <b-col cols=6>
                <b-button 
                    v-if="!is_stopped" 
                    size="sm" 
                    variant="primary" 
                    v-bind:disabled="!is_reading" 
                    @click="stopReading" 
                    block
                >
                    Berhenti
                </b-button>
                <b-button 
                    v-else 
                    size="sm" 
                    variant="primary" 
                    v-bind:disabled="!is_reading"
                    @click="continueReading" 
                    block
                >
                    Lanjutkan
                </b-button>
            </b-col>
             <b-col cols=6>
                <b-button v-bind:disabled="!is_reading" @click="forceStopReading" size="sm" variant="primary" block>Ulangi</b-button>
            </b-col>
        </b-row>
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
                <readingmaterial @clicked="readChapter"></readingmaterial>
            </div>
        </b-sidebar>
    </div>
</template>
<script>
import Vue from "vue"
import readingmaterial from "../components/ReadingMaterial"
import progressbar from "../components/ProgressBar"
export default {
    name:"home",
    components: {
        readingmaterial,
        progressbar
    },
    data () {
        return {
            is_reading: false,
            is_stopped: false,
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
                    this.reading_time[i] = 250
                }
            }
            else {
                let sentence_word
                this.text_splitted = this.text_raw.split(".")
                this.cleanText()
                for (let i = 0; i < this.text_splitted.length; i++) {
                    sentence_word = this.text_splitted[i].split(" ")
                    this.reading_time[i] = sentence_word.length * 250
                }
            }

            this.is_reading = true
            this.startReading()
            this.bus.$emit("automateProgress", this.text_splitted.length, this.reading_time, this.reading_index)
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
            this.$emit('valueChanged', this.text_splitted[this.reading_index])
            function next() {
                if (_this.reading_index > _this.text_splitted.length - 2) {
                    _this.resetReading()
                } else {
                    _this.$emit('valueChanged', _this.text_splitted[_this.reading_index + 1])
                    _this.reading_index++
                    _this.reading_machine = setTimeout(next, _this.reading_time[_this.reading_index]);
                }
            }
            this.reading_machine = setTimeout(next, this.reading_time[this.reading_index]);
        },

        resetReading() {
            this.$emit('valueChanged', null)
            clearInterval(this.reading_machine)
            this.is_reading = false
            this.is_stopped = false
            this.text_splitted = null
            this.reading_index = 0
            this.reading_time = {}
        },

        stopReading() {
            clearInterval(this.reading_machine)
            this.bus.$emit("stopProgress")
            this.is_stopped = true;
        },

        continueReading() {
            this.is_stopped = false
            this.startReading()
            this.bus.$emit("automateProgress", this.text_splitted.length, this.reading_time, this.reading_index)
        },

        forceStopReading() {
            this.bus.$emit("stopProgress")
            this.resetReading()
        }

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