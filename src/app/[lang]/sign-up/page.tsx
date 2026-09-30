import { redirect } from 'next/navigation';

export default async function SignUpRedirectPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(lang === 'en' ? '/en/login?mode=signup' : '/login?mode=signup');
}
