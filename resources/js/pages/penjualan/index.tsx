import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BadgeDollarSign, CheckCircle2, Clock, CreditCard, Droplets, Edit2, Plus, Printer, ShoppingBag, TrendingUp, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Penjualan {
    id: number;
    tanggal: string;
    customer: string | null;
    kendaraan: string;
    layanan: string;
    total: number;
    metode: string | null;
    jumlah_bayar: number | null;
    kembalian: number | null;
    queue_status: 'Menunggu' | 'Diproses' | 'Selesai';
    bay_number: number | null;
}

interface Stats {
    total_pendapatan: number;
    total_transaksi: number;
    pendapatan_hari_ini: number;
    transaksi_hari_ini: number;
    per_metode: {
        Cash: number;
        Transfer: number;
        QRIS: number;
    };
}

interface Props {
    penjualan: Penjualan[];
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Penjualan', href: '/penjualan' },
];

const METODE_COLORS: Record<string, string> = {
    Cash: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Transfer: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    QRIS: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
};

const QUEUE_STATUS_CONFIG: Record<string, { badge: string; row: string; icon: React.ElementType; label: string }> = {
    Menunggu: { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', row: 'bg-amber-50/40',  icon: Clock,     label: 'Menunggu' },
    Diproses: { badge: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',       row: 'bg-sky-50/40',   icon: Droplets,  label: 'Diproses' },
    Selesai:  { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', row: '',          icon: CheckCircle2, label: 'Selesai' },
};

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function formatTanggal(value: string) {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function PenjualanIndex({ penjualan, stats }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [completing, setCompleting] = useState<Penjualan | null>(null);
    const completeForm = useForm({ metode: 'Cash', jumlah_bayar: '' });

    function openComplete(item: Penjualan) {
        setCompleting(item);
        completeForm.setData({ metode: 'Cash', jumlah_bayar: String(item.total) });
    }

    function submitComplete(e: React.FormEvent) {
        e.preventDefault();
        if (!completing) return;
        completeForm.post(route('penjualan.complete', completing.id), {
            onSuccess: () => setCompleting(null),
        });
    }

    const completeKembalian = completing
        ? Math.max(0, parseFloat(completeForm.data.jumlah_bayar || '0') - completing.total)
        : 0;

    const summaryCards = [
        {
            label: 'Total Pendapatan',
            value: formatRupiah(stats.total_pendapatan),
            icon: TrendingUp,
            accent: 'bg-emerald-500',
            light: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'Total Transaksi',
            value: stats.total_transaksi,
            icon: ShoppingBag,
            accent: 'bg-sky-500',
            light: 'bg-sky-50 text-sky-600',
        },
        {
            label: 'Pendapatan Hari Ini',
            value: formatRupiah(stats.pendapatan_hari_ini),
            icon: BadgeDollarSign,
            accent: 'bg-amber-500',
            light: 'bg-amber-50 text-amber-600',
        },
        {
            label: 'Transaksi Hari Ini',
            value: stats.transaksi_hari_ini,
            icon: CreditCard,
            accent: 'bg-violet-500',
            light: 'bg-violet-50 text-violet-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penjualan" />

            <div className="p-4 sm:p-6">
                {flash?.success && (
                    <div className="mb-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Laporan Penjualan</h1>
                        <p className="mt-1 text-sm text-gray-500">Rekap seluruh transaksi yang telah dibayar.</p>
                    </div>
                    <Button asChild className="bg-sky-600 hover:bg-sky-700">
                        <Link href="/penjualan/create">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Transaksi Baru
                        </Link>
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {summaryCards.map((card) => (
                        <div key={card.label} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.light}`}>
                                <card.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{card.label}</p>
                                <p className="text-lg font-semibold text-gray-900">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Per Metode */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    {Object.entries(stats.per_metode).map(([metode, total]) => (
                        <div key={metode} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{metode}</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${METODE_COLORS[metode] ?? 'bg-gray-100 text-gray-600'}`}>
                                    {metode}
                                </span>
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{formatRupiah(total)}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Pelanggan</th>
                                    <th className="px-4 py-3">Kendaraan</th>
                                    <th className="px-4 py-3">Layanan</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3 text-center">Metode</th>
                                    <th className="px-4 py-3 text-right">Bayar</th>
                                    <th className="px-4 py-3 text-right">Kembalian</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {penjualan.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-center text-gray-400">
                                            Belum ada data penjualan.
                                        </td>
                                    </tr>
                                ) : (
                                    penjualan.map((item, idx) => {
                                            const qsCfg = QUEUE_STATUS_CONFIG[item.queue_status] ?? QUEUE_STATUS_CONFIG['Selesai'];
                                            const QsIcon = qsCfg.icon;
                                            return (
                                        <tr key={item.id} className={`hover:bg-gray-50/60 transition-colors ${qsCfg.row}`}>
                                            <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatTanggal(item.tanggal)}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.customer ?? '-'}</td>
                                            <td className="px-4 py-3 text-gray-600">{item.kendaraan}</td>
                                            <td className="px-4 py-3 text-gray-600">{item.layanan}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${qsCfg.badge}`}>
                                                    <QsIcon className="h-3 w-3" />
                                                    {qsCfg.label}
                                                    {item.bay_number != null && item.queue_status !== 'Selesai' && (
                                                        <span className="ml-0.5 opacity-70">· Bay {item.bay_number}</span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">{formatRupiah(item.total)}</td>
                                            <td className="px-4 py-3 text-center">
                                                {item.metode ? (
                                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${METODE_COLORS[item.metode] ?? 'bg-gray-100 text-gray-600'}`}>
                                                        {item.metode}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600">{item.jumlah_bayar != null ? formatRupiah(item.jumlah_bayar) : '-'}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">{item.kembalian != null ? formatRupiah(item.kembalian) : '-'}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {item.queue_status !== 'Selesai' && (
                                                        <button
                                                            onClick={() => openComplete(item)}
                                                            className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 active:scale-95"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Selesaikan
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={route('penjualan.edit', item.id)}
                                                        className="flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100 active:scale-95"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={route('penjualan.struk', item.id)}
                                                        className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200 transition hover:bg-violet-100 active:scale-95"
                                                    >
                                                        <Printer className="h-3.5 w-3.5" />
                                                        Struk
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                            );
                                        })
                                )}
                            </tbody>
                            {penjualan.length > 0 && (
                                <tfoot>
                                    <tr className="border-t border-gray-200 bg-gray-50 font-semibold text-gray-700">
                                        <td colSpan={6} className="px-4 py-3 text-right text-xs uppercase tracking-wide text-gray-500">
                                            Total
                                        </td>
                                        <td className="px-4 py-3 text-right">{formatRupiah(penjualan.reduce((s, i) => s + i.total, 0))}</td>
                                        <td />
                                        <td className="px-4 py-3 text-right">{formatRupiah(penjualan.reduce((s, i) => s + (i.jumlah_bayar ?? 0), 0))}</td>
                                        <td className="px-4 py-3 text-right">{formatRupiah(penjualan.reduce((s, i) => s + (i.kembalian ?? 0), 0))}</td>
                                        <td />
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Selesaikan */}
            {completing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <h2 className="font-semibold text-gray-900">Selesaikan Pesanan</h2>
                            <p className="mt-0.5 text-sm text-gray-500">
                                {completing.customer ?? 'Pelanggan'} · Total {formatRupiah(completing.total)}
                            </p>
                        </div>
                        <form onSubmit={submitComplete} className="space-y-4 px-5 py-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Metode Pembayaran</label>
                                <Select
                                    value={completeForm.data.metode}
                                    onValueChange={(v) => completeForm.setData('metode', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Transfer">Transfer</SelectItem>
                                        <SelectItem value="QRIS">QRIS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Jumlah Bayar</label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={completeForm.data.jumlah_bayar}
                                    onChange={(e) => completeForm.setData('jumlah_bayar', e.target.value)}
                                />
                                {completeForm.errors.jumlah_bayar && (
                                    <p className="text-xs text-red-500">{completeForm.errors.jumlah_bayar}</p>
                                )}
                            </div>
                            {parseFloat(completeForm.data.jumlah_bayar || '0') > 0 && (
                                <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm">
                                    <span className="text-emerald-700">Kembalian</span>
                                    <span className="font-semibold text-emerald-700">{formatRupiah(completeKembalian)}</span>
                                </div>
                            )}
                            <div className="flex gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setCompleting(null)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={completeForm.processing}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {completeForm.processing ? 'Menyimpan...' : 'Konfirmasi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
