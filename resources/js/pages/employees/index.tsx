import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit2, HardHat, Plus, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Employee {
    id: number;
    nama: string;
    jabatan: string | null;
    no_hp: string | null;
}

interface Props {
    employees: Employee[];
}

type FormData = {
    nama: string;
    jabatan: string;
    no_hp: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Karyawan', href: '/employees' },
];

export default function EmployeesIndex({ employees }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<FormData>({
        nama: '',
        jabatan: '',
        no_hp: '',
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditingEmployee(null);
        setShowModal(true);
    }

    function openEdit(employee: Employee) {
        setEditingEmployee(employee);
        setData({
            nama: employee.nama,
            jabatan: employee.jabatan ?? '',
            no_hp: employee.no_hp ?? '',
        });
        clearErrors();
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingEmployee) {
            put(route('employees.update', editingEmployee.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('employees.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    }

    function handleDelete(employee: Employee) {
        if (!confirm(`Hapus karyawan "${employee.nama}"?`)) return;
        router.delete(route('employees.destroy', employee.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Karyawan" />

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
                            <HardHat className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Karyawan</h1>
                            <p className="mt-0.5 text-sm text-slate-500">Kelola data karyawan</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Karyawan
                    </Button>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Jabatan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">No. HP</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-sky-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <HardHat className="h-4 w-4 shrink-0 text-sky-600" />
                                            <span className="font-medium">{employee.nama}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">{employee.jabatan ?? '-'}</td>
                                    <td className="text-muted-foreground px-4 py-3">{employee.no_hp ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(employee)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(employee)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <HardHat className="h-8 w-8 opacity-40" />
                                            <p className="text-sm">Belum ada data karyawan</p>
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
                        <DialogTitle>{editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="nama">Nama Karyawan</Label>
                            <Input id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} placeholder="Nama lengkap" />
                            {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="jabatan">Jabatan</Label>
                            <Input
                                id="jabatan"
                                value={data.jabatan}
                                onChange={(e) => setData('jabatan', e.target.value)}
                                placeholder="Teknisi, Kasir, dll."
                            />
                            {errors.jabatan && <p className="text-xs text-red-500">{errors.jabatan}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="no_hp">No. HP</Label>
                            <Input id="no_hp" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} placeholder="08xxxxxxxxxx" />
                            {errors.no_hp && <p className="text-xs text-red-500">{errors.no_hp}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-sky-600 hover:bg-sky-700">
                                {editingEmployee ? 'Simpan Perubahan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
