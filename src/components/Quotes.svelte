<script lang="ts">
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
            aboutCharacter: "Nadia Cherneshevsky",
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

<!--@component
Basically most of the page for the `quotes.astro` page, since I'm currently
using a bit of reactivity to sort posts. in the future it would probably be
good to statically render these and maybe make a content collection for quotes,
or something like that.
-->

<!--title section-->
<div class="border-neutral-300 border bg-background z-10">
    <!--title-->
    <h1 class="pt-5 pb-10 px-2 text-4xl text-center font-crimson italic">
        Quotes I Like
    </h1>
    <div
        class="flex flex-row border-neutral-300 h-10 justify-center absolute -bottom-5 border w-fit mx-auto left-0 right-0 rounded-sm bg-background hard-shadow"
    >
        <!--sorting controls-->
        <div
            class="whitespace-nowrap p-2 rounded-l-sm border-neutral-300 border-r content-center text-center"
        >
            Sort by
        </div>
        <select
            bind:value={sortBy}
            class="p-2 w-fit rounded-r-sm cursor-pointer content-center"
        >
            <option value="source">Source Material</option>
            <option value="author">Author</option>
            <option value="character">Character</option>
        </select>
    </div>
</div>

<!--box containing all of the quotes-->
<div
    class="flex flex-col gap-4 px-4 pb-4 pt-10 diagonal-lines border-l border-r border-b border-neutral-300 border-dashed"
>
    <!--render each quote list-->
    {#each groupedQuotes as [key, quoteList] (key)}
        <div
            class="flex flex-col divide-y divide-neutral-300 border rounded-sm hard-shadow border-neutral-300 bg-background"
        >
            <a
                class="text-xl font-semibold font-crimson p-2 sticky top-0 bg-background rounded-t-sm"
                id={key}
                href={`#${key}`}
            >
                {key}
            </a>

            <!--render each quote in the quote list-->
            {#each quoteList as quote (quote.quote)}
                <div class="flex flex-col w-full">
                    <div
                        class="border-b border-neutral-300 border-dashed p-8 font-crimson text-lg"
                    >
                        {@html quote.quote}
                    </div>
                    <div
                        class="flex flex-row h-10 items-stretch overflow-x-auto w-full"
                    >
                        <div class="grow"></div>
                        {#if quote.character !== undefined}
                            <div
                                class="border-r border-neutral-300 border-dashed content-center px-2 whitespace-nowrap"
                            >
                                &mdash; {quote.character}
                            </div>
                        {/if}
                        <div
                            class={[
                                "content-center px-2 whitespace-nowrap",
                                {
                                    "border-r border-dashed border-neutral-300":
                                        quote.aboutCharacter !== undefined,
                                },
                            ]}
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
                            <div class="content-center px-2 whitespace-nowrap">
                                Regarding {quote.aboutCharacter}
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</div>
