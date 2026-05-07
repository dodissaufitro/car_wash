import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Car, ClipboardList, Clock, CreditCard, HardHat, LayoutGrid, ListOrdered, Map, Receipt, Settings, Settings2, Shield, ShoppingBag, Truck, UserCog, Users, Wallet, Wrench } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
];

const operasionalNavItems: NavItem[] = [
    { title: 'Penjualan',  url: '/penjualan',    icon: ShoppingBag },
    { title: 'Transaksi', url: '/transactions', icon: ClipboardList },
    { title: 'Antrian',   url: '/queues',       icon: ListOrdered },
    { title: 'Pembayaran', url: '/payments',    icon: CreditCard },
];

const pengaturanNavItems: NavItem[] = [
    { title: 'Umum',               url: '/settings/general',       icon: Settings2 },
    { title: 'Akun',               url: '/settings/account',       icon: UserCog },
    { title: 'Layanan',            url: '/settings/services',      icon: Wrench },
    { title: 'Denah Meja',         url: '/settings/table-map',     icon: Map },
    { title: 'Pengiriman',         url: '/settings/delivery',      icon: Truck },
    { title: 'Pajak & Biaya',      url: '/settings/taxes',         icon: Receipt },
    { title: 'Pembayaran',         url: '/settings/payment',       icon: Wallet },
    { title: 'Notifikasi',         url: '/settings/notifications', icon: Bell },
    { title: 'Pengguna',           url: '/settings/users',         icon: Users },
    { title: 'Shift Kerja',        url: '/settings/shifts',        icon: Clock },
];

const masterNavItems: NavItem[] = [
    { title: 'Pelanggan', url: '/customers', icon: Users },
    { title: 'Kendaraan', url: '/vehicles',  icon: Car },
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
                <NavMain label="Pengaturan" items={pengaturanNavItems} />
                <NavMain label="Master Data" items={masterNavItems} />
                {isAdmin && <NavMain label="Administrator" items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
