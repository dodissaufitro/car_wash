import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan Notifikasi', href: '/settings/notifications' },
];

export default function Notifications() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Notifikasi" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Notifikasi" description="Atur preferensi notifikasi dan pemberitahuan sistem" />
                    <p className="text-muted-foreground text-sm">Pengaturan notifikasi belum dikonfigurasi.</p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
