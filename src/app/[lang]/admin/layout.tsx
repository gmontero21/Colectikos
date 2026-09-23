import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const ADMIN_EMAILS = ['gmontero21@gmail.com'];

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const user = await currentUser();

  // Si no está logueado, lo mandamos al login
  if (!user) {
    redirect(`/${resolvedParams.lang}/login`);
  }

  // Buscamos si alguno de los correos de Clerk coincide con nuestra lista VIP
  const hasAdminEmail = user.emailAddresses.some((emailObj) =>
    ADMIN_EMAILS.includes(emailObj.emailAddress.toLowerCase())
  );

  // Si no es admin, lo mandamos al home o perfil
  if (!hasAdminEmail) {
    redirect(`/${resolvedParams.lang}/profile`);
  }

  // Si pasa ambos bloqueos, renderizamos el contenido
  return <>{children}</>;
}
