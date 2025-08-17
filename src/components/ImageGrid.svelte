<script lang="ts">
    /**
     * A flexible grid of images with the same aspect ratio. If the images provided
     * do not have the same aspect ratio, they will be justified appropriately to
     * maintain an aspect ratio. Images can be `ClickableImage` components, or just
     * regular images. This option is specified using the `clickable` boolean prop.
     */
    import { Image } from "astro:assets";
    import type { ImageTuple } from "@types";
    import ClickableImage from "@components/ClickableImage.svelte";

    // provide types for props
    interface Props {
        images: ImageTuple[];
        caption?: string;
        clickable?: boolean;
        captionMode?: "hover" | "below";
        rows: string;
        cols: string;
    }

    const {
        images,
        caption = undefined,
        clickable = undefined,
        captionMode = undefined,
        rows,
        cols,
    }: Props = $props();
</script>

<div
    class={`grid ${cols} ${rows} bg-background border border-neutral-300 hard-shadow rounded-sm overflow-clip`}
>
    {#each images as [src, alt, caption]}{/each}
    <!-- { -->
    <!--     images.map(([src, alt, caption]) => -->
    <!--         clickable ? ( -->
    <!--             <ClickableImage -->
    <!--                 caption={caption} -->
    <!--                 captionMode={captionMode} -->
    <!--                 imgSrc={src.src} -->
    <!--                 client:load -->
    <!--             > -->
    <!--                 <Image -->
    <!--                     src={src} -->
    <!--                     alt={alt} -->
    <!--                     class="not-prose object-cover h-full w-full" -->
    <!--                 /> -->
    <!--             </ClickableImage> -->
    <!--         ) : ( -->
    <!--             <Image src={src} alt={alt} /> -->
    <!--         ), -->
    <!--     ) -->
    <!-- } -->
</div>
{#if caption}
    <div class="text-center content-center font-crimson text-lg italic">
        {caption}
    </div>
{/if}
