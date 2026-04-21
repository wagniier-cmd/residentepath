export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4 border border-white/20">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L4 9v7c0 6.6 5.1 12.7 12 14.2C23 28.7 28 22.6 28 16V9L16 3z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5"/>
              <path d="M13 16l2.5 2.5L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            ResidentePath
          </h1>
          <p className="text-white/70 text-sm mt-1">USMLE para médicos brasileiros</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
