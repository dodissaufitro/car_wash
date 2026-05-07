import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pajak & Biaya Lainnya', href: '/settings/taxes' },
];

export default function Taxes() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pajak & Biaya Lainnya" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Pajak & Biaya Lainnya" description="Atur persentase pajak dan biaya tambahan transaksi" />
                    <p className="text-muted-foreground text-sm">Pengaturan pajak & biaya belum dikonfigurasi.</p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
