Download and rehost a Webflow website to avoid paying for it.

### Usage guidelines
- Webflow is a great tool, consider paying for it if you can. Consider if your project is a bi/small, commercial/non-commercial, and what country it's based in
- Webflow has a (paid) export feature, depending on your case it might be easier for you to just use that
- This project has limitations, so it might not work for your case

### Limitations

You're limited to things the Webflow editor allows you to do for free (e.g. 50 items in the CMS, no custom code editing). In addition to that, some things that work in webflow might break.

- Subpages - can work, checking sitemap.xml will help
- Custom code - can be injected if using custom attributes, but depending on the use case could be tedious to work with
- Interactions - seems to work, but under observation - feels like some things had been broken in the past
- CMS - limited by Webflow's Starter (50 CMS items across 20 collections)
- Translations - needs checking
- Forms - using webflow forms won't work, they have to be replaced with something (e.g. Netlify Forms, web3forms)

### Outlook
Mostly doing this to get it out of my head and because it's maybe a fun hack. Taking it far is not necessarily the right thing to do, but it could involve:
- more complete export (CSS, JS, images) - note that this might be unnecessary, and keeping it light is great if it works
- nice CLI interface (as opposed to a set of scripts)
- invoking in a cloud function
- browser extension to publish from webflow directly