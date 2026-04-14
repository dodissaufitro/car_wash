import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit2, Plus, Trash2, Wrench, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Service {
    id: number;
    nama_service: string;
    harga: number;
    deskripsi: string | null;
}

interface Props {
    services: Service[];
}

type FormData = {
    nama_service: string;
    harga: string;
    deskripsi: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Layanan', href: '/services' },
];

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export default function ServicesIndex({ services }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        nama_service: '',
        harga: '',
        deskripsi: '',
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditingService(null);
        setShowModal(true);
    }

    function openEdit(service: Service) {
        setEditingService(service);
        setData({
            nama_service: service.nama_service,
            harga: String(service.harga),
            deskripsi: service.deskripsi ?? '',
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingService) {
            put(route('services.update', editingService.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('services.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(service: Service) {
        if (!confirm(`Hapus layanan "${service.nama_service}"?`)) return;
        router.delete(route('services.destroy', service.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layanan" />

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
                            <Wrench className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Layanan</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola daftar layanan dan harga</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Layanan
                    </Button>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Layanan</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Harga</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Deskripsi</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Wrench className="h-4 w-4 shrink-0 text-sky-600" />
                                            <span className="font-medium">{service.nama_service}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 text-sky-700">{formatRupiah(service.harga)}</td>
                                    <td className="text-muted-foreground px-4 py-3">{service.deskripsi ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(service)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(service)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Wrench className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada data layanan</p>
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
                        <DialogTitle>{editingService ? 'Edit Layanan' : 'Tambah Layanan'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="nama_service">Nama Layanan</Label>
                            <Input
                                id="nama_service"
                                value={data.nama_service}
                                onChange={(e) => setData('nama_service', e.target.value)}
                                placeholder="Cuci Motor, Poles Mobil, dll."
                            />
                            {errors.nama_service && <p className="text-xs text-red-500">{errors.nama_service}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="harga">Harga (Rp)</Label>
                            <Input
                                id="harga"
                                type="number"
                                min="0"
                                value={data.harga}
                                onChange={(e) => setData('harga', e.target.value)}
                                placeholder="25000"
                            />
                            {errors.harga && <p className="text-xs text-red-500">{errors.harga}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Input
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                placeholder="Keterangan layanan (opsional)"
                            />
                            {errors.deskripsi && <p className="text-xs text-red-500">{errors.deskripsi}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-sky-600 hover:bg-sky-700">
                                {editingService ? 'Simpan Perubahan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
