export function BrandLogo({ className = "" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src={`${basePath}/psv-logo.png`}
      alt="Logo des Polizei-Sport-Vereins Düsseldorf"
      width={1024}
      height={1024}
    />
  );
}
