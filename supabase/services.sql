create table if not exists public.site_services (
  slug text primary key,
  title text not null,
  summary text not null,
  details text not null,
  icon text not null default 'Briefcase',
  features text[] not null default '{}',
  display_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.site_services enable row level security;

drop policy if exists "Public can view active services" on public.site_services;
drop policy if exists "Authenticated users can manage services" on public.site_services;
drop policy if exists "Admins can manage services" on public.site_services;

create policy "Public can view active services"
on public.site_services
for select
to anon, authenticated
using (is_active or public.is_site_admin());

create policy "Admins can manage services"
on public.site_services
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

grant usage on schema public to anon, authenticated;
grant select on public.site_services to anon, authenticated;
grant insert, update, delete on public.site_services to authenticated;

insert into public.site_services
  (slug, title, summary, details, icon, features, display_order, is_active)
values
  ('business-website-development', 'Business Website Development', 'Professional websites for small businesses, startups, and service providers.', 'A professional, easy-to-manage website that explains what your business does, builds trust, and helps turn visitors into enquiries.', 'Briefcase', array['Custom page layout', 'Mobile responsive design', 'Service and about pages', 'Contact and enquiry pathways'], 1, true),
  ('custom-website-design', 'Custom Website Design', 'Unique layouts and visual experiences tailored to a business''s brand.', 'A distinctive visual system and page experience shaped around your brand, audience, and business goals.', 'Palette', array['Brand-aligned visual direction', 'Page layouts and components', 'Typography and color system', 'Responsive design states'], 2, true),
  ('e-commerce-website-development', 'E-Commerce Website Development', 'Online stores with product listings, shopping carts, and order management.', 'A customer-friendly storefront that makes it straightforward to browse products, place orders, and manage your online catalog.', 'ShoppingCart', array['Product catalog and categories', 'Cart and checkout experience', 'Order-management requirements', 'Mobile storefront optimization'], 3, true),
  ('responsive-web-development', 'Responsive Web Development', 'Websites optimized for desktop, tablet, and mobile devices.', 'Accessible, responsive implementation that adapts to the screens your customers use while keeping the experience clear and fast.', 'Smartphone', array['Mobile-first layouts', 'Tablet and desktop breakpoints', 'Accessible semantic markup', 'Cross-device quality checks'], 4, true),
  ('website-redesign', 'Website Redesign', 'Modernize outdated websites with better design, usability, and performance.', 'Refresh your existing website with a clearer structure and modern presentation while preserving the content and functionality that matter.', 'RefreshCw', array['Current-site review', 'Updated visual design', 'Improved page structure', 'Responsive and performance review'], 5, true),
  ('landing-page-development', 'Landing Page Development', 'Conversion-focused pages for marketing campaigns and promotions.', 'A focused campaign page that communicates one clear offer, answers key questions, and guides visitors toward a useful next step.', 'Rocket', array['Campaign-specific messaging', 'Clear calls to action', 'Benefits and trust sections', 'Responsive implementation'], 6, true),
  ('website-maintenance-and-support', 'Website Maintenance and Support', 'Ongoing improvements, bug fixes, updates, and technical assistance.', 'Ongoing help to keep your site dependable and make practical improvements as your business and content evolve.', 'LifeBuoy', array['Content and page updates', 'Bug investigation and fixes', 'Dependency and compatibility review', 'Agreed support and response scope'], 7, true),
  ('seo-friendly-website-development', 'SEO-Friendly Website Development', 'Clean structure, accessible content, semantic HTML, and search-friendly foundations.', 'A strong technical foundation that helps people and search engines understand your pages. Search rankings are not guaranteed.', 'Search', array['Semantic page structure', 'Editable page titles and descriptions', 'Accessible content patterns', 'Performance-minded implementation'], 8, true)
on conflict (slug) do nothing;
