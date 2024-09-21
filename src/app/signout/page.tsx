import { logger, lucia } from '@/lib/util';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignOut() {
  const cookie = cookies().get(lucia.sessionCookieName);

  if (cookie) {
    const session = await lucia.validateSession(cookie.value);

    if (session.session) {
      logger.info(`User ${session.user.id} has signed out`);
      lucia.invalidateSession(cookie.value);
      redirect('/?signedOut=true');
    }
  }

  logger.warn('Someone tried to sign out without being signed in(sneaky)');
  redirect('/?signedOut=false');
}
