<script module lang="ts">
    export type ProcessedPhoto = {
        src: string;
        width: number;
        height: number;
        alt: string;
    };

    export type ProcessedSection = {
        title?: string;
        photos: ProcessedPhoto[];
    };
</script>

<script lang="ts">
    import { crossfade, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    type Props = {
        sections?: ProcessedSection[];
        photos?: ProcessedPhoto[];
    };

    let { sections, photos }: Props = $props();

    // Flat list across all sections — the index into this is the crossfade
    // key that pairs each thumb with the lightbox image.
    const flat: ProcessedPhoto[] = sections
        ? sections.flatMap((s) => s.photos)
        : (photos ?? []);

    function globalIdx(si: number, pi: number): number {
        if (!sections) return pi;
        let idx = pi;
        for (let i = 0; i < si; i++) idx += sections[i].photos.length;
        return idx;
    }

    let openIdx = $state(-1);
    // Tracks the last viewed photo so the closing crossfade pairs with the
    // correct thumb (openIdx is -1 by then). Updated on open + navigate.
    let lastOpen = $state(0);
    const isOpen = $derived(openIdx >= 0);

    const [send, receive] = crossfade({
        duration: 280,
        easing: quintOut,
        fallback: () => ({
            duration: 180,
            css: (t) => `opacity: ${t}`,
        }),
    });

    function open(i: number) {
        lastOpen = i;
        openIdx = i;
    }

    function close() {
        openIdx = -1;
    }

    function navigate(delta: number) {
        const next = openIdx + delta;
        if (next < 0 || next >= flat.length) return;
        lastOpen = next;
        openIdx = next;
    }

    function onKey(e: KeyboardEvent) {
        if (!isOpen) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") navigate(1);
        else if (e.key === "ArrowLeft") navigate(-1);
    }

    // Touch drag — the current image follows the finger and prev/next
    // images are pre-rendered offscreen at ±100vw so they slide in as
    // the user drags. On release we either commit to the new photo (if
    // past the commit threshold) or animate back to center.
    const COMMIT_FRACTION = 0.25; // fraction of viewport width to commit
    const SETTLE_MS = 220;
    const RUBBERBAND = 0.3; // resistance when dragging past the first/last photo

    let dragOffsetPx = $state(0);
    let isDragging = $state(false);
    let dragStartX = 0;
    let dragStartY = 0;
    let dragLocked = false; // true once we've decided this gesture is horizontal
    let settleId: number | null = null;
    const canPrev = $derived(openIdx > 0);
    const canNext = $derived(openIdx >= 0 && openIdx < flat.length - 1);

    function animateOffset(target: number, duration: number): Promise<void> {
        if (settleId !== null) cancelAnimationFrame(settleId);
        const start = dragOffsetPx;
        const startTime = performance.now();
        return new Promise((resolve) => {
            function frame(now: number) {
                const t = Math.min(1, (now - startTime) / duration);
                const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
                dragOffsetPx = start + (target - start) * eased;
                if (t < 1) {
                    settleId = requestAnimationFrame(frame);
                } else {
                    settleId = null;
                    resolve();
                }
            }
            settleId = requestAnimationFrame(frame);
        });
    }

    function onTouchStart(e: TouchEvent) {
        if (e.touches.length !== 1) return;
        if (settleId !== null) return; // ignore touches mid-settle
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        isDragging = true;
        dragLocked = false;
    }

    function onTouchMove(e: TouchEvent) {
        if (!isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - dragStartX;
        const dy = e.touches[0].clientY - dragStartY;

        // First few pixels of movement decide whether this is a horizontal
        // gesture (ours) or vertical (let the browser handle it).
        if (!dragLocked) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            if (Math.abs(dy) > Math.abs(dx)) {
                isDragging = false;
                return;
            }
            dragLocked = true;
        }

        let clamped = dx;
        if (dx > 0 && !canPrev) clamped = dx * RUBBERBAND;
        else if (dx < 0 && !canNext) clamped = dx * RUBBERBAND;
        dragOffsetPx = clamped;
    }

    async function onTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        if (!dragLocked) return;

        const dx = dragOffsetPx;
        const vw = window.innerWidth;
        const threshold = vw * COMMIT_FRACTION;

        if (dx > threshold && canPrev) {
            await animateOffset(vw, SETTLE_MS);
            lastOpen -= 1;
            openIdx -= 1;
            dragOffsetPx = 0;
        } else if (dx < -threshold && canNext) {
            await animateOffset(-vw, SETTLE_MS);
            lastOpen += 1;
            openIdx += 1;
            dragOffsetPx = 0;
        } else {
            await animateOffset(0, 180);
        }
    }

    // Lock body scroll while the lightbox is open. Reserves scrollbar gutter
    // so toggling overflow doesn't reflow the page.
    $effect(() => {
        if (!isOpen) return;
        const w = window.innerWidth - document.documentElement.clientWidth;
        if (w > 0) document.body.style.paddingRight = `${w}px`;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    });
</script>

<svelte:window onkeydown={onKey} />

