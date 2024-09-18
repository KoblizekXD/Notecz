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
import { elysia } from '@/lib/util';
import { treaty } from '@elysiajs/eden';

const typ = t.Object({
  username: t.String({ minLength: 3, maxLength: 20 }),
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 8 }),
});

export default function SignUp() {
  const onSubmit = async (data: any) => {
    const t = treaty<typeof elysia>('localhost:3000');
    const resp = await t.api.auth.signup.post({
      username: data.username,
      email: data.email,
      password: data.password,
    });
    console.log(resp);
  };

  const form = useForm<typeof typ>({
    resolver: typeboxResolver(typ),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

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
            name="email"
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
          <Button className='flex justify-center items-center font-bold' variant={'secondary'} type="submit">Jdeme na to!</Button>
        </form>
      </Form>
    </main>
  );
}
