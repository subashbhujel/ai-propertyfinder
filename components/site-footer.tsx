export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Investment Property Analyzer. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">Built with Next.js, TypeScript, and Tailwind CSS</p>
      </div>
    </footer>
  )
}

