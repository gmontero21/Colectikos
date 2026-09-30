import React from 'react';
import { getDictionary } from '../../../dictionaries/getDictionary';

export default async function TerminosPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'es' | 'en';
  const dict = await getDictionary(lang);
  const t = dict.terminos;

  const sections = [
    { title: t.sec1Title, desc: t.sec1Desc },
    { title: t.sec2Title, desc: t.sec2Desc },
    { title: t.sec3Title, desc: t.sec3Desc },
    { title: t.sec4Title, desc: t.sec4Desc },
    { title: t.sec5Title, desc: t.sec5Desc },
    { title: t.sec6Title, desc: t.sec6Desc },
    { title: (t as any).sec7Title, desc: (t as any).sec7Desc },
    { title: (t as any).sec8Title, desc: (t as any).sec8Desc },
    { title: (t as any).sec9Title, desc: (t as any).sec9Desc },
    { title: (t as any).sec10Title, desc: (t as any).sec10Desc },
    { title: (t as any).sec11Title, desc: (t as any).sec11Desc },
    { title: (t as any).sec12Title, desc: (t as any).sec12Desc },
  ].filter(s => s.title && s.desc);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-stone-800 pb-20 pt-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-100">
        <h1 className="text-3xl font-serif italic text-emerald-900 mb-6 text-center">
          {t.title}
        </h1>
        <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-10"></div>
        
        <div className="max-w-3xl mx-auto text-left px-2 sm:px-6 py-4 text-stone-700 leading-relaxed space-y-6">
          {sections.map((sec, idx) => (
            <section key={idx} className="border-b border-stone-100 pb-6 last:border-b-0">
              <h2 className="text-emerald-900 font-semibold text-lg mb-2">{sec.title}</h2>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                {sec.desc}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
