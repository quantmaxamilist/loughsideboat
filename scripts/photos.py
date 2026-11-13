# Builds graded WebP photos from the client's own originals (_src/img, downloaded from the old WP media library).
# One shared grade: gentle contrast, slightly cooler shadows, mild saturation trim so phone snaps read as a set.
import os, json
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
SRC='_src/img'; OUT='public/img'
P={
 'john-helm':      ('518204088_122139295520785034_6641157926572522815_n.jpg', None),
 'pontoon':        ('500593673_122130781124785034_4793263322896717112_n.jpg', None),
 'stern':          ('500583625_122130779324785034_3779392180794167039_n.jpg', None),
 'trailer':        ('564579104_122152686608785034_7673229698310967099_n.jpg', None),
 'interior':       ('565667811_122152686572785034_3250691594757381965_n.jpg', None),
 'mc-cockpit':     ('565657094_122152928504785034_8409901061932354444_n.jpg', None),
 'mc-shed':        ('566215722_122152928498785034_5651890629680799511_n.jpg', 'bars'),
 'mc-side':        ('565831094_122152928528785034_6578380055016878532_n.jpg', None),
 'gl-trailer':     ('538759246_17869705209425543_6024032407534848374_n.jpg', None),
 'gl-berth':       ('537063644_17869705218425543_6131098090932824206_n.jpg', None),
 'gl-marina':      ('537365501_17869705251425543_9128876226371874111_n.jpg', None),
 'gl-reflect':     ('537517532_17869705254425543_2064761703829861243_n.jpg', None),
}
def grade(im):
    im=ImageEnhance.Contrast(im).enhance(1.06)
    im=ImageEnhance.Color(im).enhance(0.94)
    r,g,b=im.split()
    # cool the shadows a touch (lough navy), leave highlights neutral
    b=b.point(lambda v: min(255,int(v+ (10*(1-v/255)))))
    r=r.point(lambda v: int(v- (5*(1-v/255))))
    return Image.merge('RGB',(r,g,b))
def crop_bars(im):
    g=im.convert('L'); w,h=im.size
    top=0
    while top<h//3 and max(g.crop((0,top,w,top+1)).getdata())<20: top+=1
    bot=h-1
    while bot>h*2//3 and max(g.crop((0,bot,w,bot+1)).getdata())<20: bot-=1
    return im.crop((0,top,w,bot+1))
man={}
os.makedirs(OUT,exist_ok=True)
for k,(f,op) in P.items():
    im=ImageOps.exif_transpose(Image.open(os.path.join(SRC,f))).convert('RGB')
    if op=='bars': im=crop_bars(im)
    im=grade(im); W,H=im.size
    widths=[w for w in (480,960,1440) if w<W]+[W]
    if k=='john-helm':
        big=im.resize((1920,round(1920*H/W)),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2,40,2)); big.save(f'{OUT}/{k}-1920.webp',quality=82); widths.append(1920)
    for w in sorted(set(widths)):
        if w==1920: continue
        im.resize((w,round(w*H/W)),Image.LANCZOS).save(f'{OUT}/{k}-{w}.webp',quality=80)
    man[k]={'w':W,'h':H,'widths':sorted(set(widths)),'src':f}
    print(k,W,H,sorted(set(widths)))
json.dump(man,open('src/data/photos.json','w'),indent=1)
