<script>
import { GlModal, GlModalDirective, GlButton } from "@gitlab/ui";
import { apiUrl, apiToken as apiKey } from "../../../../giphy.config.json";

export default {
    components: {
        GlModal,
        GlButton,
    },
    directives: {
        GlModal : GlModalDirective,
    },
    mounted() {
        this.searchGifs();
    },
    data() {
        return {
            modalVisable: false,
        }
    },
    methods: {
        displayModal() {
            this.modalVisable = true;

            
        },
        closeModal() {
            this.modalVisable = false;
        },
        fetchData () {
            const url = new URL(apiUrl);
            const params = new URLSearchParams( {q : 'programmer', api_key: apiKey});

            url.search = parms.toString();
            console.log("this next line");
            console.log(url);
        },
        async searchGifs() {
            const url = new URL(`${apiUrl}gifs/trending`);

            const response = await window.fetch(url);
            const asJSON = await response.json();

            console.log(asJSON);
            },
        },
    };
</script>
<template>
    <div>
        <gl-modal title="Modal Title" modal-id="modal">
         {{ searchGifs }}
        </gl-button>
    </div>
</template>