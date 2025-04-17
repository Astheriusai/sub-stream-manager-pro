
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Tv,
  Database,
  Users,
  ShoppingCart,
  UserCog,
  Building2,
  Shield,
  Store,
  Settings,
  LogOut,
  ChevronRight,
  Trash2
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Productos',
      path: '/products',
      icon: Tv,
    },
    {
      title: 'Cuentas',
      path: '/accounts',
      icon: Database,
    },
    {
      title: 'Clientes',
      path: '/customers',
      icon: Users,
    },
    {
      title: 'Ventas',
      path: '/sales',
      icon: ShoppingCart,
    },
    {
      title: 'Usuarios',
      path: '/users',
      icon: UserCog,
    },
    {
      title: 'Suscriptores',
      path: '/subscribers',
      icon: Building2,
      roleRequired: 'creator',
    },
    {
      title: 'Roles y Permisos',
      path: '/roles',
      icon: Shield,
    },
    {
      title: 'Marketplace',
      path: '/marketplace',
      icon: Store,
    },
    {
      title: 'Configuración',
      path: '/settings',
      icon: Settings,
    },
    {
      title: 'Papelera',
      path: '/trash',
      icon: Trash2,
    },
  ].filter(item => {
    // Filter out items that require specific roles
    if (item.roleRequired === 'creator') {
      return user?.role_id === 'creator';
    }
    return true;
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 ease-in-out border-r",
        collapsed ? "w-[60px]" : "md:w-[240px] w-[240px]"
      )}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <div className="text-lg font-bold">Stream Manager</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "rounded-full p-0 w-8 h-8",
              collapsed && "mx-auto"
            )}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "rotate-0" : "rotate-180"
              )}
            />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={cn(
                      location.pathname === item.path && "bg-primary/10"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                {user ? getInitials(user.name) : '?'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            className={cn(
              "w-full mt-4 justify-start",
              collapsed && "px-0 justify-center"
            )}
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {!collapsed && <span>Cerrar sesión</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
