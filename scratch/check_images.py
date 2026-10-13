import glob
import os
import re

html_files = ['d:/elgona/site1.html', 'd:/elgona/site2.html', 'd:/elgona/site3.html', 'd:/elgona/index.html']
photos = sorted(os.listdir('d:/elgona/assets/photos'))
print(f"Total user photos in assets/photos: {len(photos)}")
for p in photos:
    print(f" - {p}")

for f in html_files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    imgs = re.findall(r'<img[^>]*src=["\']([^"\']+)["\']', content)
    background_imgs = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', content)
    
    print(f"\n============================\nFile: {f} (Images: {len(imgs)}, BG images: {len(background_imgs)})")
    non_local = []
    for src in imgs:
        if not src.startswith('assets/photos/') and 'logo' not in src and 'favicon' not in src:
            non_local.append(src)
    for bg in background_imgs:
        if not bg.startswith('assets/photos/') and 'logo' not in bg and 'favicon' not in bg and not bg.startswith('data:'):
            non_local.append(bg)
            
    if non_local:
        print("  Found non-local or other images:")
        for nl in non_local:
            print(f"    * {nl}")
    else:
        print("  ALL images are exclusively from assets/photos/ (or logo/favicon)!")
