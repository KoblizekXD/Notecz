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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function SignInForm() {

  const router = useRouter();

  const typ = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String(),
  });

  const onSubmit = async (data: any) => {
    const t = treaty<typeof elysia>('localhost:3000');
    const resp = await t.api.auth.signin.post({
      email: data.email,
      password: data.password,
    });

    if (resp.status === 409) {
      toast.error('Email nebo uživatelské jméno je již zabrané!');
    } else if (resp.status === 200) {
      router.push('/home');
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
        <h1 className="font-extrabold text-xl">Přihlášení</h1>
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
                <Input type='password' placeholder="Tvoje heslo" {...field} />
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
          Přihlásit se
        </Button>
      </form>
    </Form>
  );
}
