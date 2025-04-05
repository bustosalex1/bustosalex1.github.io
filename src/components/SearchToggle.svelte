<script lang="ts">
    import { search } from "./state.svelte";
    import Magnify from "~icons/mdi/magnify";
</script>

<button
    class="cursor-pointer"
    onclick={() => {
        search.opened = !search.opened;
    }}
>
    <Magnify class="text-content" />
</button>
