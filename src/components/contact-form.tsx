'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch('/api/contact', { method: 'POST', body: formData });
    setSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitContact} className="space-y-4">
          <Input type="text" name="name" placeholder="Your name" required />
          <Button type="submit" className="w-full">
            Submit
          </Button>
          {submitted && (
            <p className="text-green-600">Form submitted successfully!</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export { ContactForm };
