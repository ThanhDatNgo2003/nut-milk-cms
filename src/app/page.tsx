export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Nut Milk</h1>
      <p className="text-xl text-muted-foreground">
        Fresh, Natural, Delicious
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
