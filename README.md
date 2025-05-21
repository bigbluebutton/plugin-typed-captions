# Typed Captions

## What is it?

This plugin is one of the official bbb plugins. It implements the previous typed captions feature that was present in the core of BBB, but as a plugin and with some different UI and features within. So the idea is that you can simply type the captions in the sidekick panel that will appear and it will appear just like a normal automatic-captions on the bottom of the presentation area.

See demo below:

![Gif of plugin demo](./public/assets/plugin_demo.gif)

```bash
cd $HOME/src/plugin-typed-captions
npm ci
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `TypedCaptions.js`. This file can be hosted on any HTTPS server along with its `manifest.json`.

If you install the Plugin separated to the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

Or additionally, you can add this same configuration in the `.properties` file from `bbb-web` in `/usr/share/bbb-web/WEB-INF/classes/bigbluebutton.properties`

### Extra settings:

Pay attention that the audio captions must be enabled, to do that, you open `/etc/bigbluebutton/bbb-html5.yml` and add the yaml directive `public.app.audioCaptions.enabled=true`, just like the following:

```yml
public:
  app:
    # You may have other setting items here
    audioCaptions:
      enabled: true
```

also, ensure the captions needed are uncommented in the list `public.app.audioCaptions.language.available`, as the following example for en-US:
```yml
public:
  app:
    audioCaptions:
      language:
        # the uncommented languages will be loaded as captions 
        available:
        # - de-DE
          - en-US
        # - fr-FR
```

Make sure you don't change any other setting, save the file, and we're good to go!


## Development mode

This is an internationalized plugin, meaning that it has translations in it. Therefore, if you want to test in dev mode it with the correct translations, one minor change is necessary to this code to make it work, search for `useLocaleMessages` in `src/components/main/component.tsx` and add the following argument into the function:

```js
{
  headers: {
    'ngrok-skip-browser-warning': 'any',
  },
}
```

It will look like:

```ts
pluginApi.useLocaleMessages({
  headers: {
    'ngrok-skip-browser-warning': 'any',
  },
});
```

This will allow the plugin to fetch the locale files through ngrok.

As for development mode (running this plugin from source), please, refer back to https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk section `Running the Plugin from Source`
