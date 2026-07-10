export interface Company {
  slug: string; // Greenhouse board token, used in the API URL
  name: string; // display label
}

// Curated list of companies with public Greenhouse boards. Greenhouse has no
// "list all boards" API, so this is maintained by hand — edit freely. Any slug
// that isn't a live board simply returns the 404 handled on the results page.
export const COMPANIES: Company[] = [
  { slug: 'databricks', name: 'Databricks' },
  { slug: 'gitlab', name: 'GitLab' },
  { slug: 'stripe', name: 'Stripe' },
  { slug: 'coinbase', name: 'Coinbase' },
  { slug: 'dropbox', name: 'Dropbox' },
  { slug: 'reddit', name: 'Reddit' },
  { slug: 'robinhood', name: 'Robinhood' },
  { slug: 'doordash', name: 'DoorDash' },
  { slug: 'pinterest', name: 'Pinterest' },
  { slug: 'cloudflare', name: 'Cloudflare' },
];
