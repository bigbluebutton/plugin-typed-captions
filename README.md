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


## Development mode

As for development mode (running this plugin from source), please, refer back to https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk section `Running the Plugin from Source`
