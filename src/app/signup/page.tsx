'use client';
import { t } from 'elysia';
import { typeboxResolver } from '@hookform/resolvers/typebox';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

const typ = t.Object({
  t: t.String(),
});

export default function SignUp() {
  const form = useForm({
    resolver: typeboxResolver(typ),
  });

  const onSubmit = (data: any) => {};

  return (
    <main className={'flex justify-center items-center h-screen bg-no-repeat bg-cover bg-[url("/wave-haikei-2.svg")]'}>
      <Link href={'/'}>
        <ArrowLeftIcon className='absolute top-4 left-4 cursor-pointer' />
      </Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-8 rounded-xl">
          <h1 className='font-extrabold text-xl'>Vytvořit účet</h1>
          <h2>Nezapoměň si vybrat silné heslo, které nikdo neuhádne!</h2>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uživatelské jméno</FormLabel>
                <FormControl>
                  <Input placeholder="Jen" {...field} />
                </FormControl>
                <FormDescription>
                  Tvoje veřejné jméno, které budeš používat na Notecz.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heslo</FormLabel>
                <FormControl>
                  <Input placeholder="Něco silného..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='flex justify-center items-center' variant={'secondary'} type="submit">Jdeme na to!</Button>
        </form>
      </Form>
    </main>
  );
}
