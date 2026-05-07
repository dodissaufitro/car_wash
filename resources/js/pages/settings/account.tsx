import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan Akun', href: '/settings/account' },
];

export default function Account() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Akun" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Akun" description="Kelola informasi akun bisnis Anda" />
                    <p className="text-muted-foreground text-sm">Pengaturan akun belum dikonfigurasi.</p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
