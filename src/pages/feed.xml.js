import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Notes from Curtis...',
    description: 'A collection of thoughts, memoirs, guides and photos from my life.',
    site: context.site,
    items: await pagesGlobToRssItems(
      import.meta.glob('./posts/*.mdx')),
    customData: `<language>en-us</language>`,
  });
}