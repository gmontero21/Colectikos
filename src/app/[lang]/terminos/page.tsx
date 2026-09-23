import React from 'react';
import { getDictionary } from '../../../dictionaries/getDictionary';

export default async function TerminosPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'es' | 'en';
  const dict = await getDictionary(lang);
  const t = dict.terminos;

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-stone-800 pb-20 pt-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-100">
        <h1 className="text-3xl font-serif italic text-emerald-900 mb-6 text-center">
          {t.title}
        </h1>
        <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-10"></div>
        
        <div className="max-w-3xl mx-auto text-left px-6 py-8 text-stone-700 leading-relaxed space-y-6">
          <section>
            <h2 className="text-emerald-900 font-semibold text-lg mb-2">{t.sec1Title}</h2>
            <p>
              {t.sec1Desc}
            </p>
          </section>

          <section>
            <h2 className="text-emerald-900 font-semibold text-lg mb-2">{t.sec2Title}</h2>
            <p>
              {t.sec2Desc}
            </p>
          </section>

          <section>
            <h2 className="text-emerald-900 font-semibold text-lg mb-2">{t.sec3Title}</h2>
            <p>
              {t.sec3Desc}
            </p>
          </section>

          <section>
            <h2 className="text-emerald-900 font-semibold text-lg mb-2">{t.sec4Title}</h2>
            <p>
              {t.sec4Desc}
            </p>
          </section>

          <section>
            <h2 className="text-emerald-900 font-semibold text-lg mb-2">{t.sec5Title}</h2>
            <p>
              {t.sec5Desc}
            </p>
          </section>

          <section>
            <h2 className="text-emerald-900 font-semibold text-lg mb-2">{t.sec6Title}</h2>
            <p>
              {t.sec6Desc}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
