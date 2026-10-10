from PIL import Image
from pathlib import Path
source=Path('../ngo images')
out=Path('dist/assets');out.mkdir(parents=True,exist_ok=True)
for prefix,name,box in [('1320100d','team',(0,130,1600,940)),('bf93fc12','arrival',(270,110,1600,930)),('6083aa56','handshake',(0,110,1600,935))]:
    image=Image.open(next(source.glob(prefix+'*'))).convert('RGB').crop(box)
    image.thumbnail((1400,1100))
    image.save(out/(name+'.webp'),'WEBP',quality=83)
