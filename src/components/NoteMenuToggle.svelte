<script lang="ts">
    import Menu from "~icons/material-symbols/menu-rounded";
    import { sidebar } from "@components/state.svelte";
</script>

<button
    class="mr-5 cursor-pointer text-content transition-all duration-300 hover:bg-neutral-400/30 p-1 rounded-full group"
    onclick={() => {
        sidebar.opened = !sidebar.opened;
    }}
>
    <Menu class="w-5 h-5" />
</button>
