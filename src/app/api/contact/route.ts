import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = formData.get('name')?.toString();

  console.log('API received:', name);

  return NextResponse.json({ success: true, name });
}

export async function GET() {
  return NextResponse.json({ message: 'Contact API is live' });
}
