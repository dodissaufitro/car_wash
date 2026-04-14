import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit2, Plus, Trash2, Users, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    nama: string;
    no_hp: string | null;
    alamat: string | null;
    vehicles_count: number;
    transactions_count: number;
}

interface Props {
    customers: Customer[];
}

type FormData = {
    nama: string;
    no_hp: string;
    alamat: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pelanggan', href: '/customers' },
];

export default function CustomersIndex({ customers }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        nama: '',
        no_hp: '',
        alamat: '',
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditingCustomer(null);
        setShowModal(true);
    }

    function openEdit(customer: Customer) {
        setEditingCustomer(customer);
        setData({
            nama: customer.nama,
            no_hp: customer.no_hp ?? '',
            alamat: customer.alamat ?? '',
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingCustomer) {
            put(route('customers.update', editingCustomer.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('customers.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(customer: Customer) {
        if (!confirm(`Hapus pelanggan "${customer.nama}"?`)) return;
        router.delete(route('customers.destroy', customer.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pelanggan" />

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
                            <Users className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Pelanggan</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola data pelanggan</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Pelanggan
                    </Button>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">No. HP</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Alamat</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Kendaraan</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Transaksi</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 shrink-0 text-sky-600" />
                                            <span className="font-medium">{customer.nama}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">{customer.no_hp ?? '-'}</td>
                                    <td className="text-muted-foreground max-w-xs truncate px-4 py-3">{customer.alamat ?? '-'}</td>
                                    <td className="px-4 py-3 text-center">{customer.vehicles_count}</td>
                                    <td className="px-4 py-3 text-center">{customer.transactions_count}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(customer)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(customer)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Users className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada data pelanggan</p>
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
                        <DialogTitle>{editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="nama">Nama Pelanggan</Label>
                            <Input id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} placeholder="Nama lengkap" />
                            {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="no_hp">No. HP</Label>
                            <Input id="no_hp" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} placeholder="08xxxxxxxxxx" />
                            {errors.no_hp && <p className="text-xs text-red-500">{errors.no_hp}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} placeholder="Alamat lengkap" />
                            {errors.alamat && <p className="text-xs text-red-500">{errors.alamat}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-sky-600 hover:bg-sky-700">
                                {editingCustomer ? 'Simpan Perubahan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
