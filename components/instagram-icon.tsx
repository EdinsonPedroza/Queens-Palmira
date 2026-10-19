import type { SVGProps } from "react"

/*
 * The Instagram glyph. It is lucide's own drawing (same 24×24 outline, same stroke, same classes), kept here because lucide-react deprecated
 * its brand icons ("this icon will be removed in v1.0": the next major version would break the build). The markup is exactly what the
 * lucide component rendered, so nothing changes on screen.
 */
export function InstagramIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={["lucide lucide-instagram", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
