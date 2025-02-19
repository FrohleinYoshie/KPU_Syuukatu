'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import './header.css';

interface HeaderProps {
  userName: string | null;
  userDepartment: string | null;
}

export default function Header({ userName, userDepartment }: HeaderProps) {
  const router = useRouter();

  const userLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="dashboard-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="nav-title text-xl mr-8">就活情報共有</Link>
            <div className="hidden md:flex">
              <Link href="/es" className="nav-link">ES情報</Link>
              <Link href="/interview" className="nav-link">面接情報</Link>
              <Link href="/coding-test" className="nav-link">コーディングテスト</Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">
              {userName} ({userDepartment})
            </span>
            <button
              onClick={userLogout}
              className="nav-button"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}