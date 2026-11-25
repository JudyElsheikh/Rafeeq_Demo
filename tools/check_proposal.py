"""Verify proposal export coverage and page wiring without dependencies."""
import json
from pathlib import Path
from html.parser import HTMLParser

root = Path(__file__).resolve().parents[1]
source = (root / 'js/proposal.js').read_text(encoding='utf-8')
data = json.loads(source.split('Rafeeq.proposal = ', 1)[1].rstrip(';\n'))

class Content(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sections = self.tables = 0
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.sections += tag == 'section'
        self.tables += tag == 'table'
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, attrs['id']
            self.ids.add(attrs['id'])

content = Content()
content.feed(data['content'])
assert content.sections == 12
assert content.tables == 18
assert all(f'proposal-{i}' in content.ids for i in range(1, 13))
assert 'discover-features' in content.ids
page = (root / 'discover.html').read_text(encoding='utf-8')
for dependency in ['css/proposal.css', 'js/proposal.js', 'js/app.js']:
    assert dependency in page and (root / dependency).is_file()
assert page.index('js/proposal.js') < page.index('js/app.js')
app = (root / 'js/app.js').read_text(encoding='utf-8')
assert 'href="discover.html">Discover More About Rafeeq</a>' in app
assert "document.getElementById('discover-features').innerHTML=featureTabs()" in app
assert '{overview,discover,phase1,feature}[page]' in app
assert '<strong>Throughout the day</strong>' in data['content']
assert '<ul>' in data['content'] and '<li>' in data['content']
assert data['content'].count(' hidden') == 11
assert 'Competitor links' not in data['content']
assert 'href="https://endeavorrx.com"' in data['content']
assert 'href="https://character.ai"' in data['content']
assert 'href="https://www.pearsonassessments.com/campaign/revibe.html"' in data['content']
assert '<details class="topic-more">' in data['navigation']
assert data['navigation'].count('data-topic=') == 12
print('PASS: 12 sections, 18 tables, preserved bold and bullets, one initial section, linked competitor matrix, page dependencies and shared Features component.')
