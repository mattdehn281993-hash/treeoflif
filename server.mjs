import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}let file=name.startsWith('/_collateral/')?path.resolve('collateral',name.slice(13)):path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)&&file!==root&&!file.startsWith(path.resolve('collateral')+path.sep)){res.writeHead(403).end();return}if(!path.extname(file))file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});fs.createReadStream(path.join(root,'404.html')).pipe(res);return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)}).listen(4173,'127.0.0.1',()=>console.log('Local: http://localhost:4173'));
