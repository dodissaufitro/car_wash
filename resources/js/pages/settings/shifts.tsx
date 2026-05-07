import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shift Kerja', href: '/settings/shifts' },
];

export default function Shifts() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shift Kerja" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Shift Kerja" description="Atur jadwal dan pembagian shift kerja karyawan" />
                    <p className="text-muted-foreground text-sm">Pengaturan shift kerja belum dikonfigurasi.</p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
