import fs from 'node:fs';
import {launch} from 'file:///C:/Users/LEGION/Downloads/web-designer/Web%20Designer/web-designer/scripts/lib/browser.mjs';
const {browser}=await launch();const ctx=await browser.newContext({viewport:{width:1200,height:630},deviceScaleFactor:1});const p=await ctx.newPage();await p.goto('http://localhost:4173/_collateral/og.html');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'dist/og.png'});
await browser.close();console.log('Social card generated. Icons come from prepare-logo.py.');
