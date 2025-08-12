<script lang="ts">
    import { flip } from "svelte/animate";

    type Quote = {
        quote: string;
        source: string;
        additionalSourceInfo?: string;
        author?: string;
        character?: string;
        aboutCharacter?: string;
    };

    let sortBy: "source" | "character" | "author" = $state("source");

    const quotes: Quote[] = [
        {
            quote: "In my thoughts I use the technique of positive visualization.",
            source: "The Sopranos",
            additionalSourceInfo: "S1E2",
            character: "Christopher Moltisanti",
        },
        {
            quote: "I don't know Tony. It's like just the fuckin' regularness of life is too fuckin' hard for me or something.",
            source: "The Sopranos",
            additionalSourceInfo: "S1E8",
            character: "Christopher Moltisanti",
        },
        {
            quote: "Don't become too much of an individual, Syril.",
            source: "Andor",
            additionalSourceInfo: "S2E4",
            character: "Eedy Karn",
        },
        {
            quote: "Log off. That cookie shit makes me nervous.",
            source: "The Sopranos",
            additionalSourceInfo: "S3E1",
            character: "Tony Soprano",
        },
        {
            quote: "All this from a slice of <em>gabagool</em>?",
            source: "The Sopranos",
            additionalSourceInfo: "S3E3",
            character: "Tony Soprano",
        },
        {
            quote: "And on the 7th day God took his ass to Red Lobster.",
            source: "The Other Two",
            additionalSourceInfo: "S2E5",
            character: "Streeter's T-Shirt",
        },
        {
            quote: "If you're not destroying your mind and body via paid work, you're not living right.",
            source: "Bullshit Jobs",
            character: "Clement",
            author: "David Graeber",
        },
        {
            quote: "But I've recently come to realize I've been neglecting one key component of every crucial life event. Feelings.",
            source: "The Rehearsal",
            additionalSourceInfo: "S1E3",
            character: "Nathan Fielder",
        },
        {
            quote: "Hiro climbs down from the roof of the turret and, throwing caution to the wind, drinks three glasses of L.A. tap water.",
            source: "Snowcrash",
            author: "Neal Stephenson",
            aboutCharacter: "Hiro Protagonist",
        },
        {
            quote: "Fussing with these things was one of those deals where the longer it took, the longer it took.",
            source: "Termination Shock",
            author: "Neal Stephenson",
            aboutCharacter: "Rufus Grant",
        },
        {
            quote: "But red Mars was gone, and gone for good. Soletta or not, ice age or not, the biosphere would grow and spread until it covered everything, with an ocean in the north, and lakes in the south, and streams, forests, prairies, cities and roads, oh she saw it all; white clouds raining mud on the ancient highlands while the uncaring masses built their cities as fast as they could, the long run-out of civilization burying her world.",
            source: "Blue Mars",
            author: "Kim Stanley Robinson",
            aboutCharacter: "Ann Clayborne",
        },
        {
            quote: "That was how humans knew each other. Tiny fractions of their lives intersected or were known in any way to anybody else. It was much like living alone in the universe. Which was strange. A justification for living with friends, for marrying, for sharing rooms and lives as much as possible. Not that this made people truly intimate; but it reduced the sensation of solitude.",
            source: "Blue Mars",
            author: "Kim Stanley Robinson",
            aboutCharacter: "Sax Russell",
        },
        {
            quote: `She went around that afternoon feeling happy, and that evening when she joined Art she said, "Hey! I did some work today."<br>"Well!" Art said. "Let's go out and celebrate."`,
            source: "Blue Mars",
            author: "Kim Stanley Robinson",
            aboutCharacter: "Nadia Charneshevsky",
        },
        {
            quote: "Then over the black open water of the strait &mdash; the biggest stretch of open water he had ever seen on Mars. For twenty kilometers he floated over the open water, exclaiming out loud at the sight. Then ahead an immense airy bridge arced over the strait. The black-violet plate of water below it was dotted with sailboats, ferries, long barges, all trailing the white Vs of their wakes. Nirgal floated over them, circling the bridge twice to marvel at the sight &mdash; like nothing he had ever seen on Mars before: water, the sea, a whole future world.",
            source: "Blue Mars",
            author: "Kim Stanley Robinson",
            aboutCharacter: "Nirgal",
        },
        {
            quote: "I will not calm down! This is insane! What do you think is gonna happen? That I'm gonna go enslave my friends for a bunch of aliens I've never met? This is my life! These are my people!",
            character: "Mark Grayson",
            additionalSourceInfo: "S1E8",
            source: "Invincible",
        },
        {
            quote: "You can't plant if you haven't botany.",
            additionalSourceInfo: "near Virginia-Highland",
            source: "Intown Ace Hardware",
        },
    ];

    let groupedQuotes = $derived.by(() => {
        const groupings = quotes.reduce(
            (accumulator, currentQuote) => {
                let key = currentQuote[sortBy];
                if (key === undefined) {
                    if (
                        sortBy === "character" &&
                        currentQuote.aboutCharacter !== undefined
                    ) {
                        key = currentQuote.aboutCharacter;
                    } else {
                        key = "Unknown";
                    }
                }
                if (accumulator[key] === undefined) {
                    accumulator[key] = [];
                }

                accumulator[key].push(currentQuote);
                return accumulator;
            },
            {} as Record<string, Quote[]>,
        );

        return Object.entries(groupings).toSorted((a, b) => {
            return a[0].localeCompare(b[0]);
        });
    });
</script>

<div class="mt-4 text-content">
    <div
        class="border border-default-outline bg-background dark:bg-alt-background hard-shadow"
    >
        <h1 class="text-3xl font-black p-2 border-b border-light-accent">
            Quotes I Like
        </h1>
        <div class="flex flex-row w-full">
            <div
                class="whitespace-nowrap border-r border-light-accent p-2 text-sm"
            >
                Sort By
            </div>
            <select
                bind:value={sortBy}
                class="p-2 w-full text-sm cursor-pointer"
            >
                <option value="source">Source Material</option>
                <option value="author">Author</option>
                <option value="character">Character</option>
            </select>
        </div>
    </div>

    <div class="flex flex-col my-2 gap-2">
        {#each groupedQuotes as quoteGroup}
            <div
                class="flex flex-col bg-background dark:bg-alt-background divide-y divide-default-outline border border-default-outline hard-shadow"
            >
                <h2 class="text-xl font-bold p-2">{quoteGroup[0]}</h2>
                {#each quoteGroup[1] as quote (quote.quote)}
                    <div
                        class="flex flex-col w-full bg-background dark:bg-alt-background"
                        animate:flip
                    >
                        <div class="border-b border-light-accent p-8 font-mono">
                            {@html quote.quote}
                        </div>
                        <div
                            class="flex flex-row justify-end h-10 items-stretch overflow-y-scroll"
                        >
                            {#if quote.character !== undefined}
                                <div
                                    class="border-l border-r border-light-accent content-center px-2 whitespace-nowrap"
                                >
                                    &mdash; {quote.character}
                                </div>
                            {/if}
                            <div
                                class="border-r border-light-accent content-center px-2 whitespace-nowrap"
                            >
                                <em>{quote.source}</em>
                                {#if quote.additionalSourceInfo}
                                    {quote.additionalSourceInfo}
                                {/if}
                                {#if quote.author}
                                    by {quote.author}
                                {/if}
                            </div>
                            {#if quote.aboutCharacter}
                                <div
                                    class="border-light-accent content-center px-2 whitespace-nowrap"
                                >
                                    Regarding {quote.aboutCharacter}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
