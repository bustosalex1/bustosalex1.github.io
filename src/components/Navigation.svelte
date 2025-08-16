<script lang="ts">
    /**
     * Component providing links to main pages on my website. New links and their
     * slugs can be added in the `links` variable. This component also displays the
     * title of the website (my name) and the theme toggle.
     */
    import Dots from "@components/Dots.svelte";
    import Menu from "~icons/material-symbols/menu-rounded";
    import Close from "~icons/material-symbols/close-rounded";
    import { fade, slide } from "svelte/transition";
    import { MediaQuery } from "svelte/reactivity";

    const md = new MediaQuery("min-width: 768px"); // 2 columns
    interface Props {
        url: string;
    }

    let { url }: Props = $props();
    const links = [
        ["Posts", "/"],
        ["Photos", "/experiments/photos"],
        ["Quotes I Like", "/experiments/quotes"],
    ];

    let show = $state(false);

    $effect(() => {
        if (show) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    });

    $effect(() => {
        if (md.current) {
            show = false;
        }
    });
</script>

<Dots
    class="flex flex-row w-full bg-background h-10 mx-auto pl-4 pr-1 border-neutral-300 border items-center"
>
    <a
        href="/"
        class="font-bold whitespace-nowrap text-content transition-all duration-150 content-center hover:text-primary pr-4 border-neutral-300 border-r h-10"
    >
        Alex Bustos
    </a>
    {#each links as [title, link] (link)}
        <a
            href={link}
            class={[
                {
                    "underline text-primary":
                        (url.includes(link) && link !== "/") ||
                        (url.includes("posts") && link === "/") ||
                        (url === "/" && link === "/") ||
                        (url === "" && link === "/"),
                },
                "hover:text-primary transition-all duration-300 px-4 border-neutral-300 content-center whitespace-nowrap border-r hidden md:block h-10",
            ]}
        >
            {title}
        </a>
    {/each}
    <button
        class={[
            "ml-auto md:hidden content-center rounded-sm h-8 w-8 hover:text-primary group transition-all duration-150 hover:bg-primary/10 cursor-pointer active:scale-90",
            { "z-50": show },
        ]}
        onclick={() => {
            show = !show;
        }}
    >
        {#if show}
            <Close
                class="h-5 w-5 mx-auto text-neutral-500 group-hover:text-primary transition-all duration-150"
            />
        {:else}
            <Menu
                class="h-5 w-5 mx-auto text-neutral-500 group-hover:text-primary transition-all duration-150"
            />
        {/if}
    </button>
</Dots>

{#if show}
    <div
        class="fixed left-0 top-0 h-full bg-background border-r border-neutral-300 z-50 flex flex-col items-stretch min-w-60"
        transition:slide={{ axis: "x", duration: 150 }}
    >
        <Dots
            class="p-2 border-b border-neutral-300"
            topLeft={false}
            topRight={false}
            bottomLeft={false}
        >
            <a
                href="/"
                class="font-bold whitespace-nowrap transition-all duration-150 content-center hover:text-primary"
            >
                Alex Bustos
            </a>
        </Dots>
        {#each links as [title, link] (link)}
            <a
                href={link}
                class={[
                    {
                        "underline text-primary":
                            (url.includes(link) && link !== "/") ||
                            (url.includes("posts") && link === "/") ||
                            (url === "/" && link === "/") ||
                            (url === "" && link === "/"),
                    },
                    "hover:text-primary transition-all duration-300 pr-4 pl-6 border-neutral-300 content-center whitespace-nowrap border-b py-2",
                ]}
            >
                {title}
            </a>
        {/each}
    </div>
    <button
        class="inset-0 z-40 fixed backdrop-blur-lg"
        aria-label="menu-backdrop"
        transition:fade={{ duration: 150 }}
        onclick={() => {
            show = false;
        }}
    ></button>
{/if}
