import type { GuideNavItem } from '../../types';

export const vaultcdnGuides: GuideNavItem[] = [
  { slug: 'overview', title: 'Overview', order: 1 },
  { slug: 'features', title: 'Features', order: 2 },
  { slug: 'tech-stack', title: 'Tech Stack', order: 3 },
  { slug: 'architecture', title: 'Architecture', order: 4 },
  { slug: 'prerequisites', title: 'Prerequisites', order: 5 },
  { slug: 'quick-start', title: 'Quick Start', order: 6 },
  { slug: 'discord-setup', title: 'Discord Setup', order: 7 },
  { slug: 'environment-variables', title: 'Environment Variables', order: 8 },
  { slug: 'pages-and-routes', title: 'Pages and Routes', order: 9 },
  { slug: 'gallery', title: 'Gallery', order: 10 },
  { slug: 'admin-panel', title: 'Admin Panel', order: 11 },
  { slug: 'sharex', title: 'ShareX', order: 12 },
  { slug: 'desktop-app', title: 'Desktop App', order: 13 },
  { slug: 'deployment', title: 'Deployment', order: 14 },
  { slug: 'project-structure', title: 'Project Structure', order: 15 },
  { slug: 'security', title: 'Security', order: 16 },
  { slug: 'scripts', title: 'Scripts', order: 17 },
];

export function getGuideNav(): GuideNavItem[] {
  return [...vaultcdnGuides].sort((a, b) => a.order - b.order);
}

export function getAdjacentGuides(slug: string): {
  prev: GuideNavItem | null;
  next: GuideNavItem | null;
} {
  const guides = getGuideNav();
  const index = guides.findIndex((g) => g.slug === slug);
  return {
    prev: index > 0 ? guides[index - 1] : null,
    next: index >= 0 && index < guides.length - 1 ? guides[index + 1] : null,
  };
}