{#if sections}
    <div class="flex flex-col gap-4">
        {#each sections as section, si}
            <div class="border border-line hard-shadow">
                <div
                    class="flex flex-row border-b border-line items-center bg-secondary-bg"
                >
                    <div class="font-mono font-bold text-xs px-2 py-2">
                        {section.title}
                    </div>
                </div>
                <div class="columns-2 gap-0">
                    {#each section.photos as photo, pi (globalIdx(si, pi))}
                        {@const idx = globalIdx(si, pi)}
                        {#if openIdx !== idx}
                            <button
                                type="button"
                                class="break-inside-avoid block w-full p-0 m-0 border-0 bg-transparent cursor-pointer"
                                onclick={() => open(idx)}
                                in:receive={{ key: idx }}
                                out:send={{ key: idx }}
                            >
                                <img
                                    src={photo.src}
                                    width={photo.width}
                                    height={photo.height}
                                    alt={photo.alt}
                                    loading="lazy"
                                    decoding="async"
                                    class="block w-full h-auto"
                                />
                            </button>
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
    </div>
{:else if photos}
    <div
        class="grid grid-cols-1 md:grid-cols-3 diagonal-lines border-l border-r border-b border-line bg-secondary-bg hard-shadow"
    >
        {#each photos as photo, i (i)}
            {#if openIdx !== i}
                <button
                    type="button"
                    class="aspect-square block p-0 m-0 border-0 bg-transparent cursor-pointer"
                    onclick={() => open(i)}
                    in:receive={{ key: i }}
                    out:send={{ key: i }}
                >
                    <img
                        src={photo.src}
                        width={photo.width}
                        height={photo.height}
                        alt={photo.alt}
                        loading="lazy"
                        decoding="async"
                        class="block w-full h-full object-cover"
                    />
                </button>
            {/if}
        {/each}
    </div>
{/if}

{#if isOpen}
    <div
        class="fixed inset-0 z-50 touch-pan-y overscroll-contain"
        role="dialog"
        aria-modal="true"
        ontouchstart={onTouchStart}
        ontouchmove={onTouchMove}
        ontouchend={onTouchEnd}
        ontouchcancel={onTouchEnd}
    >
        <button
            type="button"
            aria-label="Close"
            class="absolute inset-0 bg-black/90 cursor-default"
            onclick={close}
            transition:fade={{ duration: 280 }}
        ></button>

        <!--
          Carousel "tape": three viewport-sized cells laid out at -100vw, 0,
          100vw. The whole tape translates by `dragOffsetPx`, so during a drag
          the current image follows the finger and the adjacent one slides in.
        -->
        <div
            class="absolute inset-0 pointer-events-none"
            style:transform="translate3d({dragOffsetPx}px, 0, 0)"
        >
            {#if canPrev}
                <div
                    class="absolute inset-y-0 w-screen flex items-center justify-center p-4"
                    style:left="-100vw"
                >
                    <img
                        src={flat[lastOpen - 1].src}
                        width={flat[lastOpen - 1].width}
                        height={flat[lastOpen - 1].height}
                        alt={flat[lastOpen - 1].alt}
                        class="block max-w-[90vw] max-h-[85vh] w-auto h-auto border border-line"
                    />
                </div>
            {/if}

            <div
                class="absolute inset-y-0 w-screen flex items-center justify-center p-4"
                style:left="0"
            >
                <img
                    src={flat[lastOpen].src}
                    width={flat[lastOpen].width}
                    height={flat[lastOpen].height}
                    alt={flat[lastOpen].alt}
                    class="block max-w-[90vw] max-h-[85vh] w-auto h-auto border border-line pointer-events-auto"
                    in:receive={{ key: lastOpen }}
                    out:send={{ key: lastOpen }}
                />
            </div>

            {#if canNext}
                <div
                    class="absolute inset-y-0 w-screen flex items-center justify-center p-4"
                    style:left="100vw"
                >
                    <img
                        src={flat[lastOpen + 1].src}
                        width={flat[lastOpen + 1].width}
                        height={flat[lastOpen + 1].height}
                        alt={flat[lastOpen + 1].alt}
                        class="block max-w-[90vw] max-h-[85vh] w-auto h-auto border border-line"
                    />
                </div>
            {/if}
        </div>

        <div
            class="absolute inset-0 pointer-events-none font-mono text-xs text-white"
            in:fade={{ duration: 180, delay: 280 }}
            out:fade={{ duration: 120 }}
        >
            <button
                type="button"
                aria-label="Close"
                class="pointer-events-auto absolute top-4 right-4 border border-line px-3 py-1.5 bg-black/40 hover:bg-white hover:text-black transition-colors"
                onclick={close}
            >
                close <span class="text-white/50">[esc]</span>
            </button>
            <button
                type="button"
                aria-label="Previous"
                class="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 border border-line w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/40 disabled:hover:text-white"
                disabled={openIdx === 0}
                onclick={() => navigate(-1)}
            >
                &larr;
            </button>
            <button
                type="button"
                aria-label="Next"
                class="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 border border-line w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/40 disabled:hover:text-white"
                disabled={openIdx === flat.length - 1}
                onclick={() => navigate(1)}
            >
                &rarr;
            </button>
            <div
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center max-w-[90vw] text-center"
            >
                {#if flat[lastOpen].alt}
                    <p class="border border-line bg-black/40 px-2 py-1">
                        {flat[lastOpen].alt}
                    </p>
                {/if}
                <p class="text-white/60">{lastOpen + 1} / {flat.length}</p>
            </div>
        </div>
    </div>
{/if}
