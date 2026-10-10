import fs from 'node:fs';
import {launch} from 'file:///C:/Users/LEGION/Downloads/web-designer/Web%20Designer/web-designer/scripts/lib/browser.mjs';
const {browser}=await launch();const ctx=await browser.newContext({viewport:{width:1200,height:630},deviceScaleFactor:1});const p=await ctx.newPage();await p.goto('http://localhost:4173/og.html');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'dist/og.png'});
for(const size of [180,512]){await p.setViewportSize({width:size,height:size});await p.goto('http://localhost:4173/favicon.svg');await p.screenshot({path:'dist/'+(size===180?'apple-touch-icon.png':'icon-512.png')})}
await browser.close();console.log('Social card and icon PNGs generated.');
