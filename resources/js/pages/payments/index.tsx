import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, CreditCard, Edit2, Plus, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface TransactionOption {
    id: number;
    label: string;
    total: number;
}

interface Payment {
    id: number;
    transaction_id: number;
    customer: string | null;
    kendaraan: string | null;
    metode: string;
    jumlah_bayar: number;
    kembalian: number;
    created_at: string;
}

interface Props {
    payments: Payment[];
    transactions: TransactionOption[];
}

type FormData = {
    transaction_id: string;
    metode: string;
    jumlah_bayar: string;
    kembalian: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pembayaran', href: '/payments' },
];

const METODE_COLORS: Record<string, string> = {
    Cash:     'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Transfer: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    QRIS:     'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
};

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export default function PaymentsIndex({ payments, transactions }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        transaction_id: '',
        metode: '',
        jumlah_bayar: '',
        kembalian: '0',
    });

    const selectedTransaction = transactions.find((t) => String(t.id) === data.transaction_id);
    const kembalianCalc = Math.max(0, (parseFloat(data.jumlah_bayar) || 0) - (selectedTransaction?.total ?? 0));

    function openCreate() {
        reset();
        clearErrors();
        setEditingPayment(null);
        setShowModal(true);
    }

    function openEdit(payment: Payment) {
        setEditingPayment(payment);
        setData({
            transaction_id: String(payment.transaction_id),
            metode: payment.metode,
            jumlah_bayar: String(payment.jumlah_bayar),
            kembalian: String(payment.kembalian),
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const submitData = { ...data, kembalian: String(kembalianCalc) };
        if (editingPayment) {
            put(route('payments.update', editingPayment.id), {
                data: submitData,
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('payments.store'), {
                data: submitData,
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(payment: Payment) {
        if (!confirm('Hapus data pembayaran ini?')) return;
        router.delete(route('payments.destroy', payment.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembayaran" />

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

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
                            <CreditCard className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Pembayaran</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola data pembayaran transaksi</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Pembayaran
                    </Button>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pelanggan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kendaraan</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Metode</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Bayar</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Kembalian</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 shrink-0 text-sky-600" />
                                            <span className="font-medium">{payment.customer ?? '-'}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">{payment.kendaraan ?? '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${METODE_COLORS[payment.metode] ?? ''}`}>
                                            {payment.metode}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">{formatRupiah(payment.jumlah_bayar)}</td>
                                    <td className="px-4 py-3 text-right">{formatRupiah(payment.kembalian)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(payment)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(payment)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <CreditCard className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada data pembayaran</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPayment ? 'Edit Pembayaran' : 'Tambah Pembayaran'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Transaksi</Label>
                            <Select value={data.transaction_id} onValueChange={(v) => setData('transaction_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih transaksi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {transactions.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.transaction_id && <p className="text-xs text-red-500">{errors.transaction_id}</p>}
                        </div>

                        {selectedTransaction && (
                            <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm">
                                <span className="text-slate-500">Total tagihan:</span>{' '}
                                <span className="font-bold text-sky-700">{formatRupiah(selectedTransaction.total)}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <Label>Metode Pembayaran</Label>
                            <Select value={data.metode} onValueChange={(v) => setData('metode', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih metode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Transfer">Transfer</SelectItem>
                                    <SelectItem value="QRIS">QRIS</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.metode && <p className="text-xs text-red-500">{errors.metode}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label>Jumlah Bayar</Label>
                            <Input
                                type="number"
                                min="0"
                                value={data.jumlah_bayar}
                                onChange={(e) => setData('jumlah_bayar', e.target.value)}
                                placeholder="0"
                            />
                            {errors.jumlah_bayar && <p className="text-xs text-red-500">{errors.jumlah_bayar}</p>}
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                            <span className="text-slate-500">Kembalian:</span>{' '}
                            <span className="font-bold text-slate-700">{formatRupiah(kembalianCalc)}</span>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-sky-600 hover:bg-sky-700">
                                {editingPayment ? 'Simpan Perubahan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
