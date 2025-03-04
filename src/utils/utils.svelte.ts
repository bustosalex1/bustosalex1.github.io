export function onClickOutside(node: HTMLElement, callback: () => unknown) {
    window.addEventListener("mouseup", handleClick);
    function handleClick(e: MouseEvent) {
        if (!node.contains(e.target as Node)) {
            callback();
        }
    }

    return {
        destroy: () => {
            window.removeEventListener("click", handleClick);
        },
    };
}
