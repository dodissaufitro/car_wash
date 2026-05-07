import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Pengguna', href: '/settings/users' },
];

export default function Users() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Pengguna" description="Kelola akses dan data pengguna sistem" />
                    <p className="text-muted-foreground text-sm">Pengaturan pengguna belum dikonfigurasi.</p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
