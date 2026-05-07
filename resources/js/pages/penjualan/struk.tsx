import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Car, CheckCircle2, Clock, Droplets, Printer, Sparkles } from 'lucide-react';

interface StrukItem {
    nama_service: string | null;
    qty: number;
    harga: number;
    subtotal: number;
}

interface Struk {
    payment_id: number;
    tanggal: string;
    customer: string | null;
    no_hp: string | null;
    kendaraan: string | null;
    jenis_kendaraan: string | null;
    bay_number: number | null;
    items: StrukItem[];
    total: number;
    metode: string | null;
    jumlah_bayar: number | null;
    kembalian: number | null;
}

interface Props {
    struk: Struk;
}

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function formatTanggal(value: string) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

const METODE_ICON: Record<string, React.ElementType> = {
    Cash: Sparkles,
    Transfer: Droplets,
    QRIS: Clock,
};

export default function StrukPage({ struk }: Props) {
    function handlePrint() {
        window.print();
    }

    return (
        <>
            <Head title={`Struk #${struk.payment_id}`} />

            {/* ── Toolbar (hidden on print) ── */}
            <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                <Link
                    href={route('penjualan.index')}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Penjualan
                </Link>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:shadow-sky-300 hover:brightness-105 active:scale-95"
                >
                    <Printer className="h-4 w-4" />
                    Cetak Struk
                </button>
            </div>

            {/* ── Screen preview ── */}
            <div className="no-print flex min-h-[calc(100vh-56px)] items-start justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100 px-4 py-10">
                <div className="w-full max-w-sm">
                    {/* Action hints */}
                    <p className="mb-4 text-center text-xs text-slate-400">
                        Klik <span className="font-semibold text-sky-600">Cetak Struk</span> untuk mencetak atau simpan sebagai PDF
                    </p>
                    <Receipt struk={struk} />
                </div>
            </div>

            {/* ── Print-only ── */}
            <div className="print-only">
                <Receipt struk={struk} />
            </div>

            <style>{`
                @media print {
                    .no-print  { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; margin: 0; padding: 0; }
                    @page { margin: 8mm; size: 80mm auto; }
                }
                @media screen {
                    .print-only { display: none; }
                }
            `}</style>
        </>
    );
}

