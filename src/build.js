import fs from 'fs';
import path from 'path';
import csso from 'csso';
import sass from 'node-sass';
import crypto from 'crypto';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MuteSwanSplash from './components/muteswan/splash';

const isProduction = process.env.NODE_ENV === 'production';

const publicPath = path.resolve(__dirname, '../public');
const templatePath = path.resolve(__dirname, './templates');
const assetsPath = path.join(publicPath, 'assets');

// Delete existing WebPack chunks
const assets = fs.readdirSync(assetsPath);
assets
  .filter((file) => /^muteswan\.[^\.]{10,}(\.min)?\.js$/.test(file))
  .map((file) => fs.unlinkSync(path.join(assetsPath, file)));

// Get HTML template
let html = fs.readFileSync(
  path.join(templatePath, `${isProduction ? 'production' : 'development'}.html`)
);

// Get Web Manifest template
const manifest = fs.readFileSync(
  path.join(templatePath, `manifest.webmanifest`)
);

// Get Service Worker template
const sw = fs.readFileSync(path.join(templatePath, `sw.js`));

// Render loading screen
const render = ReactDOMServer.renderToStaticMarkup(
  React.createElement(MuteSwanSplash, {}, null)
);

// Replace variables in HMTL
html = html.toString().replace(/{{ render }}/g, render);
html = html
  .toString()
  .replace(/{{ version }}/g, process.env.npm_package_version);

// Render and minify CSS
let css = fs.readFileSync(path.join(assetsPath, `muteswan.scss`));
css = sass.renderSync({data: css.toString()}).css;
css = csso.minify(css.toString()).css;
const hash = crypto.createHash('sha256').update(css).digest('base64');

// Write CSS with hash string to template
html = html.toString().replace(/{{ css }}/g, css);
html = html.toString().replace(/{{ css-hash }}/g, hash);

// Update CSS hash in Netlify CSP configuration
const tomlPath = path.resolve(__dirname, `../netlify.toml`);
let toml = fs.readFileSync(tomlPath);
toml = toml
  .toString()
  .replace(/style-src 'sha256-[^']+?'/g, `style-src 'sha256-${hash}'`);
fs.writeFileSync(tomlPath, toml);

// Save HTML to public directory
fs.writeFileSync(path.join(publicPath, `index.html`), html);

// Save Web Manifest to public directory
fs.writeFileSync(
  path.join(publicPath, `manifest.webmanifest`),
  manifest.toString().replace(/{{ version }}/g, process.env.npm_package_version)
);

// Save Service Worker to public directory
fs.writeFileSync(
  path.join(publicPath, `sw.js`),
  sw.toString().replace(/{{ version }}/g, process.env.npm_package_version)
);
