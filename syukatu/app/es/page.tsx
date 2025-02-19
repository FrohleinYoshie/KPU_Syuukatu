'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import './style.css';

interface ESEntry {
  id: string;
  company_name: string;
  job_type: string;
  graduation_year: string;
  es_format: string;
  es_theme: string;
  important_points: string;
  preparation_methods: string;
  created_at: string;
  users_syukatu: {
    name: string;
    department: string;
  };
}

export default function ESListPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ESEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [userProfile, setUserProfile] = useState<{ name: string; department: string } | null>(null);

  useEffect(() => {
    const loadUserAndEntries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('users_syukatu')
          .select('name, department')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
        }

        const { data: esEntries, error } = await supabase
          .from('es_entries_syukatu')
          .select(`
            *,
            users_syukatu (
              name,
              department
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(esEntries || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndEntries();
  }, [router]);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.job_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = !selectedFormat || entry.es_format === selectedFormat;
    const matchesYear = !selectedYear || entry.graduation_year === selectedYear;
    
    return matchesSearch && matchesFormat && matchesYear;
  });

  const uniqueYears = Array.from(new Set(entries.map(entry => entry.graduation_year))).sort();
  const esFormats = ['履歴書の提出', 'フォームの回答'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
      </div>
    );
  }

  return (
    <>
      <Header 
        userName={userProfile?.name} 
        userDepartment={userProfile?.department}
      />

      <div className="es-list-container">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="es-list-title text-2xl font-bold">ES情報一覧</h1>
          </div>

          <div className="es-filter-container">
            <input
              type="text"
              placeholder="会社名または職種で検索"
              className="es-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="es-select"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="">ES形式で絞り込み</option>
              {esFormats.map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
            <select
              className="es-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">卒業年度で絞り込み</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="empty-state">
              <p>
                {entries.length === 0 
                  ? 'まだESの登録がありません' 
                  : '条件に一致するESが見つかりませんでした'}
              </p>
            </div>
          ) : (
            <div className="es-grid">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="es-card">
                  <div className="es-card-content">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">
                        {entry.company_name}
                      </h3>
                      <span className="es-badge">{entry.graduation_year}</span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      {entry.job_type} | {entry.users_syukatu.name}（{entry.users_syukatu.department}）
                    </div>

                    <div>
                      <h4 className="es-section-title">ES形式</h4>
                      <p className="es-section-content">{entry.es_format}</p>

                      <h4 className="es-section-title">内容・テーマ</h4>
                      <p className="es-section-content">{entry.es_theme}</p>

                      <h4 className="es-section-title">注意したこと</h4>
                      <p className="es-section-content">{entry.important_points}</p>

                      <h4 className="es-section-title">対策内容</h4>
                      <p className="es-section-content">{entry.preparation_methods}</p>
                    </div>
                  </div>
                  
                  <div className="es-card-footer text-sm text-gray-500">
                    登録日: {new Date(entry.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/es/register"
          className="es-register-button"
        >
          新規登録
        </Link>
      </div>
    </>
  );
}