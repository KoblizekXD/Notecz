import * as React from 'react';
import { validateRequest } from '@/lib/util';
import { HomePage } from './clientPage';
import { redirect } from 'next/navigation';

export default async function App() {
  const { user } = await validateRequest();

  if (!user) redirect('/signin');

  return <HomePage id={user.id} />;
}
