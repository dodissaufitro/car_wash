import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit2, ListOrdered, Minus, Plus, Receipt, Trash2, UserPlus, XCircle } from 'lucide-react';
import { useState } from 'react';

interface CustomerOption {
    id: number;
    nama: string;
}

interface VehicleOption {
    id: number;
    customer_id: number;
    label: string;
}

interface ServiceOption {
    id: number;
    nama_service: string;
    harga: number;
}

interface TransactionDetail {
    id: number;
    service_id: number;
    service: string;
    qty: number;
    harga: number;
    subtotal: number;
}

interface Transaction {
    id: number;
    customer: string;
    kendaraan: string;
    tanggal: string;
    total: number;
    status: string;
    details: TransactionDetail[];
}

interface Props {
    transactions: Transaction[];
    customers: CustomerOption[];
    vehicles: VehicleOption[];
    services: ServiceOption[];
}

type DetailRow = {
    service_id: string;
    qty: string;
    harga: string;
};

type FormData = {
    customer_id: string;
    vehicle_id: string;
    tanggal: string;
    status: string;
    details: DetailRow[];
    add_to_queue: boolean;
    new_customer: { nama: string; no_hp: string; alamat: string };
    new_vehicle: { jenis_kendaraan: string; merk: string; nomor_polisi: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi', href: '/transactions' },
];

const STATUS_COLORS: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Selesai: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Batal: 'bg-red-50 text-red-600 ring-1 ring-red-200',
};

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

const emptyDetail = (): DetailRow => ({ service_id: '', qty: '1', harga: '' });

const emptyNewCustomer = () => ({ nama: '', no_hp: '', alamat: '' });
const emptyNewVehicle  = () => ({ jenis_kendaraan: '', merk: '', nomor_polisi: '' });

