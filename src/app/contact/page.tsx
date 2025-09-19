import { ContactForm } from '@/components/contact-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { revalidatePath } from 'next/cache';

const submitContact = async (data: FormData) => {
  'use server';
  const name = data.get('name')?.toString() ?? '';
  console.log('name :', name);

  revalidatePath('/'); //TODO read more about
};

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center p-8">
      <h3 className="mb-4">server action</h3>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={submitContact} className="space-y-4">
            <Input type="text" name="name" placeholder="Your name" required />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      <h3 className="mt-16 mb-4">client action</h3>
      <ContactForm />
    </div>
  );
}
