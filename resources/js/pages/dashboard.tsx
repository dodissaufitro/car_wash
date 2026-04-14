import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Car, ClipboardList, ListOrdered, TrendingUp, Users, Wrench } from 'lucide-react';

interface Stats {
    totalPelanggan: number;
    totalKendaraan: number;
    totalLayanan: number;
    totalKaryawan: number;
    transaksiHariIni: number;
    pendapatanHariIni: number;
    antrianAktif: number;
    totalTransaksi: number;
}

interface RecentTransaction {
    id: number;
    customer: string;
    kendaraan: string;
    total: number;
    status: 'Pending' | 'Selesai' | 'Batal';
    tanggal: string;
}

interface ActiveQueue {
    id: number;
    nomor_antrian: number;
    status: 'Menunggu' | 'Diproses';
    customer: string;
    kendaraan: string;
}

interface Props {
    stats: Stats;
    recentTransactions: RecentTransaction[];
    activeQueues: ActiveQueue[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const statusBadge: Record<string, string> = {
    Pending:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Selesai:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Batal:    'bg-red-50 text-red-600 ring-1 ring-red-200',
    Menunggu: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    Diproses: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
};

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function getTanggalIndo() {
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
}

export default function Dashboard({ stats, recentTransactions, activeQueues }: Props) {
    const primaryCards = [
        {
            label: 'Pendapatan Hari Ini',
            value: formatRupiah(stats.pendapatanHariIni),
            icon: TrendingUp,
            accent: 'bg-emerald-500',
            light: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'Transaksi Hari Ini',
            value: stats.transaksiHariIni,
            icon: ClipboardList,
            accent: 'bg-sky-500',
            light: 'bg-sky-50 text-sky-600',
        },
        {
            label: 'Antrian Aktif',
            value: stats.antrianAktif,
            icon: ListOrdered,
            accent: 'bg-orange-500',
            light: 'bg-orange-50 text-orange-600',
        },
        {
            label: 'Total Pelanggan',
            value: stats.totalPelanggan,
            icon: Users,
            accent: 'bg-violet-500',
            light: 'bg-violet-50 text-violet-600',
        },
    ];

    const secondaryCards = [
        { label: 'Kendaraan', value: stats.totalKendaraan, icon: Car,         light: 'bg-sky-50 text-sky-500' },
        { label: 'Layanan',   value: stats.totalLayanan,   icon: Wrench,       light: 'bg-indigo-50 text-indigo-500' },
        { label: 'Transaksi', value: stats.totalTransaksi, icon: ClipboardList,light: 'bg-teal-50 text-teal-500' },
        { label: 'Karyawan',  value: stats.totalKaryawan,  icon: Users,        light: 'bg-rose-50 text-rose-500' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">

                {/* Greeting */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Ringkasan Hari Ini</h1>
                        <p className="mt-0.5 text-sm text-slate-400">{getTanggalIndo()}</p>
                    </div>
                </div>

                {/* Stat cards utama */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {primaryCards.map(({ label, value, icon: Icon, accent, light }) => (
                        <div key={label} className="relative overflow-hidden rounded-xl border bg-white shadow-sm">
                            <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
                            <div className="flex items-center gap-4 px-5 py-5 pl-6">
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${light}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-500">{label}</p>
                                    <p className="mt-0.5 truncate text-2xl font-bold text-slate-800">{value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info cards sekunder */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {secondaryCards.map(({ label, value, icon: Icon, light }) => (
                        <div key={label} className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm">
                            <div>
                                <p className="text-xs text-slate-400">{label}</p>
                                <p className="mt-0.5 text-xl font-bold text-slate-700">{value}</p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${light}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Transaksi terbaru */}
                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b bg-slate-50/70 px-5 py-3.5">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-slate-400" />
                                <h2 className="text-sm font-semibold text-slate-700">Transaksi Terbaru</h2>
                            </div>
                            <Link href="/transactions" className="text-xs font-medium text-sky-600 hover:text-sky-700">
                                Lihat semua →
                            </Link>
                        </div>
                        {recentTransactions.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                                <ClipboardList className="h-8 w-8 opacity-40" />
                                <p className="text-sm">Belum ada transaksi hari ini</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {recentTransactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-sky-50/40">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-800">{t.customer ?? '-'}</p>
                                            <p className="truncate text-xs text-slate-400">{t.kendaraan ?? '-'}</p>
                                        </div>
                                        <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
                                            <span className="text-sm font-bold text-slate-700">{formatRupiah(t.total)}</span>
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[t.status] ?? ''}`}>
                                                {t.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Antrian aktif */}
                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b bg-slate-50/70 px-5 py-3.5">
                            <div className="flex items-center gap-2">
                                <ListOrdered className="h-4 w-4 text-slate-400" />
                                <h2 className="text-sm font-semibold text-slate-700">Antrian Aktif</h2>
                            </div>
                            <Link href="/queues" className="text-xs font-medium text-sky-600 hover:text-sky-700">
                                Lihat semua →
                            </Link>
                        </div>
                        {activeQueues.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                                <ListOrdered className="h-8 w-8 opacity-40" />
                                <p className="text-sm">Tidak ada antrian aktif</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {activeQueues.map((q) => (
                                    <div key={q.id} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-sky-50/40">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                                            {q.nomor_antrian}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-800">{q.customer ?? '-'}</p>
                                            <p className="truncate text-xs text-slate-400">{q.kendaraan ?? '-'}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[q.status] ?? ''}`}>
                                            {q.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

