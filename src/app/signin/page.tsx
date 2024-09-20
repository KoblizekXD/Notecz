import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { logger, lucia } from '@/lib/util';
import { Toaster } from '@/components/ui/sonner';
import { SignInForm } from './signin-form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignUp() {
  const cookie = cookies().get(lucia.sessionCookieName);

  if (cookie && (await lucia.validateSession(cookie.value)).session) {
    logger.info('User is already signed in, redirecting to /app');
    redirect('/app');
  }

  return (
    <main
      className={
        'flex justify-center items-center h-screen bg-no-repeat bg-cover bg-[url("/wave-haikei-2.svg")]'
      }
    >
      <Toaster className="bg-red-400" />
      <Link href={'/'}>
        <ArrowLeftIcon className="absolute top-4 left-4 cursor-pointer" />
      </Link>
      <SignInForm />
    </main>
  );
}