export default function TransactionsIndex({ transactions, customers, vehicles, services }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        customer_id: '',
        vehicle_id: '',
        tanggal: '',
        status: 'Pending',
        details: [emptyDetail()],
        add_to_queue: true,
        new_customer: emptyNewCustomer(),
        new_vehicle: emptyNewVehicle(),
    });

    const isNewCustomer = data.customer_id === '__new__';
    const isNewVehicle  = data.vehicle_id  === '__new__';
    const filteredVehicles = vehicles.filter((v) => !data.customer_id || data.customer_id === '__new__' || String(v.customer_id) === data.customer_id);
    const totalCalc = data.details.reduce((sum, d) => sum + (parseFloat(d.harga) || 0) * (parseInt(d.qty) || 0), 0);

    function openCreate() {
        reset();
        clearErrors();
        setEditingTransaction(null);
        setData({
            customer_id: '',
            vehicle_id: '',
            tanggal: new Date().toISOString().split('T')[0],
            status: 'Pending',
            details: [emptyDetail()],
            add_to_queue: true,
            new_customer: emptyNewCustomer(),
            new_vehicle: emptyNewVehicle(),
        });
        setShowModal(true);
    }

    function openEdit(transaction: Transaction) {
        setEditingTransaction(transaction);
        const details: DetailRow[] =
            transaction.details.length > 0
                ? transaction.details.map((d) => ({ service_id: String(d.service_id), qty: String(d.qty), harga: String(d.harga) }))
                : [emptyDetail()];
        const customerOption = customers.find((c) => c.nama === transaction.customer);
        const vehicleOption = vehicles.find((v) => v.label === transaction.kendaraan);
        setData({
            customer_id: customerOption ? String(customerOption.id) : '',
            vehicle_id: vehicleOption ? String(vehicleOption.id) : '',
            tanggal: transaction.tanggal ? transaction.tanggal.split('T')[0] : '',
            status: transaction.status,
            details,
            add_to_queue: false,
            new_customer: emptyNewCustomer(),
            new_vehicle: emptyNewVehicle(),
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingTransaction) {
            put(route('transactions.update', editingTransaction.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('transactions.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(transaction: Transaction) {
        if (!confirm(`Hapus transaksi #${transaction.id}?`)) return;
        router.delete(route('transactions.destroy', transaction.id));
    }

    function addDetail() {
        setData('details', [...data.details, emptyDetail()]);
    }

    function removeDetail(index: number) {
        setData('details', data.details.filter((_, i) => i !== index));
    }

    function updateDetail(index: number, field: keyof DetailRow, value: string) {
        const updated = data.details.map((d, i) => {
            if (i !== index) return d;
            const row = { ...d, [field]: value };
            if (field === 'service_id') {
                const svc = services.find((s) => String(s.id) === value);
                if (svc) row.harga = String(svc.harga);
            }
            return row;
        });
        setData('details', updated);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />

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
                            <Receipt className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Transaksi</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola transaksi cuci kendaraan</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Transaksi Baru
                    </Button>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pelanggan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kendaraan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Total</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Receipt className="h-4 w-4 shrink-0 text-sky-600" />
                                            <span className="font-mono text-xs text-sky-600">#{transaction.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{transaction.customer ?? '-'}</td>
                                    <td className="text-muted-foreground px-4 py-3">{transaction.kendaraan ?? '-'}</td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {transaction.tanggal ? new Date(transaction.tanggal).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">{formatRupiah(transaction.total)}</td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[transaction.status] ?? ''}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(transaction)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(transaction)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Receipt className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada transaksi</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingTransaction ? `Edit Transaksi #${editingTransaction.id}` : 'Transaksi Baru'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Pelanggan */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Pelanggan</Label>
                            <Select
                                value={data.customer_id}
                                onValueChange={(v) => setData((prev) => ({ ...prev, customer_id: v, vehicle_id: '', new_customer: emptyNewCustomer(), new_vehicle: emptyNewVehicle() }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih pelanggan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.nama}</SelectItem>
                                    ))}
                                    <SelectItem value="__new__">
                                        <span className="flex items-center gap-2 text-sky-600">
                                            <UserPlus className="h-3.5 w-3.5" />
                                            Tambah pelanggan baru...
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.customer_id && <p className="text-xs text-red-500">{errors.customer_id}</p>}

                            {/* Form pelanggan baru */}
                            {isNewCustomer && (
                                <div className="mt-2 space-y-3 rounded-lg border border-sky-200 bg-sky-50/50 p-4">
                                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600">
                                        <UserPlus className="h-3 w-3" /> Data Pelanggan Baru
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">Nama <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={data.new_customer.nama}
                                                onChange={(e) => setData('new_customer', { ...data.new_customer, nama: e.target.value })}
                                                placeholder="Nama lengkap"
                                            />
                                            {(errors as any)['new_customer.nama'] && <p className="text-xs text-red-500">{(errors as any)['new_customer.nama']}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">No. HP</Label>
                                            <Input
                                                value={data.new_customer.no_hp}
                                                onChange={(e) => setData('new_customer', { ...data.new_customer, no_hp: e.target.value })}
                                                placeholder="08xxxxxxxxxx"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Alamat</Label>
                                            <Input
                                                value={data.new_customer.alamat}
                                                onChange={(e) => setData('new_customer', { ...data.new_customer, alamat: e.target.value })}
                                                placeholder="Alamat (opsional)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Kendaraan */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Kendaraan</Label>
                            <Select
                                value={data.vehicle_id}
                                onValueChange={(v) => setData((prev) => ({ ...prev, vehicle_id: v, new_vehicle: emptyNewVehicle() }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kendaraan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredVehicles.map((v) => (
                                        <SelectItem key={v.id} value={String(v.id)}>{v.label}</SelectItem>
                                    ))}
                                    <SelectItem value="__new__">
                                        <span className="flex items-center gap-2 text-sky-600">
                                            <Plus className="h-3.5 w-3.5" />
                                            Tambah kendaraan baru...
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.vehicle_id && <p className="text-xs text-red-500">{errors.vehicle_id}</p>}

                            {/* Form kendaraan baru */}
                            {isNewVehicle && (
                                <div className="mt-2 space-y-3 rounded-lg border border-sky-200 bg-sky-50/50 p-4">
                                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600">
                                        <Plus className="h-3 w-3" /> Data Kendaraan Baru
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Jenis <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={data.new_vehicle.jenis_kendaraan}
                                                onValueChange={(v) => setData('new_vehicle', { ...data.new_vehicle, jenis_kendaraan: v })}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Pilih jenis" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Motor">Motor</SelectItem>
                                                    <SelectItem value="Mobil">Mobil</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {(errors as any)['new_vehicle.jenis_kendaraan'] && <p className="text-xs text-red-500">{(errors as any)['new_vehicle.jenis_kendaraan']}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Merk</Label>
                                            <Input
                                                value={data.new_vehicle.merk}
                                                onChange={(e) => setData('new_vehicle', { ...data.new_vehicle, merk: e.target.value })}
                                                placeholder="Honda, Toyota, dll."
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">No. Polisi <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={data.new_vehicle.nomor_polisi}
                                                onChange={(e) => setData('new_vehicle', { ...data.new_vehicle, nomor_polisi: e.target.value })}
                                                placeholder="B 1234 ABC"
                                                className="font-mono"
                                            />
                                            {(errors as any)['new_vehicle.nomor_polisi'] && <p className="text-xs text-red-500">{(errors as any)['new_vehicle.nomor_polisi']}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tanggal & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Tanggal</Label>
                                <Input type="date" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} />
                                {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Selesai">Selesai</SelectItem>
                                        <SelectItem value="Batal">Batal</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                            </div>
                        </div>

                        {/* Detail Layanan */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Detail Layanan</Label>
                                <Button type="button" size="sm" variant="outline" onClick={addDetail}>
                                    <Plus className="mr-1 h-3 w-3" />
                                    Tambah Baris
                                </Button>
                            </div>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Layanan</th>
                                            <th className="w-20 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
                                            <th className="w-28 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Harga</th>
                                            <th className="w-28 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Subtotal</th>
                                            <th className="w-10 px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {data.details.map((detail, index) => {
                                            const subtotal = (parseFloat(detail.harga) || 0) * (parseInt(detail.qty) || 0);
                                            return (
                                                <tr key={index}>
                                                    <td className="px-3 py-2">
                                                        <Select value={detail.service_id} onValueChange={(v) => updateDetail(index, 'service_id', v)}>
                                                            <SelectTrigger className="h-8"><SelectValue placeholder="Pilih layanan" /></SelectTrigger>
                                                            <SelectContent>
                                                                {services.map((s) => (
                                                                    <SelectItem key={s.id} value={String(s.id)}>{s.nama_service}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <Input type="number" min="1" value={detail.qty} onChange={(e) => updateDetail(index, 'qty', e.target.value)} className="h-8 text-center" />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <Input type="number" min="0" value={detail.harga} onChange={(e) => updateDetail(index, 'harga', e.target.value)} className="h-8 text-right" />
                                                    </td>
                                                    <td className="px-3 py-2 text-right text-xs font-medium">{formatRupiah(subtotal)}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        {data.details.length > 1 && (
                                                            <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={() => removeDetail(index)}>
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t bg-sky-50/60">
                                            <td colSpan={3} className="px-3 py-2.5 text-right text-sm font-semibold text-slate-600">Total</td>
                                            <td className="px-3 py-2.5 text-right text-sm font-bold text-sky-700">{formatRupiah(totalCalc)}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            {(errors as any)['details'] && <p className="text-xs text-red-500">{(errors as any)['details']}</p>}
                        </div>

                        {/* Tambah ke antrian (hanya saat buat baru) */}
                        {!editingTransaction && (
                            <div className="flex items-center gap-3 rounded-lg border border-sky-200 bg-sky-50/60 px-4 py-3">
                                <Checkbox
                                    id="add_to_queue"
                                    checked={data.add_to_queue}
                                    onCheckedChange={(v) => setData('add_to_queue', Boolean(v))}
                                />
                                <div>
                                    <Label htmlFor="add_to_queue" className="cursor-pointer text-sm font-medium text-slate-700">
                                        <span className="flex items-center gap-1.5">
                                            <ListOrdered className="h-4 w-4 text-sky-600" />
                                            Tambahkan ke antrian otomatis
                                        </span>
                                    </Label>
                                    <p className="mt-0.5 text-xs text-slate-400">Transaksi akan langsung masuk antrian dengan status Menunggu</p>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-sky-600 hover:bg-sky-700">
                                {editingTransaction ? 'Simpan Perubahan' : 'Buat Transaksi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
