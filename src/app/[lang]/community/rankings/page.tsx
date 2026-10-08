import RankingsView from '../../../../components/RankingsView';

export default async function RankingsPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const isEn = resolvedParams.lang === 'en';
    
    return (
        <div className="w-full bg-stone-100 min-h-screen pt-4 pb-32">
            <RankingsView isEn={isEn} />
        </div>
    );
}
