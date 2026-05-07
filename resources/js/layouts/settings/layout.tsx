import { type NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Layanan',
        url: '/settings/services',
        icon: null,
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 sm:p-6">
            {children}
        </div>
    );
}
