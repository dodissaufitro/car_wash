import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan Umum', href: '/settings/general' },
];

export default function General() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Umum" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Umum" description="Pengaturan umum aplikasi car wash" />
                    <p className="text-muted-foreground text-sm">Pengaturan umum belum dikonfigurasi.</p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
