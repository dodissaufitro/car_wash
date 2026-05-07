import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan Pembayaran', href: '/settings/payment' },
];

export default function Payment() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Pembayaran" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Pembayaran" description="Kelola metode dan opsi pembayaran yang tersedia" />
                    <p className="text-muted-foreground text-sm">Pengaturan pembayaran belum dikonfigurasi.</p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
