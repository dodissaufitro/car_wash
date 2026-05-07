import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan Pengiriman', href: '/settings/delivery' },
];

export default function Delivery() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Pengiriman" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Pengiriman" description="Kelola pengaturan layanan pengiriman kendaraan" />
                    <p className="text-muted-foreground text-sm">Pengaturan pengiriman belum dikonfigurasi.</p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
