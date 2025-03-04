<script lang="ts">
    import Menu from "~icons/line-md/menu";
    import { sidebar } from "@components/state.svelte";
</script>

<button
    class="mr-5 cursor-pointer hover:text-primary text-content transition-all duration-300"
    onclick={() => {
        sidebar.opened = true;
    }}
>
    <Menu class="w-5 h-5" />
</button>
