<script lang="ts">
    import { cubicInOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";

    /** the caption to display below the image. Also used as the image's alt tag */
    export let caption: string | undefined;

    /**
     * how the caption should be displayed. `hover` will display the caption whenever a user hovers
     * over the image. `below` will permanently display the caption below the image.
     */
    export let captionMode: "hover" | "below" | undefined;

    /** the source for the image to display */
    export let imgSrc: string | undefined;

    /** whether or not to display the image in a new tab, instead of in a modal */
    export let newTab: true | undefined;

    // flag to set when the modal is clicked
    let selected = false;

    // flag to set when the image is hovered over
    let hovered = false;

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
`ClickableImage.svelte` provides an image component that can be clicked to show a larger modal of the same
image. The component also shows a caption, which can be passed in using the `caption` prop, when a
user hovers over the image if `captionMode` is set to `hover`. Alternatively, `captionMode` can be
set to `below` to permanently display the caption below the image.
-->

<!-- default image -->
<button
    on:click={toggleModal}
    class="relative cursor-pointer overflow-hidden rounded-md mx-auto block"
    on:mouseenter={() => (hovered = true)}
    on:mouseleave={() => (hovered = false)}
>
    <slot />
    <!-- if `hoverCaption` is defined, only show the caption on hover. otherwise, just show the caption without any animation -->
    {#if hovered && caption && captionMode === "hover"}
        <div
            class="absolute bottom-0 left-0 h-auto w-full bg-black bg-opacity-70 p-2 rounded-b-md text-white flex justify-start items-center text-left"
            transition:fly={{ y: 50, duration: 250, easing: cubicInOut }}
        >
            {caption}
        </div>
    {:else if caption && captionMode === "below"}
        <em class="text-center">{caption}</em>
    {/if}
</button>

{#if selected && !newTab}
    <!-- modal container -->
    <button
        class="fixed top-0 left-0 h-[100vh] w-[100vw] bg-black bg-opacity-70 flex items-center justify-center cursor-pointer z-50"
        on:click={toggleModal}
        transition:fade={{ duration: 250, easing: cubicInOut }}
    >
        <!-- modal content -->
        <div
            class="min-h-fit h-[75vh] max-h-[75vh] max-w-[75vw]"
            transition:fly={{ duration: 250, y: 50, easing: cubicInOut }}
        >
            {#if imgSrc}
                <img
                    src={imgSrc}
                    alt={caption}
                    class="w-auto h-auto max-h-full object-contain rounded-md not-prose"
                />
            {/if}
            {#if caption}
                <em class="text-white">{caption}</em>
            {/if}
        </div>
    </button>
{/if}
