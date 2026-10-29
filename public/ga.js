// Google Analytics 4 bootstrap. app/layout.tsx loads it only when NEXT_PUBLIC_GA_ID is set, passing the id in data-ga-id. It is a file of the site and not an
// inline <script> so the strict Content-Security-Policy (scripts allowed by hash, see scripts/security-headers.mjs) lets it run.
;(function () {
  var id = document.currentScript && document.currentScript.getAttribute("data-ga-id")
  if (!id) return
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag("js", new Date())
  gtag("config", id, { anonymize_ip: true })
})()