function Receipt({ struk }: { struk: Struk }) {
    const isLunas = struk.metode != null && struk.jumlah_bayar != null;
    const MetodeIcon = struk.metode ? (METODE_ICON[struk.metode] ?? Sparkles) : null;

    return (
        <div className="receipt-paper w-full overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-300/60">

            {/* ── Header gradient ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 px-6 py-6 text-center text-white">
                {/* Decorative circles */}
                <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/10" />

                <div className="relative flex items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <Car className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-lg font-bold tracking-wide leading-tight">CAR WASH</p>
                        <p className="text-[11px] text-sky-200 leading-tight">Struk Pembayaran</p>
                    </div>
                </div>

                {struk.bay_number && (
                    <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        Bay {struk.bay_number}
                    </div>
                )}

                {isLunas && (
                    <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-bold text-white shadow">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        LUNAS
                    </div>
                )}
                {!isLunas && (
                    <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold text-white shadow">
                        <Clock className="h-3.5 w-3.5" />
                        BELUM LUNAS
                    </div>
                )}
            </div>

            {/* ── Torn edge effect ── */}
            <div className="flex h-4 items-center overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600">
                <svg viewBox="0 0 400 16" className="w-full" preserveAspectRatio="none">
                    <path d="M0,0 Q10,16 20,8 Q30,0 40,8 Q50,16 60,8 Q70,0 80,8 Q90,16 100,8 Q110,0 120,8 Q130,16 140,8 Q150,0 160,8 Q170,16 180,8 Q190,0 200,8 Q210,16 220,8 Q230,0 240,8 Q250,16 260,8 Q270,0 280,8 Q290,16 300,8 Q310,0 320,8 Q330,16 340,8 Q350,0 360,8 Q370,16 380,8 Q390,0 400,8 L400,16 L0,16 Z" fill="white"/>
                </svg>
            </div>

            {/* ── Body ── */}
            <div className="px-5 pb-2 pt-1 text-sm text-gray-800" style={{ fontFamily: "'Courier New', Courier, monospace" }}>

                {/* Info transaksi */}
                <div className="space-y-1.5 py-3">
                    <InfoRow label="No. Struk" value={`#${String(struk.payment_id).padStart(4, '0')}`} highlight />
                    <InfoRow label="Tanggal" value={formatTanggal(struk.tanggal)} />
                    {struk.customer && <InfoRow label="Pelanggan" value={struk.customer} />}
                    {struk.no_hp && <InfoRow label="No. HP" value={struk.no_hp} />}
                    {struk.kendaraan && (
                        <InfoRow
                            label="Kendaraan"
                            value={[struk.jenis_kendaraan, struk.kendaraan].filter(Boolean).join(' · ')}
                        />
                    )}
                </div>

                {/* Separator */}
                <Divider />

                {/* Items */}
                <div className="py-3">
                    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Detail Layanan
                    </p>
                    <div className="space-y-2.5">
                        {struk.items.map((item, i) => (
                            <div key={i} className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold leading-snug text-gray-800">{item.nama_service ?? '-'}</p>
                                    <p className="text-[11px] text-gray-400">
                                        {item.qty} × {formatRupiah(item.harga)}
                                    </p>
                                </div>
                                <p className="shrink-0 text-xs font-bold text-gray-800">{formatRupiah(item.subtotal)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Separator */}
                <Divider />

                {/* Total */}
                <div className="py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Total</span>
                        <span className="text-base font-extrabold text-gray-900">{formatRupiah(struk.total)}</span>
                    </div>
                </div>

                {/* Pembayaran */}
                {isLunas && (
                    <>
                        <Divider />
                        <div className="space-y-1.5 py-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Metode</span>
                                <span className="flex items-center gap-1 text-xs font-semibold text-gray-800">
                                    {MetodeIcon && <MetodeIcon className="h-3 w-3 text-sky-500" />}
                                    {struk.metode}
                                </span>
                            </div>
                            <InfoRow label="Dibayar" value={formatRupiah(struk.jumlah_bayar!)} />
                            {struk.kembalian != null && struk.kembalian > 0 && (
                                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-2.5 py-1.5">
                                    <span className="text-xs font-semibold text-emerald-700">Kembalian</span>
                                    <span className="text-xs font-bold text-emerald-700">{formatRupiah(struk.kembalian)}</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* ── Torn edge bottom ── */}
            <div className="flex h-4 items-center overflow-hidden bg-slate-50">
                <svg viewBox="0 0 400 16" className="w-full" preserveAspectRatio="none">
                    <path d="M0,16 Q10,0 20,8 Q30,16 40,8 Q50,0 60,8 Q70,16 80,8 Q90,0 100,8 Q110,16 120,8 Q130,0 140,8 Q150,16 160,8 Q170,0 180,8 Q190,16 200,8 Q210,0 220,8 Q230,16 240,8 Q250,0 260,8 Q270,16 280,8 Q290,0 300,8 Q310,16 320,8 Q330,0 340,8 Q350,16 360,8 Q370,0 380,8 Q390,16 400,8 L400,0 L0,0 Z" fill="white"/>
                </svg>
            </div>

            {/* ── Footer ── */}
            <div className="rounded-b-2xl bg-slate-50 px-5 py-4 text-center">
                <div className="mb-3 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-0.5 w-5 rounded-full bg-slate-200" />
                    ))}
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-0.5 w-5 rounded-full bg-slate-200" />
                    ))}
                </div>
                <p className="text-xs font-medium text-gray-500">Terima kasih atas kunjungan Anda!</p>
                <p className="mt-0.5 text-[11px] text-gray-400">Semoga kendaraan Anda bersih & nyaman 🚗✨</p>
            </div>
        </div>
    );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex items-baseline justify-between gap-3">
            <span className="shrink-0 text-[11px] text-gray-400">{label}</span>
            <span className={`text-right text-[11px] ${highlight ? 'font-bold text-sky-700' : 'font-medium text-gray-700'}`}>
                {value}
            </span>
        </div>
    );
}

function Divider() {
    return (
        <div className="flex items-center gap-0.5 py-0.5">
            {[...Array(40)].map((_, i) => (
                <div key={i} className="h-px flex-1 bg-dashed bg-gray-200" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 4px, transparent 4px, transparent 8px)' }} />
            ))}
        </div>
    );
}
