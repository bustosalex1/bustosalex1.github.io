<script lang="ts">
    import { search } from "./state.svelte";
    import Magnify from "~icons/mdi/magnify";
</script>

<button
    onclick={() => {
        search.opened = true;
    }}
>
    <Magnify class="text-content" />
</button>
