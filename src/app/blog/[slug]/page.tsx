interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Blog: {slug}</h1>
    </div>
  );
}
