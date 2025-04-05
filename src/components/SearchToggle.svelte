<script lang="ts">
    import { search } from "./state.svelte";
    import Magnify from "~icons/mdi/magnify";
    import Close from "~icons/mdi/close";
</script>

<button
    class="cursor-pointer"
    onclick={() => {
        search.opened = !search.opened;
    }}
>
    {#if !search.opened}
        <Magnify class="text-content" />
    {:else}
        <Close class="text-content" />
    {/if}
</button>
