import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'CareSync Medical Portal' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
        
        {/* Clean, frosted glass navbar */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between p-4 px-6">
            <Link href="/" className="text-2xl font-bold tracking-tight text-teal-700 flex items-center gap-2">
              <span className="text-3xl">✚</span> CareSync
            </Link>
            <div className="flex gap-6 font-medium text-sm text-slate-600">
              <Link href="/patients" className="hover:text-teal-600 transition-colors">Patients</Link>
              <Link href="/doctors" className="hover:text-teal-600 transition-colors">Doctors</Link>
              <Link href="/appointments" className="hover:text-teal-600 transition-colors">Appointments</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>
        
      </body>
    </html>
  )
}