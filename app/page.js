import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-teal-50 rounded-full mb-4">
          <span className="text-teal-600 text-4xl">✚</span>
        </div>
        <marquee>
          <h1 className="text-4xl md:text-5xl font-bold text-teal-300 mb-6 tracking-tight">
            Modern Clinic Management System
          </h1>
        </marquee>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          A secure, intuitive portal for managing patient records, coordinating
          medical staff, and scheduling appointments.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Patient Card */}
        <Link
          href="/patients"
          className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors text-teal-600 shadow-sm">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Patient Records
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Securely manage patient demographics, contact information, and
            critical medical alerts.
          </p>
        </Link>

        {/* Doctor Card */}
        <Link
          href="/doctors"
          className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors text-teal-600 shadow-sm">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Medical Staff
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Organize doctor directories, specialties, consultation fees, and
            availability schedules.
          </p>
        </Link>

        {/* Appointments Card */}
        <Link
          href="/appointments"
          className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors text-teal-600 shadow-sm">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Appointments
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Streamline booking workflows, track appointment statuses, and manage
            clinic calendars.
          </p>
        </Link>
      </div>
    </div>
  );
}
