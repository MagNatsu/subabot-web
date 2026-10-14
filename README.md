# Chirpy Starter

[![Gem Version](https://img.shields.io/gem/v/jekyll-theme-chirpy)][gem]&nbsp;
[![GitHub license](https://img.shields.io/github/license/cotes2020/chirpy-starter.svg?color=blue)][mit]

A minimal, ready-to-use template for creating a blog with the [**Chirpy**][chirpy] Jekyll theme. Get up and running in minutes with all critical files pre-configured.

## Why This Starter Exists

When installing Chirpy through [RubyGems.org][gem], Jekyll can only read a subset of theme files (`_data`, `_layouts`, `_includes`, `_sass`, `assets`) and limited `_config.yml` options from the gem. As a result, users cannot enjoy the full out-of-the-box experience that Chirpy offers.

To unlock all features, the following files must be present in your Jekyll site:

```shell
.
├── _config.yml
├── _plugins
├── _tabs
└── index.html
```

This starter bundles those files from the latest **Chirpy** release along with a [CD][CD] workflow, so you can start writing immediately.

## Usage

Check out the [theme's docs](https://github.com/cotes2020/jekyll-theme-chirpy/wiki).

## Contributing

This repository is automatically updated with new releases from the theme repository. If you encounter any issues or want to contribute to its improvement, please visit the [theme repository][chirpy] to provide feedback.

## Episode player previews

Episode posts can embed an in-page preview with styled ASS subtitles. The player uses Movi Player for MKV playback and JASSUB to render the ASS track. The JASSUB runtime files are kept in `assets/jassub/`; the license is included in that directory.

To add a preview, set `episode_player.video_url` to a direct HTTPS `.mkv` URL and list the subtitle fonts used by that post under `episode_player.fonts`. Store the font files under `assets/episode-fonts/<slug>/`:

```yaml
episode_player:
  video_url: "https://github.com/MagNatsu/subabot-web/releases/download/<tag>/<episode>.mkv"
  fonts:
    - /assets/episode-fonts/<distribution-slug>/font-name.ttf
```

Add `{% include episode-player.html %}` to the post body where the preview should appear. The include adds the site base URL to each font path and loads the shared player script.

Use a direct HTTPS `.mkv` file as the player source. Archives are not supported as media sources.

## License

This work is published under [MIT][mit] License.

[gem]: https://rubygems.org/gems/jekyll-theme-chirpy
[chirpy]: https://github.com/cotes2020/jekyll-theme-chirpy/
[CD]: https://en.wikipedia.org/wiki/Continuous_deployment
[mit]: https://github.com/cotes2020/chirpy-starter/blob/master/LICENSE
