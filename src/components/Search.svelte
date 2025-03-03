<script lang="ts">
    import { type CollectionEntry } from "astro:content";
    import Fuse, { type FuseResult } from "fuse.js";
    import SearchMatch from "./SearchMatch.svelte";
    interface Props {
        posts: CollectionEntry<"notes">[];
        dropdown?: boolean;
        keys: string[];
    }

    let { posts, dropdown = false, keys }: Props = $props();

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
<div class="w-full" class:dropdown>
    <!-- search box -->
    <input
        type="text"
        class="w-full border-light-accent border rounded-md p-1 focus:ring-none text-content focus:outline-2 focus:outline-offset-1 focus:outline-light-accent"
        placeholder="Search notes..."
        bind:value={searchValue}
        tabindex="0"
    />
    <!-- search results -->
    <div
        class="flex flex-col gap-2 w-full mt-4"
        class:dropdown-content={dropdown}
        class:z-[1]={dropdown}
        tabindex="0"
        role="button"
    >
        {#each results as result (result.item.id)}
            <SearchMatch {result} />
        {/each}
    </div>
</div>
