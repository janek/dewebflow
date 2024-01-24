*unwebflow is a creative extension of the Webflow free tier*

## Should you use this?
- Webflow is a great tool, before skipping payment consider if you should pay. For example: is your project is a big or small, commercial or non-commercial? What's the average income in the country it's based in?
- This project has limitations (see below), so it might not work for your case
- Webflow has a (paid) export feature, depending on your case it might be easier for you to just use that

## Installation
- Make sure you have `bun` >= 1.0.22 installed, if needed install with `curl -fsSL https://bun.sh/install | bash`
- Clone this repository and run `bun run install`. This will install `unwebflow` as a binary (by copying it to `~/bin/`)
- Make sure `~/bin` is in your `$PATH` and the tool was installed - run `unwebflow` from any directory and see if it works

## Usage
- Create a GitHub repository for the webiste you want to rehost
- Connect your deployment to the repository - e.g. Netlify or Vercel
- Clone locally and enter the directory with the repo. Make sure you're able to commit and push.
- Run `unwebflow`
- This will download your website from webflow to the directory you're in. It will then commit and push to GitHub, which in turn should deploy your site where you want it

## Limitations
You're limited to things the Webflow editor allows you to do for free (e.g. 50 items in the CMS, no custom code editing). In addition to that, some things that work in webflow might break.

- **Subpages** - works, details below // XXX: limit of 2, use CMS as workaround
- **Custom code** - kind of works, details below
- **CMS** - works, with limits set by Webflow's free plan (50 CMS items across 20 collections, etc.)
- **Forms** - you can use Webflow's forms directly, but it has a 50 submissions per month limit, and you won't get notifications about submissions
- **Interactions** - works
- **Localization** - not tested, becuase I couldn't find a free preview of it or not (even though it theoretically exists)
- **Spline 3D objects** - works and has no watermark
- **Ecommerce** - not attempted, likely complicated


### Subpages
For hosted (paid) websites, Webflow creates a sitemap automatically. We can't make use of that here, so instead we crawl to find all internal links, starting recursively at the base URL. This means that we will only detect subpages that are linked somewhere. This will be ok for most cases. If you have subpages that are not linked to from your website, you can add hidden link elements that lead to them - as a workaround. 

The crawler also won't detect links generated from JS, or any other links that are not `<a href=`s.

### Custom code
You can write snippets of code to be injected in the re-publishing process. To do that, you have to add a mock element in Webflow that will get replaced. (This is a WIP/TODO)

### CMS and forms submission limts
Currently limited to what Webflow allows in their free ("Starter") plan. It's possible to replace the CMS and forms with another service (like Netlify Forms and Netlify CMS), but not currently implemented (and potentially a bit complicated). See also Udesly.

### Forms 
Netlify forms?

### TODO
- review the code in `remove-badge.html`, since it's copied from ChatGPT without due diligence and uses unfamiliar things (mutation observers)
- also `getAllSubpages.js` is a little brittle
- reorganizing code into more files should also make things cleaner

### Outlook
Mostly doing this to get it out of my head and because it's maybe a fun hack. Taking it far is not necessarily the right thing to do, but it could involve:
- ~~more "complete" export (CSS, JS, images) - note that this might be unnecessary, and keeping it light is great if it works~~
- ~~nice CLI interface (as opposed to a set of scripts)~~
- invoking in a cloud function
- browser extension to publish from webflow directly
