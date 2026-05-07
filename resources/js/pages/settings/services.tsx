import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit2, ImagePlus, Plus, Trash2, Wrench, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';

interface Category {
    id: number;
    nama: string;
}

interface Service {
    id: number;
    nama_service: string;
    harga: number;
    deskripsi: string | null;
    category_id: number | null;
    category_nama: string | null;
    image: string | null;
}

interface Props {
    services: Service[];
    categories: Category[];
}

type FormData = {
    nama_service: string;
    harga: string;
    deskripsi: string;
    category_id: string;
    image: File | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan', href: '/settings/profile' },
    { title: 'Layanan', href: '/settings/services' },
];

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export default function SettingsServices({ services, categories }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        nama_service: '',
        harga: '',
        deskripsi: '',
        category_id: '',
        image: null,
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
            category_id: service.category_id ? String(service.category_id) : '',
            image: null,
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingService) {
            put(route('services.update', editingService.id), {
                forceFormData: true,
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('services.store'), {
                forceFormData: true,
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(service: Service) {
        if (!confirm(`Hapus layanan "${service.nama_service}"?`)) return;
        router.delete(route('services.destroy', service.id));
    }

    const previewUrl = data.image
        ? URL.createObjectURL(data.image)
        : editingService?.image
          ? `/menu/${editingService.image}`
          : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Layanan" />

            <SettingsLayout>
                <div className="space-y-4">
                    {flash?.success && (
                        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            <span>{flash.error}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
                                <Wrench className="h-5 w-5 text-sky-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-800">Layanan</h1>
                                <p className="mt-0.5 text-sm text-slate-500">Kelola layanan dan harga yang tersedia di POS</p>
                            </div>
                        </div>
                        <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Layanan
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Gambar
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Nama Layanan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Kategori
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Harga
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Deskripsi
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {services.map((service) => (
                                    <tr key={service.id} className="transition-colors hover:bg-sky-50/40">
                                        <td className="px-4 py-3">
                                            {service.image ? (
                                                <img
                                                    src={`/menu/${service.image}`}
                                                    alt={service.nama_service}
                                                    className="h-12 w-16 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100">
                                                    <ImagePlus className="h-5 w-5 text-slate-300" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Wrench className="h-4 w-4 shrink-0 text-sky-600" />
                                                <span className="font-medium">{service.nama_service}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {service.category_nama ? (
                                                <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-sky-200">
                                                    {service.category_nama}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-sky-700">{formatRupiah(service.harga)}</td>
                                        <td className="text-muted-foreground px-4 py-3">{service.deskripsi ?? '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
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
                                        <td colSpan={6} className="py-12 text-center">
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
            </SettingsLayout>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingService ? 'Edit Layanan' : 'Tambah Layanan'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image upload */}
                        <div className="space-y-1">
                            <Label>Gambar</Label>
                            <div
                                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-colors hover:border-sky-400 hover:bg-sky-50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="preview" className="h-32 w-full rounded-lg object-contain" />
                                ) : (
                                    <>
                                        <ImagePlus className="h-8 w-8 text-slate-300" />
                                        <p className="text-xs text-slate-400">Klik untuk pilih gambar</p>
                                    </>
                                )}
                                {previewUrl && (
                                    <p className="text-xs text-slate-400">
                                        {data.image ? data.image.name : 'Gambar saat ini — klik untuk ganti'}
                                    </p>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                            />
                            {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                        </div>
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
                            <Label htmlFor="category_id">Kategori</Label>
                            <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                                <SelectTrigger id="category_id">
                                    <SelectValue placeholder="Pilih kategori..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-xs text-red-500">{errors.category_id}</p>}
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
