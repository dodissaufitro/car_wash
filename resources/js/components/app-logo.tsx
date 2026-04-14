import { Droplets } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 shadow-sm ring-1 ring-white/30">
                <Droplets className="size-5 text-white drop-shadow" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate font-bold leading-tight tracking-wide text-white">Car Wash Pro</span>
                <span className="truncate text-xs text-sky-100/80">Sistem Manajemen</span>
            </div>
        </>
    );
}
