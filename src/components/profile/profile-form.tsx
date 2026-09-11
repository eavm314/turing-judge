'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { updateProfileAction } from '@/actions/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useServerAction } from '@/hooks/use-server-action';
import { profileSchema, type ProfileSchema } from '@/lib/schemas/user';

interface ProfileFormProps {
  name: string | null;
  image: string | null;
}

export function ProfileForm({ name, image }: ProfileFormProps) {
  const { execute: updateProfile, loading } = useServerAction(updateProfileAction);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: name ?? '' },
  });

  const nameValue = useWatch({ control: form.control, name: 'name' });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(values => updateProfile(values))} className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={image ?? undefined} alt={nameValue} className="object-cover" />
            <AvatarFallback className="font-bold text-2xl">{nameValue?.charAt(0)}</AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
