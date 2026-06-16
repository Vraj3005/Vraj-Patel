import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-card-border py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-sm font-medium text-secondary">
          © {new Date().getFullYear()} Vraj Patel
        </span>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 w-9 rounded-lg border border-card-border bg-card-bg hover:bg-white/5 flex items-center justify-center text-secondary hover:text-foreground transition-colors cursor-pointer"
            title="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 w-9 rounded-lg border border-card-border bg-card-bg hover:bg-white/5 flex items-center justify-center text-secondary hover:text-foreground transition-colors cursor-pointer"
            title="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:patelvrajpatel30@gmail.com"
            className="h-9 w-9 rounded-lg border border-card-border bg-card-bg hover:bg-white/5 flex items-center justify-center text-secondary hover:text-foreground transition-colors cursor-pointer"
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
