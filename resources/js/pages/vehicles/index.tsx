import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Car, CheckCircle2, Edit2, Plus, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface CustomerOption {
    id: number;
    nama: string;
}

interface Vehicle {
    id: number;
    customer_id: number;
    jenis_kendaraan: string;
    merk: string | null;
    nomor_polisi: string;
    customer: { id: number; nama: string } | null;
}

interface Props {
    vehicles: Vehicle[];
    customers: CustomerOption[];
}

type FormData = {
    customer_id: string;
    jenis_kendaraan: string;
    merk: string;
    nomor_polisi: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kendaraan', href: '/vehicles' },
];

export default function VehiclesIndex({ vehicles, customers }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        customer_id: '',
        jenis_kendaraan: '',
        merk: '',
        nomor_polisi: '',
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditingVehicle(null);
        setShowModal(true);
    }

    function openEdit(vehicle: Vehicle) {
        setEditingVehicle(vehicle);
        setData({
            customer_id: String(vehicle.customer_id),
            jenis_kendaraan: vehicle.jenis_kendaraan,
            merk: vehicle.merk ?? '',
            nomor_polisi: vehicle.nomor_polisi,
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingVehicle) {
            put(route('vehicles.update', editingVehicle.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('vehicles.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(vehicle: Vehicle) {
        if (!confirm(`Hapus kendaraan "${vehicle.nomor_polisi}"?`)) return;
        router.delete(route('vehicles.destroy', vehicle.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kendaraan" />

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
                            <Car className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Kendaraan</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola data kendaraan pelanggan</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kendaraan
                    </Button>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kendaraan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pelanggan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Jenis</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">No. Polisi</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Car className="h-4 w-4 shrink-0 text-sky-600" />
                                            <span className="font-medium">{vehicle.merk ?? '-'}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">{vehicle.customer?.nama ?? '-'}</td>
                                    <td className="px-4 py-3">{vehicle.jenis_kendaraan}</td>
                                    <td className="px-4 py-3 font-mono">{vehicle.nomor_polisi}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(vehicle)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(vehicle)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vehicles.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Car className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada data kendaraan</p>
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
                        <DialogTitle>{editingVehicle ? 'Edit Kendaraan' : 'Tambah Kendaraan'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="customer_id">Pelanggan</Label>
                            <Select value={data.customer_id} onValueChange={(v) => setData('customer_id', v)}>
                                <SelectTrigger id="customer_id">
                                    <SelectValue placeholder="Pilih pelanggan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.customer_id && <p className="text-xs text-red-500">{errors.customer_id}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
                            <Select value={data.jenis_kendaraan} onValueChange={(v) => setData('jenis_kendaraan', v)}>
                                <SelectTrigger id="jenis_kendaraan">
                                    <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Motor">Motor</SelectItem>
                                    <SelectItem value="Mobil">Mobil</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.jenis_kendaraan && <p className="text-xs text-red-500">{errors.jenis_kendaraan}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="merk">Merk</Label>
                            <Input id="merk" value={data.merk} onChange={(e) => setData('merk', e.target.value)} placeholder="Honda, Toyota, dll." />
                            {errors.merk && <p className="text-xs text-red-500">{errors.merk}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="nomor_polisi">No. Polisi</Label>
                            <Input
                                id="nomor_polisi"
                                value={data.nomor_polisi}
                                onChange={(e) => setData('nomor_polisi', e.target.value)}
                                placeholder="B 1234 ABC"
                                className="font-mono"
                            />
                            {errors.nomor_polisi && <p className="text-xs text-red-500">{errors.nomor_polisi}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-sky-600 hover:bg-sky-700">
                                {editingVehicle ? 'Simpan Perubahan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
