import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit2, Plus, Shield, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
    roles: Role[];
    allPermissions: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Hak Akses', href: '/roles' },
];

const PERMISSION_GROUPS: Record<string, string[]> = {
    Umum: ['dashboard'],
    Pengguna: ['users.view', 'users.create', 'users.edit', 'users.delete'],
    'Hak Akses': ['roles.view', 'roles.create', 'roles.edit', 'roles.delete'],
    Transaksi: ['transactions.view', 'transactions.create', 'transactions.edit', 'transactions.delete'],
    Laporan: ['reports.view'],
    Antrian: ['queue.view', 'queue.update'],
};

type FormData = {
    name: string;
    slug: string;
    description: string;
    permissions: string[];
};

export default function RolesIndex({ roles, allPermissions }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        name: '',
        slug: '',
        description: '',
        permissions: [],
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditingRole(null);
        setShowModal(true);
    }

    function openEdit(role: Role) {
        setEditingRole(role);
        setData({
            name: role.name,
            slug: role.slug,
            description: role.description ?? '',
            permissions: role.permissions ?? [],
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingRole) {
            put(route('roles.update', editingRole.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('roles.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(role: Role) {
        if (!confirm(`Hapus role "${role.name}"?`)) return;
        router.delete(route('roles.destroy', role.id));
    }

    function togglePermission(perm: string) {
        setData(
            'permissions',
            data.permissions.includes(perm) ? data.permissions.filter((p) => p !== perm) : [...data.permissions, perm],
        );
    }

    function toggleGroup(perms: string[]) {
        const allChecked = perms.every((p) => data.permissions.includes(p));
        if (allChecked) {
            setData(
                'permissions',
                data.permissions.filter((p) => !perms.includes(p)),
            );
        } else {
            const merged = Array.from(new Set([...data.permissions, ...perms]));
            setData('permissions', merged);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hak Akses" />

            <div className="p-4 sm:p-6">
                {/* Flash messages */}
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
                            <Shield className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Manajemen Hak Akses</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola role dan izin untuk setiap pengguna</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Role
                    </Button>
                </div>

                {/* Tabel roles */}
                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Deskripsi</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Izin</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Pengguna</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Shield className="text-sky-600 h-4 w-4 shrink-0" />
                                            <div>
                                                <div className="font-medium">{role.name}</div>
                                                <div className="text-muted-foreground text-xs">{role.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">{role.description ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {(role.permissions ?? []).slice(0, 4).map((perm) => (
                                                <span key={perm} className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-sky-200">
                                                    {allPermissions[perm] ?? perm}
                                                </span>
                                            ))}
                                            {(role.permissions ?? []).length > 4 && (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                                    +{(role.permissions ?? []).length - 4} lagi
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{role.users_count ?? 0}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(role)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(role)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Shield className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada role</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal tambah/edit role */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingRole ? 'Edit Hak Akses' : 'Tambah Hak Akses'}</DialogTitle>
                    </DialogHeader>

                    <form id="role-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name">Nama Role</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Administrator"
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="admin"
                                    disabled={!!editingRole}
                                />
                                {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Deskripsi singkat role ini"
                            />
                        </div>

                        {/* Tabel izin per grup */}
                        <div>
                            <Label className="mb-2 block">Izin Akses</Label>
                            <div className="rounded-lg border">
                                {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                                    const allChecked = perms.every((p) => data.permissions.includes(p));
                                    const someChecked = perms.some((p) => data.permissions.includes(p));
                                    return (
                                        <div className="border-b last:border-b-0">
                                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2">
                                                <Checkbox
                                                    id={`group-${group}`}
                                                    checked={allChecked}
                                                    data-state={someChecked && !allChecked ? 'indeterminate' : undefined}
                                                    onCheckedChange={() => toggleGroup(perms)}
                                                />
                                                <Label htmlFor={`group-${group}`} className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    {group}
                                                </Label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-6 py-3 sm:grid-cols-3">
                                                {perms.map((perm) => (
                                                    <div key={perm} className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={perm}
                                                            checked={data.permissions.includes(perm)}
                                                            onCheckedChange={() => togglePermission(perm)}
                                                        />
                                                        <Label htmlFor={perm} className="cursor-pointer text-sm font-normal">
                                                            {allPermissions[perm] ?? perm}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.permissions && <p className="mt-1 text-xs text-red-500">{errors.permissions}</p>}
                        </div>
                    </form>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>
                            Batal
                        </Button>
                        <Button type="submit" form="role-form" disabled={processing} className="bg-sky-600 hover:bg-sky-700">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
