// src/pages/about.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 pointer-events-auto">
      <h1 className="fixed top-0 left-0 w-full text-center text-4xl 
      font-extrabold text-gray-900 sm:text-5xl md:text-6xl bg-white shadow-md py-4 z-50">
          就活情報共有プラットフォーム　〇〇
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">      
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-6">
            <Link　href="/auth"
                  className="primary-button flex items-center justify-center px-8 py-1 text-base font-medium rounded-lg text-white md:py-4 md:text-lg md:px-10"
            >
              今すぐログイン
            </Link>
            <Link href="/"
                  className="secondary-button flex items-center justify-center px-8 py-1 text-base font-medium rounded-lg bg-white md:py-4 md:text-lg md:px-10"
                  >
              ホームに戻る
            </Link>
          </div>

      </div>
      </h1>
      </header>

      <main className='pt-1'>
     
      <div className='pt-[200px] w-full'>
        <div className='space-y-6'>

          <h1 className="text-3xl font-bold mb-3">

          </h1>
          <p className="text-lg mb-8">このアプリでは以下のことが行えます。</p>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-3"　>主な機能</h1>
      <div className="mt-24">
            <div className="grid grid-cols-3 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {[
                {
                  title: "ES対策",
                  description: "実際に通過したESの内容や、評価のポイントを共有することができます。",
                  icon: (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  )
                },
                {
                  title: "コーディングテスト",
                  description: "出題された問題の傾向や難易度、対策方法を共有できます。",
                  icon: (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                    />
                  )
                },
                {
                  title: "面接情報",
                  description: "実際の面接での質問内容や、回答のポイントを共有できます。",
                  icon: (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" 
                    />
                  )
                },
                {
                  title: "就活中企業一覧",
                  description: "現在就活を行なっている企業を一覧として表示できます。",
                  icon: (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" 
                    />
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="feature-card pt-6">
                  <div className="flow-root bg-white rounded-xl px-6 pb-8 shadow-sm">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center p-3 rounded-lg shadow-md"
                        style={{ 
                          background: index % 2 === 0 ? '#5AB9C1' : '#ed8218'
                        }}
                      >
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {feature.icon}
                        </svg>
                      </div>
                      <h3 className="mt-8 text-xl font-semibold text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

      <h1 className="text-3xl font-bold mb-3"　>目的</h1>
      {/* ホームページへ戻るリンク */}

      </main>
      <Link href="/" className="back-link font-medium hover:underline">
        ホームに戻る
      </Link>
    </div>
  );
}