import { Seo, Btn } from '../components'

export function NotFound() {
  return (<>
    <Seo title="Page Not Found" desc="This page could not be found." />
    <section className="dark-bg py-28 text-center"><div className="wrap"><p className="text-7xl font-extrabold text-cyan">404</p><h1 className="mt-2 text-3xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-white/70">The page you're looking for doesn't exist.</p><div className="mt-8"><Btn to="/">Back to Home</Btn></div></div></section>
  </>)
}
