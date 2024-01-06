Download and rehost a Webflow website to avoid paying for it.

### Usage guidelines
- Webflow is a great tool, consider paying for it if you can. Consider if your project is a bi/small, commercial/non-commercial, and what country it's based in
- Webflow has a (paid) export feature, depending on your case it might be easier for you to just use that
- This project has limitations, so it might not work for your case

### Limitations

You're limited to things the Webflow editor allows you to do for free (e.g. 50 items in the CMS, no custom code editing). In addition to that, some things that work in webflow might break.

- Subpages - mostly works, details below
- Custom code - can be injected if using custom attributes, but depending on the use case could be tedious to work with
- Interactions - seems to work, but under observation - feels like some things had been broken in the past
- CMS - limited by Webflow's Starter (50 CMS items across 20 collections)
- Translations - needs checking
- Forms - using webflow forms won't work, they have to be replaced with something (e.g. Netlify Forms, web3forms)


### Subpages
For hosted (paid) websites, Webflow creates a sitemap automatically. We can't make use of that here, so instead we crawl to find all internal links, starting recursively at the base URL. This means that we will only detect subpages that are linked somewhere. This will be ok for most cases. If you have subpages that are not linked to from your website, you can add hidden link elements that lead to them - as a workaround. 

The crawler also won't detect links generated from JS, or any other links that are not `<a href=`s.

### Outlook
Mostly doing this to get it out of my head and because it's maybe a fun hack. Taking it far is not necessarily the right thing to do, but it could involve:
- more complete export (CSS, JS, images) - note that this might be unnecessary, and keeping it light is great if it works
- nice CLI interface (as opposed to a set of scripts)
- invoking in a cloud function
- browser extension to publish from webflow directly