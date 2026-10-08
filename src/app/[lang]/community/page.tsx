import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CommunityHubPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const isEn = resolvedParams.lang === 'en';
    const lang = resolvedParams.lang;
    
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
            <h1 className="text-4xl md:text-5xl font-black text-emerald-800 mb-2 drop-shadow-sm text-center">
                {isEn ? "Community" : "Comunidad"}
            </h1>
            <p className="text-stone-600 text-lg md:text-xl mb-12 text-center max-w-2xl">
                {isEn 
                    ? "Connect with other explorers, share your notes, and see who's leading the adventure."
                    : "Conecta con otros exploradores, comparte tus notas y descubre quién lidera la aventura."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                
                {/* Rankings Card */}
                <Link href={`/${lang}/community/rankings`} className="group">
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="bg-emerald-100 text-emerald-600 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-inner relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                <path d="M4 22h16"></path>
                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-emerald-800 mb-3 relative z-10">
                            {isEn ? "Global Rankings" : "Rankings Globales"}
                        </h2>
                        <p className="text-stone-600 relative z-10">
                            {isEn 
                                ? "Compete with other explorers and become the top traveler of Colectikos."
                                : "Compite con otros exploradores y conviértete en el mejor viajero de Colectikos."}
                        </p>
                    </div>
                </Link>

                {/* Coming Soon / Feed Card */}
                <Link href={`/${lang}/community/proximamente`} className="group">
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-sky-100 p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-sky-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="bg-sky-100 text-sky-600 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-inner relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 6.1H3"></path>
                                <path d="M21 12.1H3"></path>
                                <path d="M15.1 18H3"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-sky-800 mb-3 relative z-10">
                            {isEn ? "Community Feed" : "Muro Comunitario"}
                        </h2>
                        <p className="text-stone-600 relative z-10">
                            {isEn 
                                ? "See what other explorers are doing. New features coming soon!"
                                : "Mira lo que otros exploradores están haciendo. ¡Nuevas funciones pronto!"}
                        </p>
                    </div>
                </Link>

            </div>
        </div>
    );
}