import {spawn} from 'node:child_process';
const skill='C:/Users/LEGION/Downloads/web-designer/Web Designer/web-designer/scripts';
const round=process.argv[2]||'r1';
const routes=['work','help','stories','stories/easter-cotonou','about','give','involved','contact','privacy','donation-terms','thank-you'];
let index=0,failed=0;
async function worker(){while(index<routes.length){const route=routes[index++];await new Promise(resolve=>{let stdout='';const p=spawn(process.execPath,[skill+'/shoot.mjs','http://localhost:4173/'+route+'/', '--widths','390,1440','--scale','1','--out','shots/'+round+'/'+route.replaceAll('/','-')],{stdio:['ignore','pipe','pipe']});p.stdout.on('data',x=>stdout+=x);p.stderr.on('data',x=>stdout+=x);p.on('exit',code=>{if(code)failed++;console.log(route+': '+(code?'FAILED':'passed')+'\n'+stdout);resolve()})})}}
await Promise.all([worker(),worker(),worker()]);process.exitCode=failed?1:0;
