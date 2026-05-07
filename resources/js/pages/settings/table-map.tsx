import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Car, CheckCircle2, Clock, Droplets, MapPin, Wrench } from 'lucide-react';

const TOTAL_BAYS = 6;

interface QueueItem {
    id: number;
    nomor_antrian: number;
    status: 'Menunggu' | 'Diproses';
    customer: string | null;
    nomor_polisi: string | null;
    merk_kendaraan: string | null;
}

interface Props {
    queues: QueueItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Denah Meja', href: '/settings/table-map' },
];

type BayStatus = 'Kosong' | 'Menunggu' | 'Diproses';

const BAY_CONFIG: Record<BayStatus, { bg: string; border: string; badge: string; icon: React.ElementType; label: string }> = {
    Kosong:   { bg: 'bg-slate-50',   border: 'border-slate-200', badge: 'bg-slate-100 text-slate-500',         icon: Car,       label: 'Kosong' },
    Menunggu: { bg: 'bg-amber-50',   border: 'border-amber-300', badge: 'bg-amber-100 text-amber-700',         icon: Clock,     label: 'Menunggu' },
    Diproses: { bg: 'bg-sky-50',     border: 'border-sky-400',   badge: 'bg-sky-100 text-sky-700',             icon: Droplets,  label: 'Diproses' },
};

function Bay({ bayNumber, queue }: { bayNumber: number; queue: QueueItem | undefined }) {
    const status: BayStatus = queue ? (queue.status as BayStatus) : 'Kosong';
    const cfg = BAY_CONFIG[status];
    const Icon = cfg.icon;

    return (
        <div
            className={`relative flex flex-col rounded-xl border-2 ${cfg.border} ${cfg.bg} p-4 shadow-sm transition-all duration-300`}
            style={{ minHeight: '180px' }}
        >
            {/* Bay header */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
                        {bayNumber}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Bay {bayNumber}</span>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cfg.badge}`}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                </span>
            </div>

            {/* Kendaraan area */}
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
                {queue ? (
                    <>
                        {/* Car silhouette */}
                        <div className={`flex h-16 w-full items-center justify-center rounded-lg border ${cfg.border} bg-white/60`}>
                            <Car className={`h-10 w-10 ${status === 'Menunggu' ? 'text-amber-400' : 'text-sky-400'}`} strokeWidth={1.5} />
                        </div>
                        <div className="w-full space-y-1 text-center">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {queue.nomor_polisi ?? '—'}
                            </p>
                            {queue.merk_kendaraan && (
                                <p className="truncate text-xs text-slate-500">{queue.merk_kendaraan}</p>
                            )}
                            {queue.customer && (
                                <p className="truncate text-xs text-slate-400">{queue.customer}</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <Car className="h-12 w-12" strokeWidth={1} />
                        <span className="text-xs font-medium">Tersedia</span>
                    </div>
                )}
            </div>

            {/* Antrian badge */}
            {queue && (
                <div className="mt-3 flex items-center justify-center">
                    <span className="rounded-full bg-white/80 px-3 py-0.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                        Antrian #{queue.nomor_antrian}
                    </span>
                </div>
            )}
        </div>
    );
}

export default function TableMap({ queues }: Props) {
    const bayQueues: Record<number, QueueItem | undefined> = {};
    queues.forEach((q) => {
        if (q.nomor_antrian >= 1 && q.nomor_antrian <= TOTAL_BAYS) {
            bayQueues[q.nomor_antrian] = q;
        }
    });

    const kosong = TOTAL_BAYS - queues.length;
    const menunggu = queues.filter((q) => q.status === 'Menunggu').length;
    const diproses = queues.filter((q) => q.status === 'Diproses').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Denah Meja" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Denah Meja" description="Visualisasi tata letak bay cuci kendaraan secara real-time" />

                    {/* Legend & Summary */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <span className="h-3 w-3 rounded-full bg-slate-200" />
                            Kosong ({kosong})
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                            <span className="h-3 w-3 rounded-full bg-amber-300" />
                            Menunggu ({menunggu})
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-sky-600">
                            <span className="h-3 w-3 rounded-full bg-sky-400" />
                            Diproses ({diproses})
                        </div>
                    </div>

                    {/* Floor plan container */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* Header — area entrance */}
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                Area Cuci Kendaraan
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Wrench className="h-3.5 w-3.5" />
                                {TOTAL_BAYS} Bay Tersedia
                            </div>
                        </div>

                        {/* Entry arrow */}
                        <div className="flex items-center justify-center gap-3 border-b border-dashed border-slate-200 bg-emerald-50 py-2">
                            <div className="h-px flex-1 bg-emerald-200" />
                            <span className="text-xs font-semibold tracking-widest text-emerald-600">▼ MASUK</span>
                            <div className="h-px flex-1 bg-emerald-200" />
                        </div>

                        {/* Bay grid */}
                        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
                            {Array.from({ length: TOTAL_BAYS }, (_, i) => i + 1).map((bayNumber) => (
                                <Bay
                                    key={bayNumber}
                                    bayNumber={bayNumber}
                                    queue={bayQueues[bayNumber]}
                                />
                            ))}
                        </div>

                        {/* Exit arrow */}
                        <div className="flex items-center justify-center gap-3 border-t border-dashed border-slate-200 bg-red-50 py-2">
                            <div className="h-px flex-1 bg-red-200" />
                            <span className="text-xs font-semibold tracking-widest text-red-500">▼ KELUAR</span>
                            <div className="h-px flex-1 bg-red-200" />
                        </div>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                            <p className="text-2xl font-bold text-slate-700">{kosong}</p>
                            <p className="mt-0.5 text-xs text-slate-400">Bay Kosong</p>
                        </div>
                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-center">
                            <p className="text-2xl font-bold text-amber-700">{menunggu}</p>
                            <p className="mt-0.5 text-xs text-amber-400">Menunggu</p>
                        </div>
                        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-center">
                            <p className="text-2xl font-bold text-sky-700">{diproses}</p>
                            <p className="mt-0.5 text-xs text-sky-400">Diproses</p>
                        </div>
                    </div>

                    {queues.length === 0 && (
                        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 py-10 text-slate-400">
                            <CheckCircle2 className="h-8 w-8 text-slate-300" />
                            <p className="text-sm font-medium">Semua bay kosong — tidak ada antrian aktif</p>
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
