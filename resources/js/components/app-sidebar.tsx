import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Car, ClipboardList, CreditCard, HardHat, LayoutGrid, ListOrdered, Settings, Shield, Users, Wrench } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
];

const operasionalNavItems: NavItem[] = [
    { title: 'Transaksi', url: '/transactions', icon: ClipboardList },
    { title: 'Antrian',   url: '/queues',       icon: ListOrdered },
    { title: 'Pembayaran', url: '/payments',    icon: CreditCard },
];

const masterNavItems: NavItem[] = [
    { title: 'Pelanggan', url: '/customers', icon: Users },
    { title: 'Kendaraan', url: '/vehicles',  icon: Car },
    { title: 'Layanan',   url: '/services',  icon: Wrench },
    { title: 'Karyawan',  url: '/employees', icon: HardHat },
];

const adminNavItems: NavItem[] = [
    { title: 'Pengguna',   url: '/users',  icon: Settings },
    { title: 'Hak Akses',  url: '/roles',  icon: Shield },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role?.slug === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain label="Operasional" items={operasionalNavItems} />
                <NavMain label="Master Data" items={masterNavItems} />
                {isAdmin && <NavMain label="Administrator" items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
