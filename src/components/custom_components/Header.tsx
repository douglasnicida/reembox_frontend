import {useActiveItem} from "@/context/ActiveItemContext.tsx";

export default function Header() {
    const { activeItem } = useActiveItem();
    return (
    <header className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 p-4">
        <h1 className="text-2xl font-semibold">{activeItem}</h1>
    </header>
    )
}