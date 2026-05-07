import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Car,
    ChevronLeft,
    Clock,
    Droplets,
    GlassWater,
    MapPin,
    Minus,
    MoreHorizontal,
    Plus,
    ShoppingCart,
    Sparkles,
    Star,
    Utensils,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ServiceItem {
    id: number;
    nama_service: string;
    harga: number;
    deskripsi: string | null;
    emoji: string | null;
    image: string | null;
}

interface Category {
    id: number;
    nama: string;
    ikon: string;
    services: ServiceItem[];
}

interface CustomerOption {
    id: number;
    nama: string;
}

interface VehicleOption {
    id: number;
    customer_id: number;
    label: string;
}

interface ExistingDetail {
    service_id: number;
    nama_service: string | null;
    harga: number;
    qty: number;
}

interface Props {
    payment: { id: number; metode: string; jumlah_bayar: number };
    transaction: {
        id: number;
        customer_id: number;
        vehicle_id: number | null;
        tanggal: string;
        details: ExistingDetail[];
    };
    queue: { id: number; bay_number: number; status: string } | null;
    categories: Category[];
    customers: CustomerOption[];
    vehicles: VehicleOption[];
    occupiedBays: number[];
}

interface CartItem {
    service_id: number;
    nama_service: string;
    harga: number;
    qty: number;
}

type FormData = {
    customer_id: string;
    vehicle_id: string;
    tanggal: string;
    metode: string;
    jumlah_bayar: string;
    bay_number: string;
    queue_status: string;
    details: { service_id: string; qty: string; harga: string }[];
};

