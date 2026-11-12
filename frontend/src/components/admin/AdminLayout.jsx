import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  RiAddCircleLine,
  RiCloseLine,
  RiDashboardLine,
  RiExternalLinkLine,
  RiFileList3Line,
  RiFolderAddLine,
  RiImageEditLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiPriceTag3Line,
  RiStarLine,
  RiUserSettingsLine,
} from '@remixicon/react'
import BrandLogo from '../section/BrandLogo.jsx'
import { useAdmin } from '../../features/admin/adminContext.js'

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', end: true, Icon: RiDashboardLine },
  {
    label: 'Manage Products',
    to: '/admin/products',
    end: true,
    Icon: RiPriceTag3Line,
  },
  {
    label: 'Add Product',
    to: '/admin/products/new',
    end: true,
    Icon: RiAddCircleLine,
  },
  {
    label: 'Add Category',
    to: '/admin/categories/new',
    end: true,
    Icon: RiFolderAddLine,
  },
  {
    label: 'Manage Orders',
    to: '/admin/orders',
    end: false,
    Icon: RiFileList3Line,
  },
  {
    label: 'Manage Reviews',
    to: '/admin/reviews',
    end: true,
    Icon: RiStarLine,
  },
  {
    label: 'Hero Banner',
    to: '/admin/storefront',
    end: true,
    Icon: RiImageEditLine,
  },
  {
    label: 'Admin Profile',
    to: '/admin/profile',
    end: true,
    Icon: RiUserSettingsLine,
  },
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { adminProfile, logoutAdmin } = useAdmin()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F6F3EC] border-r border-[#EAE5DC] text-[#1A1816]">
      <div className="px-5 py-6 border-b border-[#EAE5DC]">
        <Link to="/admin" onClick={() => setSidebarOpen(false)}>
          <BrandLogo />
        </Link>
        <p className="mt-2.5 text-[9.5px] tracking-[0.24em] uppercase text-[#8A8379]">
          ATELIER ADMINISTRATION
        </p>
      </div>

      <nav
        aria-label="Admin sidebar navigation"
        className="flex-1 px-3 py-5 space-y-1 overflow-y-auto"
      >
        {ADMIN_NAV.map((item) => {
          const IconComponent = item.Icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-[12.5px] transition-colors ${
                  isActive
                    ? 'bg-[#151413] text-[#FCF9F2] font-medium'
                    : 'text-[#5E5951] hover:text-[#1A1816] hover:bg-[#ECE6DB]'
                }`
              }
            >
              <IconComponent size={16} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#EAE5DC] space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 text-[11.5px] text-[#5E5951] hover:text-[#1A1816] hover:bg-[#ECE6DB] transition-colors"
        >
          <span>View Storefront</span>
          <RiExternalLinkLine size={14} aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 text-[11.5px] text-[#7A5448] hover:text-[#1A1816] hover:bg-[#ECE6DB] transition-colors cursor-pointer"
        >
          <span>Sign Out</span>
          <RiLogoutBoxRLine size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-[#FCF9F2] text-[#1A1816] overflow-x-clip">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#1A1816]/40 backdrop-blur-[1px]"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full z-10">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close admin sidebar"
              className="absolute top-5 right-4 p-1.5 text-[#1A1816] cursor-pointer"
            >
              <RiCloseLine size={20} aria-hidden="true" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-[68px] bg-[#FCF9F2]/95 backdrop-blur-md border-b border-[#EAE5DC] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-1.5 text-[#1A1816] hover:opacity-70 cursor-pointer"
            >
              <RiMenuLine size={20} aria-hidden="true" />
            </button>
            <span className="text-[10.5px] tracking-[0.22em] uppercase text-[#8A8379] truncate">
              Velora Admin Console
            </span>
          </div>

          <Link
            to="/admin/profile"
            className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
          >
            <span className="hidden sm:block text-right">
              <span className="block text-[12px] font-medium text-[#1A1816] leading-tight">
                {adminProfile.name}
              </span>
              <span className="block text-[10px] text-[#78736B]">
                {adminProfile.role}
              </span>
            </span>
            <span className="w-8 h-8 rounded-full bg-[#151413] text-[#FCF9F2] text-[11px] font-medium flex items-center justify-center shrink-0">
              {adminProfile.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </Link>
        </header>

        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 sm:py-10">
          <div className="max-w-[1200px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

