# Hand-traced masks (photo-normalised polygons) for the WebGL effects:
#  - john-helm-water.png: white = water that ripples (hero), boat + quay excluded
#  - pontoon-hull.png:    white = gelcoat hull that gets "polished" (wow B), canvas cover excluded
from PIL import Image, ImageDraw, ImageFilter, ImageChops
S=1024
def poly(d, pts, fill): d.polygon([(x*S, y*S) for x, y in pts], fill=fill)
# --- hero water
m=Image.new('L',(S,S),0); d=ImageDraw.Draw(m)
poly(d,[(0,0.452),(0.25,0.428),(0.5,0.408),(0.75,0.368),(1,0.342),(1,1),(0,1)],255)
boat=[(0.052,0.59),(0.09,0.563),(0.14,0.543),(0.30,0.503),(0.33,0.478),(0.38,0.452),(0.405,0.428),(0.41,0.4),(0.445,0.395),(0.465,0.428),(0.49,0.44),(0.552,0.335),(0.6,0.318),(0.645,0.34),(0.632,0.47),(0.70,0.472),(0.80,0.488),(0.885,0.503),(0.93,0.518),(0.935,0.545),(0.915,0.57),(0.85,0.58),(0.70,0.596),(0.55,0.616),(0.40,0.632),(0.25,0.64),(0.15,0.636),(0.10,0.622)]
b=Image.new('L',(S,S),0); poly(ImageDraw.Draw(b),boat,255); b=b.filter(ImageFilter.MaxFilter(9))
m=ImageChops.subtract(m,b).filter(ImageFilter.GaussianBlur(5))
m.save('public/img/john-helm-water.png')
# --- pontoon hull
h=Image.new('L',(S,S),0); d=ImageDraw.Draw(h)
poly(d,[(0.165,0.392),(0.22,0.386),(0.28,0.386),(0.40,0.399),(0.47,0.406),(0.55,0.393),(0.63,0.376),(0.70,0.38),(0.78,0.402),(0.83,0.44),(0.848,0.472),(0.848,0.52),(0.832,0.546),(0.76,0.577),(0.70,0.597),(0.62,0.607),(0.55,0.597),(0.45,0.572),(0.38,0.552),(0.30,0.522),(0.24,0.492),(0.19,0.462),(0.165,0.44)],255)
cover=[(0.43,0.415),(0.48,0.39),(0.60,0.375),(0.70,0.385),(0.78,0.42),(0.805,0.445),(0.77,0.47),(0.65,0.48),(0.52,0.475),(0.45,0.455)]
c=Image.new('L',(S,S),0); poly(ImageDraw.Draw(c),cover,255); c=c.filter(ImageFilter.MaxFilter(5))
h=ImageChops.subtract(h,c).filter(ImageFilter.GaussianBlur(3))
h.save('public/img/pontoon-hull.png')
# overlays for checking
for photo,mask,out in [('_src/img/518204088_122139295520785034_6641157926572522815_n.jpg','public/img/john-helm-water.png','water'),('_src/img/500593673_122130781124785034_4793263322896717112_n.jpg','public/img/pontoon-hull.png','hull')]:
    im=Image.open(photo).convert('RGB').resize((S,S)); mk=Image.open(mask)
    red=Image.new('RGB',(S,S),(255,0,90)); ov=Image.composite(Image.blend(im,red,0.5),im,mk)
    ov.resize((640,640)).save(f'/private/tmp/claude-501/-Users-jackwhite--claude-spares-spare-Cekexe/7c49f444-a96a-4ae1-9853-7b02a0cec72e/scratchpad/lough/ov-{out}.jpg',quality=80)
print('ok')
