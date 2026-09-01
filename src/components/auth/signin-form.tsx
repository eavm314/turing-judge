'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { signInWithCredentials } from '@/actions/auth';
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
import { Separator } from '@/components/ui/separator';
import { GithubIcon, GoogleIcon } from '@/components/ui/icons';
import { useServerAction } from '@/hooks/use-server-action';
import { handleSignIn } from '@/lib/auth/client-handlers';
import { credentialsSchema, type CredentialsSchema } from '@/lib/schemas/user';

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { execute, loading } = useServerAction(signInWithCredentials);
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);

  const form = useForm<CredentialsSchema>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: CredentialsSchema) => {
    const result = await execute(values);
    if (result) onSuccess?.();
  };

  const onProviderSignIn = async (provider: 'google' | 'github') => {
    setOauthProvider(provider);
    await handleSignIn(provider);
    setOauthProvider(null);
  };

  const disabled = loading || oauthProvider !== null;

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={disabled}
                    {...field}
                  />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={disabled}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          onClick={() => onProviderSignIn('google')}
        >
          {oauthProvider === 'google' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          onClick={() => onProviderSignIn('github')}
        >
          {oauthProvider === 'github' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GithubIcon className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
      </div>
    </div>
  );
}
