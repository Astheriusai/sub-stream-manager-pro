
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Tv, 
  Users, 
  ShoppingCart, 
  UserCog, 
  Database, 
  LucideIcon, 
  ShieldCheck, 
  Store, 
  Settings,
  Trash2,
  DollarSign
} from 'lucide-react';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  submenu?: Array<{
    title: string;
    href: string;
  }>;
};

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Productos', href: '/products', icon: Tv },
  { title: 'Cuentas', href: '/accounts', icon: Database },
  { title: 'Clientes', href: '/customers', icon: Users },
  { title: 'Ventas', href: '/sales', icon: ShoppingCart },
  { title: 'Lista de Precios', href: '/price-list', icon: DollarSign },
  { title: 'Usuarios', href: '/users', icon: UserCog },
  { title: 'Suscriptores', href: '/subscribers', icon: Database },
  { title: 'Roles y Permisos', href: '/roles', icon: ShieldCheck },
  { title: 'Marketplace', href: '/marketplace', icon: Store },
  { title: 'Configuración', href: '/settings', icon: Settings },
  { title: 'Papelera', href: '/trash', icon: Trash2 },
];

export function AppSidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const { pathname } = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-none items-center justify-center h-16 border-b">
        <Link to="/" className="flex items-center space-x-2">
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight">StreamSeller</span>
          )}
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {navItems.map((item) => (
            item.submenu ? (
              <Collapsible
                key={item.href}
                open={openSubmenu === item.href}
                onOpenChange={(isOpen) => setOpenSubmenu(isOpen ? item.href : null)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'justify-between h-10 w-full',
                      openSubmenu === item.href && 'bg-accent'
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-2" />
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn(
                          'h-4 w-4 transition-transform',
                          openSubmenu === item.href && 'rotate-180'
                        )}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-10">
                  {!collapsed && item.submenu.map((subitem) => (
                    <Button
                      key={subitem.href}
                      variant="ghost"
                      asChild
                      className={cn(
                        'w-full justify-start mb-1',
                        pathname === subitem.href && 'bg-accent'
                      )}
                    >
                      <Link to={subitem.href}>{subitem.title}</Link>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  'h-10 justify-start',
                  pathname === item.href && 'bg-accent',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Link to={item.href}>
                  <item.icon className={cn('h-5 w-5', !collapsed && 'mr-2')} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            )
          ))}
        </nav>
      </ScrollArea>
      <div className="flex h-12 flex-none items-center justify-center border-t">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')}
          >
            {collapsed ? (
              <>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </>
            ) : (
              <>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </>
            )}
          </svg>
        </Button>
      </div>
    </aside>
  );
}
