'use client';

import { elysia } from '@/lib/util';
import { treaty } from '@elysiajs/eden';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { t } from 'elysia';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import { Input } from '@/components/ui/input';

export function SignUpForm() {
  const typ = t.Object({
    username: t.String({ minLength: 3, maxLength: 20 }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8 }),
  });

  const onSubmit = async (data: any) => {
    const t = treaty<typeof elysia>('localhost:3000');
    const resp = await t.api.auth.signup.post({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    if (resp.status === 409) {
      toast.error('Email nebo uživatelské jméno je již zabrané!');
    }
  };

  const form = useForm<typeof typ>({
    resolver: typeboxResolver(typ),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border p-8 rounded-xl bg-[#0A0A0A]"
      >
        <h1 className="font-extrabold text-xl">Vytvořit účet</h1>
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
                <Input
                  type="password"
                  placeholder="Něco silného..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="flex justify-center items-center font-bold"
          variant={'secondary'}
          type="submit"
        >
          Jdeme na to!
        </Button>
      </form>
    </Form>
  );
}
