<script lang="ts">
    import { MediaQuery } from "svelte/reactivity";

    interface Props {
        cards: number;
    }

    let { cards }: Props = $props();

    const sm = new MediaQuery("min-width: 640px"); // 2 columns
    const lg = new MediaQuery("min-width: 1024px"); // 3 columns
</script>

{#if lg.current}
    {#each { length: 3 - (cards % 3) }}
        <div class="bg-background"></div>
    {/each}
{:else if sm.current}
    {#each { length: cards % 2 }}
        <div class="bg-background"></div>
    {/each}
{/if}
