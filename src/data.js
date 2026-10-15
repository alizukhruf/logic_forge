import { Briefcase, Palette, ShoppingCart, Smartphone, RefreshCw, Rocket, LifeBuoy, Search, Gauge, ShieldCheck, Headphones, Compass, PenTool, Code2 } from 'lucide-react'
import businessImage from './assets/site-showcase/business.svg'
import ecommerceImage from './assets/site-showcase/ecommerce.svg'
import portfolioImage from './assets/site-showcase/portfolio.svg'
import restaurantImage from './assets/site-showcase/restaurant.svg'
import saasImage from './assets/site-showcase/saas.svg'
import localServiceImage from './assets/site-showcase/local-service.svg'

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
  { slug: 'business-website-development', icon: Briefcase, iconName: 'Briefcase', title: 'Business Website Development', text: 'Professional websites for small businesses, startups, and service providers.', details: 'A professional, easy-to-manage website that explains what your business does, builds trust, and helps turn visitors into enquiries.', features: ['Custom page layout', 'Mobile responsive design', 'Service and about pages', 'Contact and enquiry pathways'], displayOrder: 1, isActive: true },
  { slug: 'custom-website-design', icon: Palette, iconName: 'Palette', title: 'Custom Website Design', text: "Unique layouts and visual experiences tailored to a business's brand.", details: 'A distinctive visual system and page experience shaped around your brand, audience, and business goals.', features: ['Brand-aligned visual direction', 'Page layouts and components', 'Typography and color system', 'Responsive design states'], displayOrder: 2, isActive: true },
  { slug: 'e-commerce-website-development', icon: ShoppingCart, iconName: 'ShoppingCart', title: 'E-Commerce Website Development', text: 'Online stores with product listings, shopping carts, and order management.', details: 'A customer-friendly storefront that makes it straightforward to browse products, place orders, and manage your online catalog.', features: ['Product catalog and categories', 'Cart and checkout experience', 'Order-management requirements', 'Mobile storefront optimization'], displayOrder: 3, isActive: true },
  { slug: 'responsive-web-development', icon: Smartphone, iconName: 'Smartphone', title: 'Responsive Web Development', text: 'Websites optimized for desktop, tablet, and mobile devices.', details: 'Accessible, responsive implementation that adapts to the screens your customers use while keeping the experience clear and fast.', features: ['Mobile-first layouts', 'Tablet and desktop breakpoints', 'Accessible semantic markup', 'Cross-device quality checks'], displayOrder: 4, isActive: true },
  { slug: 'website-redesign', icon: RefreshCw, iconName: 'RefreshCw', title: 'Website Redesign', text: 'Modernize outdated websites with better design, usability, and performance.', details: 'Refresh your existing website with a clearer structure and modern presentation while preserving the content and functionality that matter.', features: ['Current-site review', 'Updated visual design', 'Improved page structure', 'Responsive and performance review'], displayOrder: 5, isActive: true },
  { slug: 'landing-page-development', icon: Rocket, iconName: 'Rocket', title: 'Landing Page Development', text: 'Conversion-focused pages for marketing campaigns and promotions.', details: 'A focused campaign page that communicates one clear offer, answers key questions, and guides visitors toward a useful next step.', features: ['Campaign-specific messaging', 'Clear calls to action', 'Benefits and trust sections', 'Responsive implementation'], displayOrder: 6, isActive: true },
  { slug: 'website-maintenance-and-support', icon: LifeBuoy, iconName: 'LifeBuoy', title: 'Website Maintenance and Support', text: 'Ongoing improvements, bug fixes, updates, and technical assistance.', details: 'Ongoing help to keep your site dependable and make practical improvements as your business and content evolve.', features: ['Content and page updates', 'Bug investigation and fixes', 'Dependency and compatibility review', 'Agreed support and response scope'], displayOrder: 7, isActive: true },
  { slug: 'seo-friendly-website-development', icon: Search, iconName: 'Search', title: 'SEO-Friendly Website Development', text: 'Clean structure, accessible content, semantic HTML, and search-friendly foundations.', details: 'A strong technical foundation that helps people and search engines understand your pages. Search rankings are not guaranteed.', features: ['Semantic page structure', 'Editable page titles and descriptions', 'Accessible content patterns', 'Performance-minded implementation'], displayOrder: 8, isActive: true },
]
// Edit prices here
export const pricing = [
  { name: 'Starter Website', price: 'PKR 25,000', prefix: '', features: ['Up to 5 pages', 'Responsive layout', 'Contact form interface', 'Basic on-page SEO setup', 'Basic deployment assistance'] },
  { name: 'Business Website', price: 'PKR 30,000', prefix: '', featured: true, features: ['Up to 10 pages', 'Custom design', 'Responsive layouts', 'Contact form integration', 'SEO-friendly structure', 'Deployment assistance'] },
  { name: 'E-Commerce Website', price: 'PKR 50,000', prefix: 'Starting at', features: ['Product catalog', 'Shopping cart', 'Order management', 'Responsive storefront', 'Admin features based on project requirements', 'Deployment assistance'] },
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
  { slug: 'business-website', name: 'Corporate Business Website', cat: 'Business', imageSrc: businessImage, imagePath: 'business.svg', imageMime: 'image/svg+xml', imageAlt: 'Original Northstar corporate consulting website screenshot concept', g: 'from-dark to-electric', desc: 'A polished multi-page company site concept.', tech: ['React', 'Tailwind CSS', 'Framer Motion'], goals: ['Build trust quickly', 'Present services clearly', 'Drive enquiries'], features: ['Service pages', 'Team section', 'Contact form', 'SEO-friendly structure'] },
  { slug: 'ecommerce-store', name: 'E-Commerce Store', cat: 'E-Commerce', imageSrc: ecommerceImage, imagePath: 'ecommerce.svg', imageMime: 'image/svg+xml', imageAlt: 'Original Forme online retail storefront screenshot concept', g: 'from-navy to-cyan', desc: 'An online storefront concept with cart flow.', tech: ['React', 'Tailwind CSS', 'React Router'], goals: ['Simple product discovery', 'Frictionless cart', 'Mobile-first shopping'], features: ['Product catalog', 'Shopping cart', 'Category filters', 'Order summary'] },
  { slug: 'personal-portfolio', name: 'Personal Portfolio', cat: 'Portfolio', imageSrc: portfolioImage, imagePath: 'portfolio.svg', imageMime: 'image/svg+xml', imageAlt: 'Original Maya designer portfolio website screenshot concept', g: 'from-electric to-navy', desc: 'A clean portfolio concept for creatives and professionals.', tech: ['React', 'Framer Motion'], goals: ['Showcase work', 'Stand out visually', 'Make contact easy'], features: ['Project gallery', 'About section', 'Smooth animations', 'Contact links'] },
  { slug: 'restaurant-website', name: 'Restaurant Website', cat: 'Restaurant', imageSrc: restaurantImage, imagePath: 'restaurant.svg', imageMime: 'image/svg+xml', imageAlt: 'Original Ember and Oak restaurant website screenshot concept', g: 'from-dark to-cyan', desc: 'A menu-focused restaurant site concept.', tech: ['React', 'Tailwind CSS'], goals: ['Show the menu beautifully', 'Encourage reservations', 'Work great on phones'], features: ['Menu sections', 'Gallery', 'Opening hours', 'Reservation inquiry'] },
  { slug: 'saas-landing-page', name: 'SaaS Landing Page', cat: 'SaaS', imageSrc: saasImage, imagePath: 'saas.svg', imageMime: 'image/svg+xml', imageAlt: 'Original Pulse software-as-a-service landing page screenshot concept', g: 'from-navy to-electric', desc: 'A conversion-focused product landing page concept.', tech: ['React', 'Tailwind CSS', 'Framer Motion'], goals: ['Explain value fast', 'Lead to sign-up', 'Look credible'], features: ['Hero with CTA', 'Feature grid', 'Pricing section', 'FAQ'] },
  { slug: 'local-service-website', name: 'Local Service Business Website', cat: 'Local Services', imageSrc: localServiceImage, imagePath: 'local-service.svg', imageMime: 'image/svg+xml', imageAlt: 'Original Goodhand Home local services website screenshot concept', g: 'from-electric to-dark', desc: 'A lead-focused site concept for local service providers.', tech: ['React', 'Tailwind CSS'], goals: ['Make calling easy', 'List services clearly', 'Build local trust'], features: ['Service list', 'Click-to-call', 'WhatsApp button', 'Contact form'] },
]
