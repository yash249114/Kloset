'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import CartDrawer from '@/components/cart/CartDrawer';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  Bell,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cartItems, setIsOpen: setCartIsOpen } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;

    const fetchNotifications = async () => {
      try {
        const { default: api } = await import('@/lib/api/client');
        const res = await api.get('/notifications');
        if (res.data.success) {
          setNotifications(res.data.data.slice(0, 5)); // top 5
          setUnreadCount(res.data.meta.unread || 0);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // 10s check
    return () => clearInterval(interval);
  }, [mounted, isAuthenticated]);

  const markAsRead = async (id: string) => {
    try {
      const { default: api } = await import('@/lib/api/client');
      await api.put(`/notifications/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const { default: api } = await import('@/lib/api/client');
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    router.push(`/discover?${params.toString()}`);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'seller') return '/seller/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/renter/dashboard';
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-150 font-body select-none transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 h-[70px] flex items-center justify-between gap-6">
        
        {/* Left Section: Logo & Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-gray-800 md:hidden hover:text-[var(--kloset-gold)] transition-colors"
          >
            <Menu size={22} />
          </button>
          
          <Link href="/" className="flex flex-col justify-center items-start leading-none group">
            <span className="font-display text-2xl font-bold tracking-wider text-gray-900 group-hover:text-[var(--kloset-gold)] transition-colors">
              KLOSET
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-gray-400 font-semibold mt-0.5">
              Couture Rental
            </span>
          </Link>
        </div>

        {/* Center Section: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
          <Link href="/discover" className={`hover:text-[var(--kloset-gold)] transition-colors py-2 ${pathname === '/discover' ? 'text-[var(--kloset-gold)] font-bold' : ''}`}>
            Discover
          </Link>
          <Link href="/discover" className="hover:text-[var(--kloset-gold)] transition-colors py-2">
            Categories
          </Link>
          <Link href="/register?role=seller" className="hover:text-[var(--kloset-gold)] transition-colors py-2">
            Become a Seller
          </Link>
          <Link href="/faq" className="hover:text-[var(--kloset-gold)] transition-colors py-2">
            Help
          </Link>
          <Link href="/contact" className="hover:text-[var(--kloset-gold)] transition-colors py-2">
            Contact
          </Link>
          <Link href="/help" className="hover:text-[var(--kloset-gold)] transition-colors py-2">
            Support
          </Link>
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4 text-gray-800">
          
          {/* Elegant Collapsible Search */}
          <div className="relative flex items-center">
            {searchBarOpen ? (
              <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 w-[220px] lg:w-[300px] transition-all animate-fade-in">
                <input
                  type="text"
                  placeholder="Search lehengas, sarees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-gray-800 outline-none w-full font-medium"
                  autoFocus
                />
                <button type="submit" className="text-gray-400 hover:text-gray-700">
                  <Search size={14} />
                </button>
                <button type="button" onClick={() => setSearchBarOpen(false)} className="text-gray-400 hover:text-gray-700 ml-1.5">
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchBarOpen(true)}
                className="p-2 hover:text-[var(--kloset-gold)] transition-colors cursor-pointer"
                title="Search"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Account Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1 p-2 hover:text-[var(--kloset-gold)] transition-colors cursor-pointer text-xs font-semibold uppercase tracking-[0.1em]"
            >
              <User size={18} />
              <span className="hidden lg:inline ml-0.5">
                {mounted && isAuthenticated && user ? user.name.split(' ')[0] : 'Sign In'}
              </span>
              <ChevronDown size={10} className="text-gray-400 hidden lg:inline" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 rounded bg-white z-50 py-1.5 shadow-xl border border-gray-100 animate-fade-in">
                  {mounted && isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Your Account</p>
                        <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">{user.name}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={getDashboardLink()}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <LayoutDashboard size={13} />
                          Your Dashboard
                        </Link>
                      </div>
                      <div className="pt-1 border-t border-gray-100">
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 w-full text-left cursor-pointer transition-colors"
                        >
                          <LogOut size={13} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center">
                      <Link
                        href="/login"
                        className="btn-luxury-primary w-full justify-center py-2 text-[10px] !h-8"
                        onClick={() => setProfileOpen(false)}
                      >
                        Sign in
                      </Link>
                      <p className="text-[10px] text-gray-500 mt-2">
                        New customer?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline" onClick={() => setProfileOpen(false)}>
                          Register
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Notification Bell Dropdown */}
          {mounted && isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 hover:text-[var(--kloset-gold)] transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-72 rounded bg-white z-50 py-2.5 shadow-xl border border-gray-100 animate-fade-in text-left">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Alert Center</p>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[9px] text-blue-600 hover:underline">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-400">No new notifications</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => { markAsRead(notif.id); setNotifOpen(false); }}
                            className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer text-xs transition-colors ${!notif.is_read ? 'bg-blue-50/20 font-medium' : ''}`}
                          >
                            <p className="font-semibold text-gray-900">{notif.title}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">{notif.body}</p>
                            <span className="text-[9px] text-gray-400 font-mono block mt-1">
                              {new Date(notif.created_at).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="pt-2 border-t border-gray-100 text-center">
                      <Link
                        href="/renter/notifications"
                        className="text-[10px] text-gray-500 hover:text-gray-800 uppercase tracking-wider font-semibold font-mono"
                        onClick={() => setNotifOpen(false)}
                      >
                        View all alerts
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Cart Icon with badge count */}
          <button
            onClick={() => setCartIsOpen(true)}
            className="relative p-2 hover:text-[var(--kloset-gold)] transition-colors cursor-pointer"
            title="Cart"
          >
            <ShoppingCart size={18} />
            {mounted && totalCartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[var(--kloset-gold)] text-white text-[9px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Side Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 top-[70px] backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-[70px] left-0 bottom-0 w-[270px] bg-white z-50 flex flex-col p-5 shadow-2xl overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-150 mb-5">
              <span className="font-display font-bold text-gray-900 tracking-wider">KLOSET</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3 font-semibold uppercase tracking-[0.15em] text-xs text-gray-700">
              <Link
                href="/discover"
                className="py-2.5 px-3 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover
              </Link>
              <Link
                href="/discover"
                className="py-2.5 px-3 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/register?role=seller"
                className="py-2.5 px-3 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become a Seller
              </Link>
              <Link
                href="/faq"
                className="py-2.5 px-3 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Help
              </Link>
              <Link
                href="/contact"
                className="py-2.5 px-3 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/help"
                className="py-2.5 px-3 hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-150 flex flex-col gap-3">
              {mounted && isAuthenticated && user ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="btn-luxury-primary justify-center text-[10px]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="btn-luxury-secondary justify-center text-[10px]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn-luxury-primary justify-center text-[10px]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-luxury-secondary justify-center text-[10px]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <CartDrawer />
    </header>
  );
}
