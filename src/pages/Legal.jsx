import { Seo } from '../components'

function LegalPage({ title, description, children }) {
  return (
    <>
      <Seo title={title} desc={description} />
      <section className="py-16 sm:py-20">
        <article className="wrap max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-cyan">Draft for review</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">{title}</h1>
          <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-300/10 p-4 text-sm text-white/75">
            This draft is general website information, not legal advice. Have it reviewed for your business and applicable laws before relying on it.
          </p>
          <div className="prose prose-invert mt-8 max-w-none prose-headings:text-white prose-p:text-white/70 prose-li:text-white/70 prose-a:text-cyan">
            {children}
          </div>
        </article>
      </section>
    </>
  )
}

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" description="Draft privacy information for Logic Forge website visitors and account holders.">
      <h2>Information you provide</h2>
      <p>When you send a project inquiry, we receive the name, email address, optional phone number, selected service, and project details you submit. If you create an account, we also process your account email and profile information, along with messages and inquiry status associated with that account.</p>
      <h2>How information is used</h2>
      <p>Information is used to respond to project requests, manage customer accounts and conversations, provide requested services, and operate the website. Do not include payment-card information or sensitive personal information in inquiry messages.</p>
      <h2>Service providers and storage</h2>
      <p>The website uses Supabase for authentication and application data and Vercel for hosting. Information submitted through the site may be processed by those providers to operate the services. Their terms and privacy practices also apply to their processing.</p>
      <h2>Access, correction, and deletion requests</h2>
      <p>You may request access to, correction of, or deletion of information you submitted by emailing <a href="mailto:alizukhruf07@gmail.com">alizukhruf07@gmail.com</a>. We may need to retain some information where required to complete a service, resolve a dispute, or meet a legal obligation.</p>
      <h2>Security and retention</h2>
      <p>Reasonable technical and organizational measures are used to protect information. No online service can guarantee absolute security. Information is retained as needed to operate accounts, respond to requests, and meet applicable obligations; a specific retention schedule should be confirmed before publication.</p>
      <h2>Changes and contact</h2>
      <p>This draft may be updated as the website and its data practices change. Questions or privacy requests can be sent to <a href="mailto:alizukhruf07@gmail.com">alizukhruf07@gmail.com</a>.</p>
    </LegalPage>
  )
}

export function TermsOfService() {
  return (
    <LegalPage title="Terms of Service" description="Draft website and service terms for Logic Forge, subject to review and a separate project agreement.">
      <h2>Website information</h2>
      <p>This website describes Logic Forge services and starting price estimates. Prices, features, availability, and examples are informational and do not create a project agreement. Portfolio items identified as concepts are illustrative examples, not completed client work.</p>
      <h2>Project agreements</h2>
      <p>Before paid work begins, the client and Logic Forge should agree in writing on deliverables, scope, price, payment schedule, milestones, revision rounds, responsibilities, and any cancellation terms. The written project agreement controls if it differs from this website.</p>
      <h2>Client-provided materials</h2>
      <p>Clients are responsible for ensuring they have the rights and permissions needed for content, images, branding, and other materials they provide. Project content and functionality remain subject to the agreed scope.</p>
      <h2>Third-party services and ongoing support</h2>
      <p>Domains, hosting, paid software, third-party subscriptions, and ongoing maintenance are excluded unless expressly included in a written project agreement. Third-party services are subject to their own terms and availability.</p>
      <h2>Using this website</h2>
      <p>Do not misuse the website, attempt unauthorized access, interfere with its operation, or submit unlawful or harmful content. Website content is provided as-is for general information and may change without notice.</p>
      <h2>Contact</h2>
      <p>For questions about these draft terms, contact <a href="mailto:alizukhruf07@gmail.com">alizukhruf07@gmail.com</a>. These draft terms should be reviewed and finalized before publication.</p>
    </LegalPage>
  )
}
