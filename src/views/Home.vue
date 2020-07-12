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
            <b-col cols=4>
                <b-form-select v-model="reading_speed" :options="speed_options" size="sm" v-bind:disabled="is_reading">
                    <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Pilih kecepatan membaca --</b-form-select-option>
                    </template>
                </b-form-select>
            </b-col>
            <b-col cols=4>
                <b-button 
                    v-if="!is_stopped" 
                    size="sm" 
                    variant="primary" 
                    v-bind:disabled="!is_reading" 
                    @click="stopReading" 
                    block
                >
                    <b-icon icon="pause" />
                </b-button>
                <b-button 
                    v-else 
                    size="sm" 
                    variant="primary" 
                    v-bind:disabled="!is_reading"
                    @click="continueReading" 
                    block
                >
                    <b-icon icon="play" />
                </b-button>
            </b-col>
            <b-col cols=4>
                <b-button v-bind:disabled="!is_reading" @click="forceStopReading" size="sm" variant="primary" block>
                    <b-icon icon="arrow-clockwise"></b-icon>
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import Vue from "vue"
import progressbar from "../components/ProgressBar"
import { BIcon, BIconPlay, BIconPause, BIconArrowClockwise } from 'bootstrap-vue'
export default {
    name:"home",
    components: {
        progressbar,
        BIcon,
        BIconPlay,
        BIconPause,
        BIconArrowClockwise
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
            bus: new Vue(),
            reading_speed: 1050,
            speed_options: [
                { value: 1050, text: "Lamban" },
                { value: 550, text: "Sedang" },
                { value: 250, text: "Cepat" },
            ]
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
                    this.reading_time[i] = this.reading_speed
                }
            }
            else {
                let sentence_word
                this.text_splitted = this.text_raw.split(".")
                this.cleanText()
                for (let i = 0; i < this.text_splitted.length; i++) {
                    sentence_word = this.text_splitted[i].split(" ")
                    this.reading_time[i] = sentence_word.length * this.reading_speed
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