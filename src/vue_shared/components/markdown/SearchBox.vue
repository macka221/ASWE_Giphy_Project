<script>
import { GlSearchBoxByType } from "@gitlab/ui";
import { debounce } from "lodash";

export default {
    components: {
        GlSearchBoxByType,
    },
    data() {
        return {
            searchTerm: "",
            searchedGifs: [],
        }
    },
    mounted() {
        this.debouncedSearch = debounce(this.search, 250);
    },
    methods: {
        search(thissearchTerm) {
            return null;
        },
    },
}


</script>
