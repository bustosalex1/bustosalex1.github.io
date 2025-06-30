<script lang="ts">
    import Menu from "~icons/material-symbols/menu-rounded";
    import { sidebar } from "@components/state.svelte";
</script>

<button
    class="cursor-pointer text-content transition-all duration-300 hover:bg-neutral-400/30 group h-10 w-10"
    onclick={() => {
        sidebar.opened = !sidebar.opened;
    }}
>
    <Menu class="w-5 h-5 mx-auto" />
</button>
