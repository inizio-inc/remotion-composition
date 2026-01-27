// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { webpackOverride } from "./src/remotion/webpack-override.mjs";

Config.setVideoImageFormat("jpeg");

// Note: FPS is set in the Composition component (fps={60}), not in config
// Remotion v4+ removed Config.setFps() - set fps prop on <Composition> instead

Config.overrideWebpackConfig(webpackOverride);
