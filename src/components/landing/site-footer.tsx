import { GithubIcon } from '@/components/ui/icons';
import { APP_NAME, REPO } from '@/constants/app';

export function SiteFooter() {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-4 py-6 text-muted-foreground sm:flex-row md:px-6">
      <div className="flex flex-col gap-1 text-center text-sm sm:flex-row sm:text-left">
        <p>
          © 2025 <span className="font-semibold tracking-wide">{APP_NAME}</span>.
        </p>
        <p>
          Developed by <span className="font-semibold tracking-wide">Enrique Vicente</span>.
        </p>
      </div>
      <nav className="flex items-center gap-4">
        <a
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          <GithubIcon className="size-6" />
          <span className="sr-only">GitHub</span>
        </a>
      </nav>
    </footer>
  );
}
