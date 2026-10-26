"""Run after npm run build: verify generated metadata, links, sitemap and RSS."""
from pathlib import Path
from html.parser import HTMLParser
import json
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

root = Path('dist')
origin = 'https://adhdos.app'
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.tags = []; self.divs = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'div': self.divs.append('prose' in attrs.get('class', '').split())
        if any(self.divs): attrs['_article_body'] = True
        self.tags.append((tag, attrs))
    def handle_endtag(self, tag):
        if tag == 'div' and self.divs: self.divs.pop()

def check(url):
    parsed = urlparse(url)
    assert parsed.path == '/blog' or parsed.path.startswith('/blog/'), url
    assert not parsed.path.endswith('/'), url
    assert parsed.netloc in ['', 'adhdos.app'], url

count = 0
for file in root.rglob('*.html'):
    text = file.read_text(); page = Page(text)
    canonical = [a['href'] for t,a in page.tags if t == 'link' and a.get('rel') == 'canonical']
    assert len(canonical) == 1, file
    expected = '/blog/' + file.relative_to(root).as_posix().removesuffix('index.html').rstrip('/')
    expected = expected.rstrip('/')
    assert canonical == [origin + expected], (file, canonical, expected)
    is_en = expected == '/blog/en' or expected.startswith('/blog/en/')
    html_lang = next(a['lang'] for t,a in page.tags if t == 'html')
    assert html_lang == ('en' if is_en else 'zh'), (file, html_lang)
    for tag, attrs in page.tags:
        if tag == 'link' and attrs.get('hreflang'):
            check(attrs['href'])
            target = attrs['href'].removeprefix(origin + '/blog').strip('/')
            assert (root / target / 'index.html').exists(), (file, attrs)
        if tag == 'meta' and attrs.get('property') == 'og:url':
            assert attrs['content'] == canonical[0], file
        # Authored article body links are intentionally outside this routing-only fix.
        if tag == 'a' and not attrs.get('_article_body') and attrs.get('href','').startswith(('/blog', origin + '/blog')):
            check(attrs['href'])
    # Article schemas must use the same final canonical.
    import re
    for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
        data = json.loads(raw)
        if data.get('@type') == 'Article':
            assert data['mainEntityOfPage']['@id'] == canonical[0], file
    count += 1
for file in root.glob('sitemap*.xml'):
    for element in ET.parse(file).iter():
        if element.tag.endswith('}loc'): check(element.text)
        if 'href' in element.attrib: check(element.attrib['href'])
rss = ET.parse(root / 'rss.xml')
for element in rss.iter():
    if element.tag in ['link','guid']: check(element.text)
print(f'Validated {count} HTML pages, sitemap loc/hreflang URLs and RSS links/guids')
