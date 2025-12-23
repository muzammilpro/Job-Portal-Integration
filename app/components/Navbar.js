"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  LogOut,
  X,
  Briefcase,
  LayoutDashboard,
  Sparkles,
  Info,
  Mail,
  Home,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-sky-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Briefcase size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                JobPortal
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" icon={<Home size={18} />} label="Home" />
              <NavLink href="/jobs" icon={<Briefcase size={18} />} label="Jobs" />
              <NavLink href="/aboutus" icon={<Info size={18} />} label="About Us" />
              <NavLink href="/contactus" icon={<Mail size={18} />} label="Contact" />

              {session && (
                <NavLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                />
              )}

              {/* Admin only: Applications */}
              {session && session.user?.role === "admin" && (
                <NavLink
                  href="/dashboard/admin/application"
                  icon={<Users size={18} />}
                  label="Applications"
                />
              )}

              {/* User only: Profile */}
              {session && session.user?.role === "user" && (
                <NavLink
                  href="/profile"
                  icon={<User size={18} />}
                  label="Profile"
                />
              )}

              {!session ? (
                <Link
                  href="/signin"
                  className="ml-4 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-sky-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <Sparkles
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Sign In
                </Link>
              ) : (
                <div className="ml-4 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-100 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={session.user.image || "/user.png"}
                      alt="User"
                      className="w-9 h-9 rounded-full border-2 border-indigo-500 shadow-lg"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-slate-900 font-semibold text-sm">
                      {session.user.name}
                    </p>
                    <p className="text-slate-500 text-xs">Active now</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="ml-2 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-slate-200 px-4 py-4 space-y-2">
            <MobileNavLink href="/" icon={<Home size={20} />} label="Home" close={() => setIsOpen(false)} />
            <MobileNavLink href="/jobs" icon={<Briefcase size={20} />} label="Jobs" close={() => setIsOpen(false)} />
            <MobileNavLink href="/aboutus" icon={<Info size={20} />} label="About Us" close={() => setIsOpen(false)} />
            <MobileNavLink href="/contactus" icon={<Mail size={20} />} label="Contact" close={() => setIsOpen(false)} />

            {session && (
              <MobileNavLink
                href="/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                close={() => setIsOpen(false)}
              />
            )}

            {/* Admin only: Applications */}
            {session && session.user?.role === "admin" && (
              <MobileNavLink
                href="/dashboard/admin/application"
                icon={<Users size={20} />}
                label="Applications"
                close={() => setIsOpen(false)}
              />
            )}

            {/* User only: Profile */}
            {session && session.user?.role === "user" && (
              <MobileNavLink
                href="/profile"
                icon={<User size={20} />}
                label="Profile"
                close={() => setIsOpen(false)}
              />
            )}

            {!session ? (
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg mt-2"
              >
                <Sparkles size={20} />
                Sign In
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold mt-2"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16"></div>
    </>
  );
}

/* ---------- Components ---------- */

function NavLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ href, icon, label, close }) {
  return (
    <Link
      href={href}
      onClick={close}
      className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-4 py-3 rounded-xl transition font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}
