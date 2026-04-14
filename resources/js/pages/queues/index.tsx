import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit2, ListOrdered, Plus, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface TransactionOption {
    id: number;
    label: string;
}

interface Queue {
    id: number;
    nomor_antrian: number;
    status: string;
    transaction_id: number;
    customer: string | null;
    kendaraan: string | null;
    created_at: string;
}

interface Props {
    queues: Queue[];
    transactions: TransactionOption[];
}

type FormData = {
    transaction_id: string;
    nomor_antrian: string;
    status: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Antrian', href: '/queues' },
];

const STATUS_COLORS: Record<string, string> = {
    Menunggu: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Diproses: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    Selesai:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

export default function QueuesIndex({ queues, transactions }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingQueue, setEditingQueue] = useState<Queue | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        transaction_id: '',
        nomor_antrian: '',
        status: 'Menunggu',
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditingQueue(null);
        const nextNumber = queues.length > 0 ? Math.max(...queues.map((q) => q.nomor_antrian)) + 1 : 1;
        setData({ transaction_id: '', nomor_antrian: String(nextNumber), status: 'Menunggu' });
        setShowModal(true);
    }

    function openEdit(queue: Queue) {
        setEditingQueue(queue);
        setData({
            transaction_id: String(queue.transaction_id),
            nomor_antrian: String(queue.nomor_antrian),
            status: queue.status,
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingQueue) {
            put(route('queues.update', editingQueue.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('queues.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(queue: Queue) {
        if (!confirm(`Hapus antrian #${queue.nomor_antrian}?`)) return;
        router.delete(route('queues.destroy', queue.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Antrian" />

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
                            <ListOrdered className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Antrian</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola antrian cuci kendaraan</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Antrian
                    </Button>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">No. Antrian</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pelanggan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kendaraan</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {queues.map((queue) => (
                                <tr key={queue.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <ListOrdered className="h-4 w-4 shrink-0 text-sky-600" />
                                            <span className="text-lg font-bold text-sky-700">{queue.nomor_antrian}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{queue.customer ?? '-'}</td>
                                    <td className="text-muted-foreground px-4 py-3">{queue.kendaraan ?? '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[queue.status] ?? ''}`}>
                                            {queue.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(queue)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(queue)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {queues.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <ListOrdered className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada antrian</p>
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
                        <DialogTitle>{editingQueue ? 'Edit Antrian' : 'Tambah Antrian'}</DialogTitle>
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
                        <div className="space-y-1">
                            <Label htmlFor="nomor_antrian">Nomor Antrian</Label>
                            <Input
                                id="nomor_antrian"
                                type="number"
                                min="1"
                                value={data.nomor_antrian}
                                onChange={(e) => setData('nomor_antrian', e.target.value)}
                            />
                            {errors.nomor_antrian && <p className="text-xs text-red-500">{errors.nomor_antrian}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Menunggu">Menunggu</SelectItem>
                                    <SelectItem value="Diproses">Diproses</SelectItem>
                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-sky-600 hover:bg-sky-700">
                                {editingQueue ? 'Simpan Perubahan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
