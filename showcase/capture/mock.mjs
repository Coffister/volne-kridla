// Mock Supabase backend for capturing the real admin UI locally.
// Content = the real published content scraped from volnekridla.sk (reviews, albums, photos).
import fs from 'fs';
const live = JSON.parse(fs.readFileSync('.capture/live2.json', 'utf8'));
const MEDIA = '.capture/media';
const pathOf = (u) => u.replace(/.*\/public\/media\//, '');
const ts = (i) => new Date(Date.UTC(2026, 9, 14 - i, 9, 0)).toISOString();
const albumDefs = [
  { slug: 'spolocne-volne-lietanie', title: 'Spoločné voľné lietanie', event_date: '2026-10-16', description: '' },
  { slug: 'spolocny-piknik-v-prirode', title: 'Spoločný piknik v prírode', event_date: null, description: '' },
];
const albums = albumDefs.map((a, i) => ({ id: `album-${i}`, ...a, cover_image_id: null, published: true, created_at: ts(i) }));
const gallery = [];
albumDefs.forEach((a, ai) => (live.photos['/fotogaleria/' + a.slug] || []).forEach((u, j) => {
  const p = pathOf(u);
  gallery.push({ id: `img-${ai}-${j}`, storage_path: p.replace('-thumb', ''), thumb_path: p, album_id: albums[ai].id, alt: '', width: 1200, height: 900, sort_order: j, published: true, created_at: ts(j) });
}));
albums.forEach(a => a.cover_image_id = gallery.find(g => g.album_id === a.id)?.id ?? null);
const reviews = live.reviews.map((r, i) => ({ id: `rev-${i}`, author: r.author, body: r.body || '', image_path: r.img ? pathOf(r.img) : null, image_url: null, image_pos_x: 50, image_pos_y: 20, sort_order: i, published: true, created_at: ts(i) }));
const tables = { gallery_images: gallery, gallery_albums: albums, reviews, faq_items: [], products: [], product_inquiries: [], consultation_inquiries: [], presentation_inquiries: [], site_sections: [{ key: 'tipy', visible: true }], site_versions: [] };

export async function installMock(page) {
  await page.addInitScript(() => {
    const now = Math.floor(Date.now() / 1000);
    localStorage.setItem('vk-admin-auth', JSON.stringify({ access_token: 'mock', refresh_token: 'mock', token_type: 'bearer', expires_in: 3600 * 24 * 365, expires_at: now + 3600 * 24 * 365,
      user: { id: '00000000-0000-0000-0000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'franka@volnekridla.sk', app_metadata: {}, user_metadata: {}, created_at: '2025-01-01T00:00:00Z' } }));
  });
  await page.route('http://mock.supabase.test/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/storage/v1/object/public/media/')) {
      const p = url.pathname.replace('/storage/v1/object/public/media/', '');
      let f = `${MEDIA}/${p.replace(/\//g, '__')}`;
      if (!fs.existsSync(f)) f = f.replace(/\.(jpe?g)$/, '-thumb.$1');
      if (!fs.existsSync(f)) return route.fulfill({ status: 404 });
      return route.fulfill({ status: 200, contentType: 'image/jpeg', body: fs.readFileSync(f) });
    }
    if (url.pathname === '/rest/v1/rpc/is_admin') return route.fulfill({ json: true });
    const m = url.pathname.match(/^\/rest\/v1\/([^/]+)$/);
    if (m) {
      let rows = tables[m[1]] ?? [];
      for (const [k, v] of url.searchParams) { if (v.startsWith('eq.')) rows = rows.filter(r => String(r[k]) === v.slice(3)); }
      const single = (route.request().headers()['accept'] || '').includes('pgrst.object');
      return route.fulfill({ json: single ? (rows[0] ?? null) : rows, headers: { 'content-range': `0-${rows.length}/${rows.length}` } });
    }
    console.log('unmocked', url.pathname);
    return route.fulfill({ json: {} });
  });
}
