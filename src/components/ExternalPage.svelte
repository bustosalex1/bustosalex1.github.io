<script lang="ts">
    import Launch from "~icons/carbon/launch";
    import Maximize from "~icons/carbon/maximize";
    import Minimize from "~icons/carbon/minimize";
    import Dots from "./Dots.svelte";

    interface Props {
        /** The URL of the page to link to. */
        link: string;
        /**
         * An optional title to display. if not specified, this defaults to
         * "Project Page".
         */
        title?: string;
    }

    let { link, title = "Project Page" }: Props = $props();

    let selected = $state(false);
</script>

<!--@component
Simple component that wraps an external page in an `iframe` and provides
options to full-screen the page or go to the page. My intent with this is just
to provide a way to embed other web projects on my website.
-->
<!--rounded rectangle that wraps the iframe and title.-->
<div
    class={`flex flex-col border border-neutral-300 bg-background dark:bg-alt-background ${selected ? "fixed inset-0 z-50 overflow-auto" : "h-[50vh] my-2 hard-shadow rounded-sm overflow-clip"}`}
>
    <!--row providing a title and some buttons to full screen or go to the page-->
    <div
        class="flex flex-row justify-between border-b border-neutral-300 items-center"
    >
        <div class="font-semibold px-2">{title}</div>

        <div class="flex flex-row h-8 items-stretch">
            <a
                class="p-1 btn-hover border-l border-r border-neutral-300 content-center h-8 w-8"
                href={link}
                target="_blank"
            >
                <Launch class="w-4 h-4 mx-auto" />
            </a>
            <button
                class="p-1 btn-hover content-center h-8 w-8"
                onclick={() => {
                    selected = !selected;
                }}
            >
                {#if selected}
                    <Minimize class="w-4 h-4" />
                {:else}
                    <Maximize class="w-4 h-4 mx-auto" />
                {/if}
            </button>
        </div>
    </div>
    <!--the actual external page content-->
    <iframe src={link} class="w-full flex-1 h-full focus:outline-none" {title}
    ></iframe>
</div>
