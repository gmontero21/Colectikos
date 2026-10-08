export default async function ComingSoonPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const isEn = resolvedParams.lang === 'en';
    
    return (
        <div className="flex-1 w-full relative m-0 p-0 flex items-center justify-center bg-stone-50/50" style={{ minHeight: 'calc(100vh - 80px)' }}>
            <img 
                src={isEn ? "/images/Imagenes_Pagina/comunidad-V-en.png" : "/images/Imagenes_Pagina/comunidad-V.png"} 
                className="block md:hidden absolute inset-0 w-full h-full object-contain object-top" 
                alt={isEn ? "Community" : "Comunidad"}
            />
            <img 
                src={isEn ? "/images/Imagenes_Pagina/comunidad-H-en.png" : "/images/Imagenes_Pagina/comunidad-H.png"} 
                className="hidden md:block absolute inset-0 w-full h-full object-contain object-top" 
                alt={isEn ? "Community" : "Comunidad"}
            />
        </div>
    );
}
