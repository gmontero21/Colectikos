import prisma from '@/lib/prisma';
import { Suspense } from 'react';
import CommunityClient from '@/components/CommunityClient';
import { CommunityPost } from '@prisma/client';
import { getDictionary } from '@/dictionaries/getDictionary';

// Forzar renderizado dinámico para que los datos nuevos aparezcan inmediatamente (opcional pero recomendado para el feed)
export const dynamic = 'force-dynamic';

export default async function CommunityPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const isEn = resolvedParams.lang === 'en';
    
    return (
        <div className="flex-1 w-full relative m-0 p-0 flex items-center justify-center bg-stone-50/50">
            <img 
                src={isEn ? "/images/Imagenes_Pagina/comunidad-V-en.png" : "/images/Imagenes_Pagina/comunidad-V.png"} 
                className="block md:hidden absolute inset-0 w-full h-full object-contain object-top" 
                alt="Comunidad"
            />
            <img 
                src={isEn ? "/images/Imagenes_Pagina/comunidad-H-en.png" : "/images/Imagenes_Pagina/comunidad-H.png"} 
                className="hidden md:block absolute inset-0 w-full h-full object-contain object-top" 
                alt="Comunidad"
            />
        </div>
    );
}

async function CommunityGrid() {
    let posts: CommunityPost[];
    try {
        posts = await prisma.communityPost.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error('Error al cargar la comunidad:', error);
        return (
            <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
                <p className="text-center text-red-600 font-medium">
                    Ocurrió un error al cargar las postales de la comunidad. Por favor, intenta de nuevo más tarde.
                </p>
            </div>
        );
    }

    return <CommunityClient posts={posts} />;
}