<script lang="ts">
    import type { Snippet } from "svelte";
    import { cubicInOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";
    interface Props {
        /**
         * The caption to display below the image. Also used as the image's alt
         * tag.
         */
        caption?: string;

        /**
         * The alt text for the image. If not supplied, the caption will be
         * used.
         */
        alt?: string;

        /** The source for the image to display. */
        imgSrc?: string;
        /**
         * Whether or not to display the image in a new tab, instead of in a
         * modal.
         */
        newTab?: boolean;
        children?: Snippet;
    }

    let {
        caption = undefined,
        alt = undefined,
        imgSrc = undefined,
        newTab = false,
        children,
    }: Props = $props();

    // flag to set when the modal is clicked
    let selected = $state(false);

    // callback whenever you click on the image
    const toggleModal = () => {
        if (newTab) {
            window.open(imgSrc, "_blank");
        } else {
            selected = !selected;
        }
    };
</script>

<!-- @component
`ClickableImage.svelte` provides an image component that can be clicked to show
a larger modal of the same image. The component also shows a caption, which can
be passed in using the `caption` prop, when a user hovers over the image if
`captionMode` is set to `hover`. Alternatively, `captionMode` can be set to
`below` to permanently display the caption below the image.
-->

<!-- default image -->
<button
    onclick={toggleModal}
    class="relative cursor-pointer overflow-hidden rounded-md border border-neutral-300 hard-shadow bg-background not-prose"
>
    {@render children?.()}
    {#if caption !== undefined}
        <div
            class="w-full text-center content-center italic font-crimson text-lg border-t border-neutral-300"
        >
            {caption}
        </div>
    {/if}
</button>

{#if selected && !newTab}
    <!-- modal container -->
    <button
        class="fixed inset-0 bg-black/90 flex items-center justify-center cursor-pointer z-50"
        onclick={toggleModal}
        transition:fade={{ duration: 150, easing: cubicInOut }}
    >
        <!-- modal content -->
        <div
            class="min-h-fit h-[75vh] max-h-[75vh] max-w-[75vw]"
            transition:fly={{ duration: 150, y: 50, easing: cubicInOut }}
        >
            {#if imgSrc}
                <img
                    src={imgSrc}
                    alt={alt ?? caption}
                    class="w-auto h-auto max-h-full object-contain rounded-sm not-prose m-2"
                />
            {/if}
            {#if caption}
                <div class="italic text-white font-crimson text-lg">
                    {caption}
                </div>
            {/if}
        </div>
    </button>
{/if}
