<template>
    <div id="readingmaterial">
        <p>
            Harry Potter and The Sorcerer Stone dalam bahasa indonesia
        </p>
        <b-list-group>
            <b-list-group-item v-on:click="firstChapter" action>Chapter 1</b-list-group-item>
            <b-list-group-item v-on:click="secondChapter" action>Chapter 2</b-list-group-item>
        </b-list-group>
    </div>
</template>
<script>
export default {
    name: "readingmaterial",
    data() {
        return {
            first_chapter: "Anak Laki-laki Yang Bertahan Hidup MR dan Mrs Dursley yang tinggal di Privet Drive nomor empat bangga menyatakan diri bahwa mereka orang-orang yang normal, untunglah. Mereka tak bisa diharapkan terlibat dengan sesuatu yang ajaib atau misterius, karena mereka sama sekali tak percaya omong kosong seperti itu.",
            second_chapter: "Mr Dursley adalah direktur Grunnings, perusahaan yang memproduksi bor. Dia laki-laki besar-gemuk, nyaris tanpa leher, walaupun kumisnya besar sekali. Mrs Dursley kurus berambut pirang, lehernya dua kali panjang leher biasa. Baginya ini menguntungkan, karena kegemarannya adalah menjulurkan leher di atas pagar-pagar, mengintip para tetangga. Suami-istri Dursley mempunyai seorang anak laki-laki kecil bernama Dudley dan menurut pendapat mereka, di dunia ini tak ada anak lain yang sehebat Dudley."
        }
    },
    methods: {
        firstChapter() {
            this.$emit("clicked", this.first_chapter)
        },
        secondChapter() {
            this.$emit("clicked", this.second_chapter)
        }
    }
}
</script>