const ICON_MAP: Record<string, React.ElementType> = {
    Droplets,
    Sparkles,
    Star,
    MoreHorizontal,
    GlassWater,
    Utensils,
};

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export default function PenjualanEdit({ payment, transaction, queue, categories, customers, vehicles, occupiedBays }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Penjualan', href: '/penjualan' },
        { title: `Edit #${payment.id}`, href: `/penjualan/${payment.id}/edit` },
    ];

    const [activeCategory, setActiveCategory] = useState<number | null>(categories[0]?.id ?? null);

    const initialCart: CartItem[] = transaction.details.map((d) => ({
        service_id: d.service_id,
        nama_service: d.nama_service ?? `Layanan #${d.service_id}`,
        harga: d.harga,
        qty: d.qty,
    }));

    const [cart, setCart] = useState<CartItem[]>(initialCart);

    const form = useForm<FormData>({
        customer_id: String(transaction.customer_id),
        vehicle_id: transaction.vehicle_id ? String(transaction.vehicle_id) : '__none__',
        tanggal: transaction.tanggal,
        metode: payment.metode,
        jumlah_bayar: String(payment.jumlah_bayar),
        bay_number: queue ? String(queue.bay_number) : '',
        queue_status: queue?.status ?? 'Menunggu',
        details: [],
    });

    const { data, setData, processing, errors } = form;

    const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
    const kembalian = Math.max(0, parseFloat(data.jumlah_bayar || '0') - total);

    useEffect(() => {
        setData('jumlah_bayar', total > 0 ? String(total) : '');
    }, [total]);

    const filteredVehicles = vehicles.filter((v) => !data.customer_id || v.customer_id === parseInt(data.customer_id));
    const activeServices = categories.find((c) => c.id === activeCategory)?.services ?? [];

    function addToCart(service: ServiceItem) {
        setCart((prev) => {
            const existing = prev.find((i) => i.service_id === service.id);
            if (existing) {
                return prev.map((i) => (i.service_id === service.id ? { ...i, qty: i.qty + 1 } : i));
            }
            return [...prev, { service_id: service.id, nama_service: service.nama_service, harga: service.harga, qty: 1 }];
        });
    }

    function updateQty(serviceId: number, delta: number) {
        setCart((prev) =>
            prev
                .map((i) => (i.service_id === serviceId ? { ...i, qty: i.qty + delta } : i))
                .filter((i) => i.qty > 0),
        );
    }

    function removeFromCart(serviceId: number) {
        setCart((prev) => prev.filter((i) => i.service_id !== serviceId));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.transform((d) => ({
            ...d,
            vehicle_id: d.vehicle_id === '__none__' ? '' : d.vehicle_id,
            details: cart.map((item) => ({
                service_id: String(item.service_id),
                qty: String(item.qty),
                harga: String(item.harga),
            })),
        }));

        form.put(route('penjualan.update', payment.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Penjualan #${payment.id}`} />

            <div className="flex h-[calc(100vh-4rem)] flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link href="/penjualan" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
                            <ChevronLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                        <span className="text-gray-300">|</span>
                        <h1 className="text-sm font-semibold text-gray-800">Edit Penjualan #{payment.id}</h1>
                    </div>
                    <span className="text-xs text-gray-400">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                {/* Main area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* ─── LEFT: Menu / Services ─── */}
                    <div className="flex flex-1 flex-col overflow-hidden border-r border-gray-100 bg-gray-50">
                        {/* Category tabs */}
                        <div className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-gray-50 px-4 py-3">
                            {categories.map((cat) => {
                                const Icon = ICON_MAP[cat.ikon] ?? MoreHorizontal;
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                                            isActive
                                                ? 'border-sky-500 bg-sky-600 text-white shadow-md shadow-sky-200'
                                                : 'border-gray-300 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {cat.nama}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Service grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {activeServices.map((service) => {
                                    const inCart = cart.find((i) => i.service_id === service.id);
                                    return (
                                        <button
                                            key={service.id}
                                            onClick={() => addToCart(service)}
                                            className={`group relative flex flex-col items-start overflow-hidden rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${
                                                inCart
                                                    ? 'border-sky-500 bg-gradient-to-br from-sky-50 to-blue-50 shadow-md shadow-sky-200'
                                                    : 'border-slate-300 bg-white shadow-sm hover:border-sky-400 hover:shadow-sky-100'
                                            }`}
                                        >
                                            <span className={`absolute inset-x-0 top-0 h-1 rounded-t-xl transition-colors duration-200 ${inCart ? 'bg-sky-500' : 'bg-slate-300 group-hover:bg-sky-400'}`} />
                                            {inCart && (
                                                <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[11px] font-bold text-white shadow">
                                                    {inCart.qty}
                                                </span>
                                            )}
                                            <div
                                                className={`relative w-full overflow-hidden ${service.image ? '' : 'flex items-center justify-center bg-gray-100'}`}
                                                style={{ aspectRatio: '4/3' }}
                                            >
                                                {service.image ? (
                                                    <img src={`/menu/${service.image}`} alt={service.nama_service} className="h-full w-full object-cover" />
                                                ) : service.emoji ? (
                                                    <span className="text-3xl">{service.emoji}</span>
                                                ) : (
                                                    <ShoppingCart className={`h-6 w-6 ${inCart ? 'text-sky-700' : 'text-sky-400 group-hover:text-sky-600'}`} />
                                                )}
                                            </div>
                                            <div className="w-full px-3 pb-3 pt-2">
                                                <p className="text-sm font-semibold leading-tight text-gray-800">{service.nama_service}</p>
                                                {service.deskripsi && <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{service.deskripsi}</p>}
                                                <p className={`mt-1.5 text-sm font-bold ${inCart ? 'text-sky-700' : 'text-sky-600'}`}>{formatRupiah(service.harga)}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                                {activeServices.length === 0 && (
                                    <p className="col-span-4 py-12 text-center text-sm text-gray-400">Tidak ada layanan dalam kategori ini.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ─── RIGHT: Cart + Form ─── */}
                    <form onSubmit={handleSubmit} className="flex w-96 shrink-0 flex-col overflow-hidden bg-white">
                        <div className="flex-1 overflow-y-auto px-4 pt-2">
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Pesanan {cart.length > 0 && `(${cart.length})`}
                            </p>

                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-300">
                                    <ShoppingCart className="h-10 w-10" />
                                    <p className="text-sm">Pilih layanan di sebelah kiri</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {cart.map((item) => (
                                        <div key={item.service_id} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-800">{item.nama_service}</p>
                                                <p className="text-xs text-gray-500">{formatRupiah(item.harga)}/item</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.service_id, -1)}
                                                    className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.service_id, 1)}
                                                    className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <p className="w-20 text-right text-sm font-semibold text-sky-700">{formatRupiah(item.harga * item.qty)}</p>
                                            <button type="button" onClick={() => removeFromCart(item.service_id)} className="ml-1 text-gray-300 hover:text-red-400">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Detail Pelanggan */}
                            <div className="mt-2 space-y-1.5 border-t border-gray-100 pt-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Detail Pelanggan</p>

                                <div>
                                    <Label className="text-sm">Pelanggan</Label>
                                    <Select
                                        value={data.customer_id}
                                        onValueChange={(v) => { setData('customer_id', v); setData('vehicle_id', ''); }}
                                    >
                                        <SelectTrigger className="mt-1 text-sm">
                                            <SelectValue placeholder="Pilih pelanggan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>{c.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.customer_id && <p className="mt-1 text-xs text-red-500">{errors.customer_id}</p>}
                                </div>

                                <div>
                                    <Label className="text-sm">Kendaraan <span className="text-gray-400 font-normal">(opsional)</span></Label>
                                    <Select
                                        value={data.vehicle_id}
                                        onValueChange={(v) => setData('vehicle_id', v)}
                                        disabled={!data.customer_id}
                                    >
                                        <SelectTrigger className="mt-1 text-sm">
                                            <SelectValue placeholder={data.customer_id ? 'Pilih kendaraan' : 'Pilih pelanggan dulu'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="__none__"><span className="text-gray-400">— Tanpa kendaraan —</span></SelectItem>
                                            {filteredVehicles.map((v) => (
                                                <SelectItem key={v.id} value={String(v.id)}>{v.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vehicle_id && <p className="mt-1 text-xs text-red-500">{errors.vehicle_id}</p>}
                                </div>

                                <div>
                                    <Label className="text-sm">Tanggal</Label>
                                    <Input
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) => setData('tanggal', e.target.value)}
                                        className="mt-1 text-sm"
                                    />
                                    {errors.tanggal && <p className="mt-1 text-xs text-red-500">{errors.tanggal}</p>}
                                </div>
                            </div>

                            {/* Bay / Denah Meja */}
                            <div className="mt-2 space-y-2 border-t border-gray-100 pt-2">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pilih Bay</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3, 4, 5, 6].map((bay) => {
                                        const isOccupied = occupiedBays.includes(bay);
                                        const isSelected = data.bay_number === String(bay);
                                        return (
                                            <button
                                                key={bay}
                                                type="button"
                                                disabled={isOccupied}
                                                onClick={() => setData('bay_number', isSelected ? '' : String(bay))}
                                                className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-2.5 text-xs font-semibold transition-all duration-150 ${
                                                    isOccupied
                                                        ? 'cursor-not-allowed border-red-200 bg-red-50 text-red-400'
                                                        : isSelected
                                                          ? 'border-sky-500 bg-sky-600 text-white shadow-md shadow-sky-200'
                                                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                                                }`}
                                            >
                                                <Car className="h-4 w-4" />
                                                Bay {bay}
                                                <span className={`text-[10px] font-normal ${isOccupied ? 'text-red-400' : isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                                                    {isOccupied ? 'Terisi' : isSelected ? 'Dipilih' : 'Kosong'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.bay_number && <p className="text-xs text-red-500">{errors.bay_number}</p>}

                                <div>
                                    <Label className="text-sm">Status Antrian</Label>
                                    <Select value={data.queue_status} onValueChange={(v) => setData('queue_status', v)}>
                                        <SelectTrigger className="mt-1 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Menunggu">
                                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-amber-500" /> Menunggu</span>
                                            </SelectItem>
                                            <SelectItem value="Diproses">
                                                <span className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5 text-sky-500" /> Diproses</span>
                                            </SelectItem>
                                            <SelectItem value="Selesai">
                                                <span className="flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-emerald-500" /> Selesai</span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.queue_status && <p className="mt-1 text-xs text-red-500">{errors.queue_status}</p>}
                                </div>
                            </div>

                            {/* Pembayaran */}
                            <div className="mt-2 space-y-1.5 border-t border-gray-100 pt-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Pembayaran <span className="font-normal text-gray-400 normal-case">(opsional)</span>
                                </p>

                                <Select value={data.metode} onValueChange={(v) => setData('metode', v)}>
                                    <SelectTrigger className="text-sm">
                                        <SelectValue placeholder="Pilih metode pembayaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Transfer">Transfer</SelectItem>
                                        <SelectItem value="QRIS">QRIS</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.metode && <p className="text-xs text-red-500">{errors.metode}</p>}

                                <Input
                                    type="number"
                                    placeholder="Jumlah bayar"
                                    value={data.jumlah_bayar}
                                    onChange={(e) => setData('jumlah_bayar', e.target.value)}
                                    className="text-sm"
                                    min={0}
                                />
                                {errors.jumlah_bayar && <p className="text-xs text-red-500">{errors.jumlah_bayar}</p>}

                                {parseFloat(data.jumlah_bayar) > 0 && (
                                    <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm">
                                        <span className="text-emerald-700">Kembalian</span>
                                        <span className="font-semibold text-emerald-700">{formatRupiah(kembalian)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Total + Submit */}
                        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
                            <div className="mb-1.5 flex items-center justify-between">
                                <span className="text-sm text-gray-600">Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} item)</span>
                                <span className="text-xl font-bold text-gray-900">{formatRupiah(total)}</span>
                            </div>
                            {errors.details && <p className="mb-2 text-xs text-red-500">{errors.details as string}</p>}
                            <Button type="submit" disabled={processing || cart.length === 0} className="w-full bg-sky-600 hover:bg-sky-700">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
