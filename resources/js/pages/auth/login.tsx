import { Head, useForm } from '@inertiajs/react';
import { Car, CheckCircle2, ClipboardList, Droplets, LoaderCircle, TrendingUp } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const features = [
    { icon: Droplets, title: 'Manajemen Antrian', desc: 'Pantau antrian pencucian secara real-time' },
    { icon: TrendingUp, title: 'Laporan Pendapatan', desc: 'Analisis pendapatan harian & bulanan' },
    { icon: ClipboardList, title: 'Histori Lengkap', desc: 'Data kendaraan & riwayat layanan pelanggan' },
];

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="relative grid min-h-dvh lg:grid-cols-[1.1fr_0.9fr]">
            <Head title="Masuk" />

            {/* Panel kiri — branding */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-400 p-12 text-white lg:flex">
                {/* Dekorasi background */}
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky-800/30 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />

                {/* Logo di atas */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shadow backdrop-blur-sm">
                        <Car className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-wide">Car Wash Pro</span>
                </div>

                {/* Konten tengah */}
                <div className="relative z-10 flex flex-1 flex-col items-start justify-center gap-8 py-12">
                    <div>
                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
                            Kelola Bisnis<br />Cuci Kendaraan<br />
                            <span className="text-sky-100">Lebih Efisien</span>
                        </h1>
                        <p className="mt-4 max-w-sm text-base text-sky-100/80">
                            Platform manajemen terpadu untuk mencuci kendaraan — dari antrian hingga pembayaran.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-center gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{title}</p>
                                    <p className="text-xs text-sky-100/70">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer kiri */}
                <div className="relative z-10 text-xs text-sky-200/60">
                    © {new Date().getFullYear()} Car Wash Pro. All rights reserved.
                </div>
            </div>

            {/* Panel kanan — form login */}
            <div className="flex flex-col items-center justify-center bg-white px-6 py-12 sm:px-8">
                <div className="w-full max-w-sm">
                    {/* Logo mobile */}
                    <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 shadow-lg">
                            <Car className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-xl font-bold text-sky-700">Car Wash Pro</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
                        <p className="mt-1 text-sm text-slate-500">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    {status && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700 ring-1 ring-green-200">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            {status}
                        </div>
                    )}

                    <form className="flex flex-col gap-5" onSubmit={submit}>
                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="nama@email.com"
                                className="h-11 border-slate-200 bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-sky-400"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1.5">
                            <div className="flex items-center">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Kata Sandi</Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="ml-auto text-xs font-medium text-sky-600 hover:text-sky-700" tabIndex={5}>
                                        Lupa kata sandi?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="h-11 border-slate-200 bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-sky-400"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                            />
                            <Label htmlFor="remember" className="cursor-pointer text-sm text-slate-600">
                                Ingat saya selama 30 hari
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-1 h-11 w-full bg-sky-600 font-semibold text-white shadow-sm hover:bg-sky-700 active:bg-sky-800"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing ? (
                                <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Memproses...</>
                            ) : (
                                'Masuk'
                            )}
                        </Button>

                        <div className="text-center text-sm text-slate-500">
                            Belum punya akun?{' '}
                            <TextLink href={route('register')} tabIndex={5} className="font-medium text-sky-600 hover:text-sky-700">
                                Daftar sekarang
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
