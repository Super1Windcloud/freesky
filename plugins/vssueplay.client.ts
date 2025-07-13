
import { defineNuxtPlugin } from '#app'
import { Vssueplay } from 'vssueplay'
// import 'vssueplay/dist/style.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('Vssueplay', Vssueplay)
})



