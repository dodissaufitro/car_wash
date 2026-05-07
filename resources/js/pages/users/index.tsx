import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role, type User } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit2, Plus, Trash2, User as UserIcon, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
    users: User[];
    roles: Pick<Role, 'id' | 'name' | 'slug'>[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengguna', href: '/users' },
];

type FormData = {
    name: string;
    email: string;
    password: string;
    role_id: string;
};

export default function UsersIndex({ users, roles }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, transform, processing, errors, reset, clearErrors } = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditingUser(null);
        setShowModal(true);
    }

    function openEdit(user: User) {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: user.role_id ? String(user.role_id) : '',
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        transform((d) => ({
            ...d,
            role_id: d.role_id || null,
        }));
        if (editingUser) {
            put(route('users.update', editingUser.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(user: User) {
        if (!confirm(`Hapus pengguna "${user.name}"?`)) return;
        router.delete(route('users.destroy', user.id));
    }

    const roleColor: Record<string, string> = {
        admin:    'bg-red-50 text-red-700 ring-1 ring-red-200',
        kasir:    'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
        teknisi:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />

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
                            <UserIcon className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Manajemen Pengguna</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola akun dan hak akses pengguna</p>
                        </div>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:brightness-105 hover:shadow-sky-300 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Pengguna
                    </button>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pengguna</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Bergabung</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium text-slate-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        {user.role ? (
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor[user.role.slug] ?? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}
                                            >
                                                {user.role.name}
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                                                Tanpa Role
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => openEdit(user)}
                                                className="flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100 active:scale-95"
                                                title="Edit"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 ring-1 ring-red-200 transition hover:bg-red-100 active:scale-95"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <UserIcon className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada pengguna</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal tambah/edit pengguna */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
                    </DialogHeader>

                    <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="u-name">Nama Lengkap</Label>
                            <Input
                                id="u-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Budi Santoso"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="u-email">Email</Label>
                            <Input
                                id="u-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="budi@example.com"
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="u-password">
                                Kata Sandi {editingUser && <span className="text-muted-foreground text-xs">(kosongkan jika tidak diubah)</span>}
                            </Label>
                            <Input
                                id="u-password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={editingUser ? '••••••••' : 'Minimal 8 karakter'}
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="u-role">Hak Akses (Role)</Label>
                            <Select value={data.role_id} onValueChange={(v) => setData('role_id', v)}>
                                <SelectTrigger id="u-role">
                                    <SelectValue placeholder="Pilih role..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={String(role.id)}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role_id && <p className="text-xs text-red-500">{errors.role_id}</p>}
                        </div>
                    </form>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 active:scale-95"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="user-form"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:brightness-105 disabled:opacity-60 active:scale-95"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
