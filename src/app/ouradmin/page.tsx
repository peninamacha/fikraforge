"use client";

import dynamic from "next/dynamic";

// Dynamically load AdminSection on client-side only to prevent SSR localStorage issues
const AdminSection = dynamic(() => import("../../components/AdminSection"), {
  ssr: false,
});

export default function OurAdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-[#C94A1A]/30 selection:text-white relative">
      {/* Background ambient orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#C94A1A]/5 blur-[130px] -top-40 -right-40" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#E0531E]/3 blur-[120px] -bottom-20 -left-20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px] opacity-75" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 z-10 relative">
        <AdminSection />
      </div>
    </div>
  );
}
