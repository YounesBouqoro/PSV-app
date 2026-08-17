import type { Metadata, Viewport } from "next";
import "./globals.css";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/PSV-app" : "";

export const metadata: Metadata = {
  title: { default: "PSV Team-App", template: "%s · PSV Team-App" },
  description: "Termine, Kader und Mannschaftsorganisation beim PSV Düsseldorf.",
  manifest: `${basePath}/manifest.webmanifest`,
  other: { "codex-preview": "development" },
  icons: { icon: `${basePath}/psv-logo.png`, shortcut: `${basePath}/psv-logo.png`, apple: `${basePath}/psv-logo.png` },
};

export const viewport: Viewport = {
  themeColor: "#497b30",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
