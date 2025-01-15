import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  const posts = await pagesGlobToRssItems(import.meta.glob('./posts/*.mdx'));
  return rss({
    title: 'Notes from Curtis...',
    description: 'A collection of thoughts, memoirs, guides and photos from my life ',
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      link: post.link,
      pubDate: post.pubDate,
      description: post.description,
      enclosure: post.enclosure,
    })),
    customData: `<language>en-us</language>`,
  });
}