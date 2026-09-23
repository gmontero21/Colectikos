import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-10 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header (Ancho completo) */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-stone-900">Vercel Serverless Infrastructure</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              API: Live
            </span>
            <span className="text-stone-500 bg-stone-100 px-3 py-1 rounded-full">Node: v20</span>
            <span className="text-stone-500 bg-stone-100 px-3 py-1 rounded-full">Uptime: 99.99%</span>
            <button className="px-5 py-2 bg-stone-900 text-white hover:bg-stone-800 rounded-xl transition-colors shadow-sm">
              Sync
            </button>
          </div>
        </div>

        {/* Fila Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Columna 1: Métricas Rápidas */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl shadow-sm p-6 flex-1 flex flex-col justify-center">
              <h2 className="text-sm font-semibold text-stone-500 mb-4 tracking-wide">Vercel Edge Latency</h2>
              <div className="flex items-end gap-2 h-16 w-full mt-auto">
                <div className="flex-1 bg-emerald-200 hover:bg-emerald-300 transition-colors rounded-t-sm h-[40%]"></div>
                <div className="flex-1 bg-emerald-300 hover:bg-emerald-400 transition-colors rounded-t-sm h-[60%]"></div>
                <div className="flex-1 bg-emerald-100 hover:bg-emerald-200 transition-colors rounded-t-sm h-[30%]"></div>
                <div className="flex-1 bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-t-sm h-[80%]"></div>
                <div className="flex-1 bg-emerald-400 hover:bg-emerald-500 transition-colors rounded-t-sm h-[50%]"></div>
                <div className="flex-1 bg-emerald-300 hover:bg-emerald-400 transition-colors rounded-t-sm h-[70%]"></div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm p-6 flex-1 flex flex-col justify-center">
              <h2 className="text-sm font-semibold text-stone-500 mb-2 tracking-wide">Storage Capacity</h2>
              <div className="text-4xl font-black text-stone-800 mb-3">74%</div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[74%]"></div>
              </div>
              <p className="text-xs text-stone-400 mt-3 font-medium">Uso de imágenes</p>
            </div>
          </div>

          {/* Columna 2: Gráfico de Uso */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-sm p-6 flex flex-col">
            <h2 className="text-xs font-bold text-slate-400 tracking-wider mb-1">LAST HOUR USAGE</h2>
            <h3 className="text-2xl font-bold text-white mb-8">Traffic Pulse</h3>
            <div className="flex-1 flex items-end gap-1.5 mt-auto h-40">
              {[30, 50, 40, 70, 90, 60, 80, 45, 55, 75, 65, 85, 50, 40, 95].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-indigo-500 hover:bg-indigo-400 transition-all rounded-t-sm cursor-pointer" 
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Columna 3: DB Health */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-sm p-6 flex flex-col">
            <h2 className="text-xs font-bold text-slate-400 tracking-wider mb-1">DB HEALTH</h2>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
              Neon PostgreSQL Active
            </h3>
            <div className="flex-1 flex flex-col gap-4 justify-center">
              <div className="bg-slate-800 rounded-2xl p-5 flex justify-between items-center shadow-inner">
                <span className="text-slate-400 font-medium">Usuarios</span>
                <span className="text-2xl font-bold text-white">1,204</span>
              </div>
              <div className="bg-slate-800 rounded-2xl p-5 flex justify-between items-center shadow-inner">
                <span className="text-slate-400 font-medium">Postales</span>
                <span className="text-2xl font-bold text-white">8,430</span>
              </div>
              <div className="bg-slate-800 rounded-2xl p-5 flex justify-between items-center shadow-inner">
                <span className="text-slate-400 font-medium">Calificaciones</span>
                <span className="text-2xl font-bold text-amber-400">3,192 🐾</span>
              </div>
              <div className="bg-slate-800 rounded-2xl p-5 flex justify-between items-center shadow-inner">
                <span className="text-slate-400 font-medium">Leads B2B</span>
                <span className="text-2xl font-bold text-emerald-400">142</span>
              </div>
            </div>
          </div>

        </div>

        {/* Fila Inferior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Columna 1: Controles */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-sm font-bold text-stone-500 tracking-wider mb-6">INFRASTRUCTURE CONTROL</h2>
            <div className="flex flex-col xl:flex-row gap-4 mt-auto">
              <button className="flex-1 py-4 px-6 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-2xl transition-colors shadow-sm flex justify-center items-center gap-2">
                Clear Cache
              </button>
              <button className="flex-1 py-4 px-6 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-2xl transition-colors shadow-sm flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Revalidate Paths
              </button>
            </div>
          </div>

          {/* Columna 2: Live Logs */}
          <div className="bg-[#0A0A0A] text-emerald-400 font-mono text-sm md:text-base rounded-3xl shadow-sm p-6 md:p-8 overflow-hidden flex flex-col border border-stone-800">
            <h2 className="text-emerald-500 font-bold mb-4 tracking-wider flex items-center gap-2 opacity-90">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE INFRASTRUCTURE LOGS
            </h2>
            <div className="space-y-3 opacity-80 flex-1 flex flex-col justify-end mt-4">
              <p>[10:45:01] GET /api/users - <span className="text-blue-400">200 OK</span> - 14ms</p>
              <p>[10:45:03] POST /api/postales - <span className="text-emerald-400">201 CREATED</span> - 120ms</p>
              <p className="text-stone-400">[10:45:04] DB UPDATE: Users table synchronized</p>
              <p>[10:45:08] GET /images/comunidad-V.png - <span className="text-yellow-400">HIT</span> - 2ms</p>
              <p className="text-stone-400">[10:45:10] CRON: Revalidating /destinos - <span className="text-emerald-400">SUCCESS</span></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
