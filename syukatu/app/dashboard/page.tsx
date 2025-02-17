'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './style.css';

interface UserProfile {
  id: string;
  name: string | null;
  department: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    validateAuthAndLoadProfile();
  }, []);

  const validateAuthAndLoadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('users_syukatu')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
        setShowProfileForm(!profile.name || !profile.department);
      } else {
        setShowProfileForm(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('パスワードは8文字以上で入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('パスワードが一致しません');
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordError) throw passwordError;

      const { error: profileError } = await supabase
        .from('users_syukatu')
        .insert([
          {
            id: user.id,
            email: user.email,
            name,
            department,
          }
        ]);

      if (profileError) throw profileError;

      setShowProfileForm(false);
      validateAuthAndLoadProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMsg('プロフィールの更新に失敗しました。もう一度お試しください。');
    }
  };

  const userLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container flex items-center justify-center">
        <div className="loading-spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <div className="dashboard-container flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            プロフィール登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            サービスを利用するために必要な情報を入力してください
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="profile-card">
            <form className="space-y-6" onSubmit={registerProfile}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  氏名
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="profile-input appearance-none block w-full px-3 py-2 rounded-lg shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  学部
                </label>
                <div className="mt-1">
                  <select
                    id="department"
                    name="department"
                    required
                    className="profile-select block w-full px-3 py-2 rounded-lg shadow-sm"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    <option value="情報学部">情報学部</option>
                    <option value="経営学部">経営学部</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="profile-input appearance-none block w-full px-3 py-2 rounded-lg shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">8文字以上で入力してください</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  パスワード（確認）
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="profile-input appearance-none block w-full px-3 py-2 rounded-lg shadow-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-red-500 text-sm text-center font-medium">{errorMsg}</div>
              )}

              <div>
                <button
                  type="submit"
                  className="submit-button w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white"
                >
                  登録する
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="nav-title text-xl">就活情報共有</Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                {userProfile?.name} ({userProfile?.department})
              </span>
              <button
                onClick={userLogout}
                className="nav-button inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "ES情報",
              description: "ES情報を共有・閲覧できます",
              icon: (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              ),
              viewLink: "/es",
              registerLink: "/es/register"
            },
            {
              title: "コーディングテスト",
              description: "テスト情報を共有・閲覧できます",
              icon: (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                />
              ),
              viewLink: "/coding-test",
              registerLink: "/coding-test/register"
            },
            {
              title: "面接情報",
              description: "面接情報を共有・閲覧できます",
              icon: (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" 
                />
              ),
              viewLink: "/interview",
              registerLink: "/interview/register"
            }
          ].map((feature, index) => (
            <div key={index} className="feature-card p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {feature.icon}
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <Link
                  href={feature.viewLink}
                  className="view-button inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
                >
                  一覧を見る
                </Link>
                <Link
                  href={feature.registerLink}
                  className="register-button inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white"
                >
                  登録する
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}