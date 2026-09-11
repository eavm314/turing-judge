'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { changePasswordAction } from '@/actions/users';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useServerAction } from '@/hooks/use-server-action';
import { passwordFormSchema, type PasswordFormSchema } from '@/lib/schemas/user';

export function PasswordSection({ hasPassword }: { hasPassword: boolean }) {
  const changePassword = useServerAction(changePasswordAction);

  const schema = hasPassword
    ? passwordFormSchema.refine(values => !!values.currentPassword, {
        message: 'Current password is required.',
        path: ['currentPassword'],
      })
    : passwordFormSchema;

  const form = useForm<PasswordFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: PasswordFormSchema) => {
    const result = await changePassword.execute({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    if (result) form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hasPassword ? 'Change Password' : 'Set Password'}</CardTitle>
        <CardDescription>
          {hasPassword
            ? 'Update the password you use to sign in.'
            : 'Add a password to enable email and password sign-in.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {hasPassword && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={changePassword.loading}>
              {changePassword.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {hasPassword ? 'Change Password' : 'Set Password'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
