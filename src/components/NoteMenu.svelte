<script lang="ts">
    /**
     * Component for the "Notes" section of my website that provides links to all
     * of the pages in the "Notes" content collection. Also responsive -- it will
     * display on the left side on larger screens and be hidden on smaller screens
     * like phones. On these screens there's a button on the nav bar that can be
     * used to access the notes menu. Which... maybe that's like bad in terms of
     * coupling.
     */
    import { type CollectionEntry } from "astro:content";
    import { sidebar } from "./state.svelte";
    import { fade, slide } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import { onClickOutside } from "@utils/utils.svelte";

    interface Props {
        notes: CollectionEntry<"notes">[];
    }

    let { notes }: Props = $props();

    // organize notes according to class
    const classes = new Map<string, CollectionEntry<"notes">[]>();

    notes.forEach((note) => {
        if (classes.has(note.data.class)) {
            classes.get(note.data.class)?.push(note);
        } else {
            classes.set(note.data.class, [note]);
        }
    });
</script>

{#if sidebar.opened}
    <div
        class="fixed left-0 top-0 bottom-0 right-0 bg-black/50 z-[5] backdrop-blur-xs"
        transition:fade={{ duration: 300 }}
    ></div>
    <div
        class="fixed left-0 top-0 h-dvh bg-alt-background w-80 z-10 text-content whitespace-nowrap"
        transition:slide={{ axis: "x", duration: 200, easing: cubicInOut }}
        use:onClickOutside={() => {
            sidebar.opened = false;
        }}
    >
        <ul class="p-4 flex flex-col space-y-2 w-full">
            <!-- sidebar content here -->
            <a
                class="font-bold text-lg hover:text-primary duration-300 transition-all"
                href="/notes/">Alex's Notes</a
            >
            {#each classes as [cls, notes]}
                <li class="flex flex-col w-full text-sm space-y-2">
                    <div class="font-semibold">{cls}</div>
                    <ul class="">
                        {#each notes as note}
                            <a
                                href={"/notes/" + note.id}
                                class="duration-300 transition-all rounded-md"
                            >
                                <li
                                    class="w-full group hover:bg-neutral-400/30 rounded-mdtransition-all duration-300 rounded-md py-1 pl-5"
                                >
                                    {note.data.title}
                                </li>
                            </a>
                        {/each}
                    </ul>
                </li>
            {/each}
        </ul>
    </div>
{/if}
