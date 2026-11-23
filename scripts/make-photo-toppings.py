from pathlib import Path
from collections import deque
from PIL import Image, ImageOps, ImageFilter
source=Path('apps/customer/public/media/addons')
dest=source/'clean'
dest.mkdir(exist_ok=True)
for name in ('mozzarella','bacon','mushrooms','jalapeno'):
    im=Image.open(source/(name+'.webp')).convert('RGBA')
    w,h=im.size
    pixels=im.load()
    corners=[pixels[x,y][:3] for x,y in ((0,0),(w-1,0),(0,h-1),(w-1,h-1))]
    reference=tuple(sorted(c[k] for c in corners)[2] for k in range(3))
    marked=bytearray(w*h)
    removed=bytearray(w*h)
    seeds=deque([(x,0) for x in range(w)]+[(x,h-1) for x in range(w)]+[(0,y) for y in range(h)]+[(w-1,y) for y in range(h)])
    while seeds:
        x,y=seeds.popleft()
        n=y*w+x
        if marked[n]:continue
        marked[n]=1
        rgb=pixels[x,y][:3]
        if min(rgb)<=206 or max(abs(rgb[k]-reference[k]) for k in range(3))>39:continue
        removed[n]=1
        if x:seeds.append((x-1,y))
        if x+1<w:seeds.append((x+1,y))
        if y:seeds.append((x,y-1))
        if y+1<h:seeds.append((x,y+1))
    alpha=Image.new('L',(w,h),255)
    a=alpha.load()
    for y in range(h):
        for x in range(w):
            if removed[y*w+x]:a[x,y]=0
    alpha=alpha.filter(ImageFilter.GaussianBlur(.45))
    im.putalpha(alpha)
    bounds=alpha.point(lambda v:255 if v>25 else 0).getbbox()
    if bounds:im=im.crop(bounds)
    im=ImageOps.contain(im,(225,155),Image.Resampling.LANCZOS)
    img=Image.new('RGBA',(252,176),(0,0,0,0))
    img.alpha_composite(im,((252-im.width)//2,(176-im.height)//2))
    target=dest/(name+'.webp')
    img.save(target,'WEBP',quality=87,method=6)
    assert Image.open(target).getchannel('A').getpixel((0,0))==0
    print(target, target.stat().st_size)
