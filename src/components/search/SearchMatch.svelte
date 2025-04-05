<script lang="ts">
    import { type CollectionEntry } from "astro:content";
    import { type FuseResult } from "fuse.js";
    interface Props {
        result: FuseResult<CollectionEntry<"notes">>;
    }

    let { result }: Props = $props();
</script>

<a href={"/notes/" + result.item.id} class="group">
    <div
        class="flex flex-col w-full gap-1 rounded-md ring-1 ring-light-accent p-2 bg-background drop-shadow-md text-content dark:bg-alt-background"
    >
        <div class="flex flex-row justify-between items-center">
            <div class="group-hover:text-primary duration-300 transition-all">
                {result.item.data.title}
            </div>
            <div class="text-xs font-mono">
                {result.item.data.pubDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    timeZone: "UTC",
                })}
            </div>
        </div>
        <div class="text-xs">
            {result.item.data.class}
        </div>
    </div>
</a>
