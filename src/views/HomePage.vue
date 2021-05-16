<template>
  <div id="homepage">
    <loading v-if="!load_reading_materials" />
    <div v-else class="relative-container" :class="mode">
      <div class="absolute-container" style="text-align: right;">
        <toggle-button
          @change="editMode"
          :switch-color="{ checked: '#192734', unchecked: '#ffffff' }"
          :color="{ checked: '#ffffff', unchecked: '#192734' }"
          :speed="500"
        />
        <h3>{{ mode }} mode</h3>
      </div>
      <b-container id="homebody">
        <b-img
          :class="{ invert_effect: mode === 'dark' }"
          :src="logo"
          alt="logo"
          center
        />
        <b-row class="fill-top center">
          <b-col class="align-self-end" style="text-align: center;">
            <h2 v-if="display == ''" id="display">-</h2>
            <h2 v-bind:style="displayStyle" v-else>{{ display }}</h2>
          </b-col>
        </b-row>
        <b-row class="center">
          <b-col class="align-self-start">
            <ReadingMachine
              @display-changed="editDisplay"
              v-bind:content.sync="content"
              :mode="mode"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="align-self-start">
            <ReadingMaterial
              id="anjay"
              @content-changed="editContent"
              :mode="mode"
              :reading_materials="reading_materials"
            />
          </b-col>
        </b-row>
      </b-container>
      <Footer />
    </div>
    <v-tour
      name="tutorial"
      :steps="tutorialSteps"
      :options="tutorialOptions"
      :callbacks="tutorialCallbacks"
    ></v-tour>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import axios from 'axios'
import ReadingMachine from '@/components/readingmachine/ReadingMachine'
import ReadingMaterial from '@/components/readingmaterial/ReadingMaterial'
import Footer from '@/components/footer/Footer'
import Loading from '@/components/loading/Loading.vue'
export default {
  name: 'homepage',
  components: {
    ReadingMachine,
    ReadingMaterial,
    Footer,
    Loading
  },
  data: function () {
    return {
      logo: 'src/assets/read_fast.png',
      display: '',
      content: '',
      // default for h2 is 2rem
      display_size: 2,
      mode: 'light',
      reading_materials: [],
      load_reading_materials: false,
      currentTutorialStep: 0,
      tutorialStepId: [
        'display',
        'reading_machine_text_area',
        'reading_machine_reading_type',
        'reading_machine_adjust_speed',
        'reading_machine_stop_continue',
        'reading_machine_reset',
        'reading_machine_skip',
        'reading_0'
      ],
      tutorialCallbacks: {
        onNextStep: this.goToNextComponent,
        onPreviousStep: this.goToPreviousComponent
      },
      tutorialOptions: {
        useKeyboardNavigation: true,
        highlight: true,
        labels: {
          buttonSkip: 'Skip Tutorial',
          buttonPrevious: 'Previous',
          buttonNext: 'Next',
          buttonStop: 'Finish Tutorial'
        }
      },
      tutorialSteps: [
        {
          target: '#display',
          header: {
            title: 'First time here?'
          },
          content: 'Let\'s get started! Word or sentence will quickly appear here',
          params: {
            placement: 'top',
            enableScrolling: false,
            highlight: false
          }
        },
        {
          target: '#reading_machine_text_area',
          header: {
            title: 'Text Area'
          },
          content: 'You can write sentences manually here',
          params: {
            placement: 'right',
            enableScrolling: false
          }
        },
        {
          target: '#reading_machine_reading_type',
          header: {
            title: 'Reading Type'
          },
          content: 'There are two reading styles to choose from. it\'s read by sentence and read by word',
          params: {
            placement: 'right',
            enableScrolling: false
          }
        },
        {
          target: '#reading_machine_adjust_speed',
          header: {
            title: 'Adjust Speed'
          },
          content: 'You can adjust your reading speed here from slow to medium to fast',
          params: {
            placement: 'left',
            enableScrolling: false
          }
        },
        {
          target: '#reading_machine_stop_continue',
          header: {
            title: 'Pause Button'
          },
          content: 'While you are reading you can press this button to stop or continue',
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#reading_machine_reset',
          header: {
            title: 'Reset Button'
          },
          content: 'While you are reading you can repeat the reading process by pressing this button',
          params: {
            placement: 'right',
            enableScrolling: false
          }
        },
        {
          target: '#reading_machine_skip',
          header: {
            title: 'Skip Button'
          },
          content: 'When you are reading in a per-sentence reading style you can skip by pressing this button',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '#reading_0',
          header: {
            title: 'Reading Material'
          },
          content: 'We also provide reading material which includes novels and short stories',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        }
      ]
    }
  },
  methods: {
    goToNextComponent () {
      this.currentTutorialStep += 1
      const currentId = this.tutorialStepId[this.currentTutorialStep]
      const currentComponent = document.getElementById(currentId)
      currentComponent.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },
    goToPreviousComponent () {
      this.currentTutorialStep -= 1
      const currentId = this.tutorialStepId[this.currentTutorialStep]
      const currentComponent = document.getElementById(currentId)
      currentComponent.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },
    editDisplay (value, isWord) {
      if (isWord) {
        this.display_size = 3.5
      } else {
        if (value.length >= 210) {
          this.display_size = 1.5
        } else {
          this.display_size = 2
        }
      }
      this.display = value
    },
    editContent (value) {
      this.content = value
    },
    editMode (object) {
      if (object.value === true) {
        this.mode = 'dark'
      } else {
        this.mode = 'light'
      }
    }
  },
  computed: {
    displayStyle () {
      return {
        'font-size': `${this.display_size}rem`
      }
    }
  },
  mounted () {
    axios
      .get('http://readfast-be.id/reading-material/all/')
      .then((response) => {
        this.reading_materials = response.data.data
        this.load_reading_materials = true
        if (localStorage.hasVisitedReadFast === undefined) {
          localStorage.setItem('hasVisitedReadFast', 1)
          this.$tours.tutorial.start()
        }
      })
    axios
      .post('http://readfast-be.id/activity/post-log/')
  }
}
</script>
<style scoped src="./home-page.css"></style>
