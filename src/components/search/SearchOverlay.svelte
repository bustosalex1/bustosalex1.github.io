<script lang="ts">
    import { type CollectionEntry } from "astro:content";
    import { fly, slide } from "svelte/transition";
    import { search } from "../state.svelte";
    import { cubicInOut } from "svelte/easing";
    import Search from "./Search.svelte";
    interface Props {
        posts: CollectionEntry<"notes">[];
        keys: string[];
    }

    let { posts, keys }: Props = $props();
</script>

<!--@component
Simple search box that uses `fuse.js` to fuzzy find results across my `notes`
collection.
-->
{#if search.opened}
    <div
        class="absolute top-2 mx-auto left-1/4 right-1/4 dark:bg-background bg-alt-background border border-light-accent shadow-md flex flex-col items-center p-5 rounded-md"
        transition:fly={{ duration: 300, y: -50, easing: cubicInOut }}
    >
        <Search {posts} {keys} />
    </div>
{/if}
