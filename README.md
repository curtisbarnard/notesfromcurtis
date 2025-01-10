# Notes From Curtis

This is my personal blog built with [Astro](https://docs.astro.build).

## Project Structure

Pages are `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name. UI Components are stored within `src/components/`. `src/layout` contains the top level html Layout of the site. Any static assets, like images, are placed in the `public/` directory.

## Local Development Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Image Prep

Images are initially culled/tagged with [digiKam](https://www.digikam.org/), processed with [darktable](https://www.darktable.org/), and then exported at 300 and 600 pixels wide in the webp format to help with responsiveness and load times. Finally all metadata is stripped from the images and a copyright is added via [exiftool](https://exiftool.org/) with `exiftool * -all= -tagsfromfile @ -icc_profile -overwrite_original -copyright="<YYYY> Curtis Barnard"`

## Old Blogs

I recovered blog post from the following old blogs:

- https://c-barnard.livejournal.com/
- http://junkdrawer.web44.net/blog/
- http://oregoncurtis.baywords.com/
- http://www.startatthemarket.com/
