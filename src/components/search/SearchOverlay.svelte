<script lang="ts">
    import { type CollectionEntry } from "astro:content";
    import Fuse, { type FuseResult } from "fuse.js";
    import SearchMatch from "./SearchMatch.svelte";
    import { slide } from "svelte/transition";
    import { search } from "../state.svelte";
    interface Props {
        posts: CollectionEntry<"notes">[];
        keys: string[];
    }

    let { posts, keys }: Props = $props();

    const fuse = new Fuse(posts, {
        keys: keys,
        findAllMatches: false,
        includeMatches: true,
        ignoreLocation: true,
        shouldSort: true,
    });

    let results: FuseResult<CollectionEntry<"notes">>[] = $state([]);
    let searchValue = $state("");

    $effect(() => {
        if (searchValue.length > 0) {
            results = fuse.search(searchValue);
        } else {
            results = [];
        }
    });
</script>

<!--@component
Simple search box that uses `fuse.js` to fuzzy find results across my `notes`
collection.
-->
{#if search.opened}
    <div
        class=" h-50 backdrop-blur-xs bg-red-500"
        transition:slide={{ duration: 100 }}
    >
        <!-- search box -->
        <input
            type="text"
            class="w-full border-light-accent border rounded-md p-1.5 focus:ring-none text-content focus:outline-2 focus:outline-offset-1 focus:outline-light-accent bg-alt-background"
            placeholder="Search notes..."
            bind:value={searchValue}
        />
        <!-- search results -->
        <div class="flex flex-col gap-2 w-full mt-4">
            {#each results as result (result.item.id)}
                <SearchMatch {result} />
            {/each}
        </div>
    </div>
{/if}
