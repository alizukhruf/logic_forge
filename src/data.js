import { Briefcase, Palette, ShoppingCart, Smartphone, RefreshCw, Rocket, LifeBuoy, Search, Gauge, ShieldCheck, Headphones, Compass, PenTool, Code2 } from 'lucide-react'

export const SITE = { phone: '923440418249', phoneShow: '+923440418249', email: 'alizukhruf07@gmail.com' }

export const benefits = [
  { icon: Gauge, title: 'Fast & Responsive', text: 'Looks great on all devices and loads quickly.' },
  { icon: ShieldCheck, title: 'Secure & Reliable', text: 'Built with current security practices.' },
  { icon: Palette, title: 'Custom Design', text: 'Unique designs that match your brand.' },
  { icon: Search, title: 'SEO Friendly', text: 'Clean structure that search engines understand.' },
  { icon: ShoppingCart, title: 'E-Commerce Ready', text: 'Sell your products online with ease.' },
  { icon: Headphones, title: 'Ongoing Support', text: "I'm here even after your site goes live." },
]
export const process = [
  { icon: Compass, title: 'Discover', text: 'We learn your goals, audience and requirements.' },
  { icon: PenTool, title: 'Design', text: 'Layouts and visuals shaped around your brand.' },
  { icon: Code2, title: 'Develop', text: 'Clean, responsive code built and tested.' },
  { icon: Rocket, title: 'Launch', text: 'Deployment help and a smooth go-live.' },
]
export const services = [
  { icon: Briefcase, title: 'Business Website Development', text: 'Professional websites for small businesses, startups, and service providers.' },
  { icon: Palette, title: 'Custom Website Design', text: "Unique layouts and visual experiences tailored to a business's brand." },
  { icon: ShoppingCart, title: 'E-Commerce Website Development', text: 'Online stores with product listings, shopping carts, and order management.' },
  { icon: Smartphone, title: 'Responsive Web Development', text: 'Websites optimized for desktop, tablet, and mobile devices.' },
  { icon: RefreshCw, title: 'Website Redesign', text: 'Modernize outdated websites with better design, usability, and performance.' },
  { icon: Rocket, title: 'Landing Page Development', text: 'Conversion-focused pages for marketing campaigns and promotions.' },
  { icon: LifeBuoy, title: 'Website Maintenance and Support', text: 'Ongoing improvements, bug fixes, updates, and technical assistance.' },
  { icon: Search, title: 'SEO-Friendly Website Development', text: 'Clean structure, accessible content, semantic HTML, and search-friendly foundations.' },
]
// Edit prices here
export const pricing = [
  { name: 'Starter Website', price: 'PKR 25,000', prefix: '', features: ['Up to 5 pages', 'Responsive layout', 'Contact form interface', 'Basic on-page SEO setup', 'Basic deployment assistance'] },
  { name: 'Business Website', price: 'PKR 50,000', prefix: '', featured: true, features: ['Up to 10 pages', 'Custom design', 'Responsive layouts', 'Contact form integration', 'SEO-friendly structure', 'Deployment assistance'] },
  { name: 'E-Commerce Website', price: 'PKR 80,000', prefix: 'Starting at', features: ['Product catalog', 'Shopping cart', 'Order management', 'Responsive storefront', 'Admin features based on project requirements', 'Deployment assistance'] },
]
export const faqs = [
  ['Are these final prices?', 'No. They are starting estimates and depend on project scope. Send your requirements for a clear quote.'],
  ['How long will my project take?', 'Timelines depend on scope and how quickly content and feedback arrive. A timeline is confirmed after we review your requirements.'],
  ['How many revisions are included?', 'Revision rounds are agreed on before work starts, based on the project.'],
  ['Are hosting and domain included?', 'No. Hosting, domains, paid plugins and third-party subscriptions are not included unless explicitly agreed.'],
  ['Is maintenance included?', 'Ongoing maintenance is not included by default. It can be arranged separately.'],
]
// Add portfolio projects here. All are demo concepts.
export const projects = [
  { slug: 'business-website', name: 'Corporate Business Website', cat: 'Business', g: 'from-dark to-electric', desc: 'A polished multi-page company site concept.', tech: ['React', 'Tailwind CSS', 'Framer Motion'], goals: ['Build trust quickly', 'Present services clearly', 'Drive enquiries'], features: ['Service pages', 'Team section', 'Contact form', 'SEO-friendly structure'] },
  { slug: 'ecommerce-store', name: 'E-Commerce Store', cat: 'E-Commerce', g: 'from-navy to-cyan', desc: 'An online storefront concept with cart flow.', tech: ['React', 'Tailwind CSS', 'React Router'], goals: ['Simple product discovery', 'Frictionless cart', 'Mobile-first shopping'], features: ['Product catalog', 'Shopping cart', 'Category filters', 'Order summary'] },
  { slug: 'personal-portfolio', name: 'Personal Portfolio', cat: 'Portfolio', g: 'from-electric to-navy', desc: 'A clean portfolio concept for creatives and professionals.', tech: ['React', 'Framer Motion'], goals: ['Showcase work', 'Stand out visually', 'Make contact easy'], features: ['Project gallery', 'About section', 'Smooth animations', 'Contact links'] },
  { slug: 'restaurant-website', name: 'Restaurant Website', cat: 'Business', g: 'from-dark to-cyan', desc: 'A menu-focused restaurant site concept.', tech: ['React', 'Tailwind CSS'], goals: ['Show the menu beautifully', 'Encourage reservations', 'Work great on phones'], features: ['Menu sections', 'Gallery', 'Opening hours', 'Reservation inquiry'] },
  { slug: 'saas-landing-page', name: 'SaaS Landing Page', cat: 'Landing Pages', g: 'from-navy to-electric', desc: 'A conversion-focused product landing page concept.', tech: ['React', 'Tailwind CSS', 'Framer Motion'], goals: ['Explain value fast', 'Lead to sign-up', 'Look credible'], features: ['Hero with CTA', 'Feature grid', 'Pricing section', 'FAQ'] },
  { slug: 'local-service-website', name: 'Local Service Business Website', cat: 'Business', g: 'from-electric to-dark', desc: 'A lead-focused site concept for local service providers.', tech: ['React', 'Tailwind CSS'], goals: ['Make calling easy', 'List services clearly', 'Build local trust'], features: ['Service list', 'Click-to-call', 'WhatsApp button', 'Contact form'] },
]
