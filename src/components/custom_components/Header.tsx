import {Bell, ChevronDown} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useActiveItem} from "@/context/ActiveItemContext.tsx";

export default function Header() {
    const { activeItem } = useActiveItem();
    return (
        <header className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 p-4">
        <h1 className="text-2xl font-semibold">{activeItem}</h1>
        <div className="flex items-center gap-4">
            <Bell className="h-5 w-5"/>
            <Button variant="ghost" className="gap-2">
                <span>Org</span>
                <ChevronDown className="h-4 w-4"/>
            </Button>
        </div>
    </header>
    )
}