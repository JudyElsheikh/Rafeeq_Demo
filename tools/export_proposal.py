"""Rebuild the discover page content from the supplied proposal (stdlib only)."""
import html
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / 'Rafeeq_Final_Updated_Proposal v3.docx'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def text(element):
    return ''.join(t.text or '' for t in element.findall('.//w:t', NS)).strip()

def paragraphs(cell):
    return render_paragraphs(cell.findall('w:p', NS))

def enabled(properties, name):
    node = properties.find('w:' + name, NS) if properties is not None else None
    return node is not None and node.get('{%s}val' % NS['w'], 'true') not in ('0', 'false', 'off', 'none')

def inline(paragraph):
    output = []
    for run in paragraph.findall('.//w:r', NS):
        value = ''.join(html.escape(node.text or '') if node.tag.endswith('}t') else '<br>' if node.tag.endswith(('}br', '}cr')) else ' ' if node.tag.endswith('}tab') else '' for node in run)
        props = run.find('w:rPr', NS)
        for name, tag in [('b', 'strong'), ('i', 'em'), ('u', 'u'), ('strike', 's')]:
            if enabled(props, name):
                value = f'<{tag}>{value}</{tag}>'
        vert = props.find('w:vertAlign', NS) if props is not None else None
        if vert is not None:
            tag = {'superscript': 'sup', 'subscript': 'sub'}.get(vert.get('{%s}val' % NS['w']))
            if tag:
                value = f'<{tag}>{value}</{tag}>'
        output.append(value)
    return ''.join(output)

def render_paragraphs(elements):
    output, active = [], None
    for paragraph in elements:
        if not text(paragraph):
            continue
        num = paragraph.find('w:pPr/w:numPr/w:numId', NS)
        key = num.get('{%s}val' % NS['w']) if num is not None else None
        kind = list_formats.get(key, 'ul') if key is not None else None
        if active and active != (key, kind):
            output.append(f'</{active[1]}>')
            active = None
        if kind and active is None:
            output.append(f'<{kind}>')
            active = (key, kind)
        output.append(f'<li>{inline(paragraph)}</li>' if kind else f'<p>{inline(paragraph)}</p>')
    if active:
        output.append(f'</{active[1]}>')
    return ''.join(output)

with zipfile.ZipFile(SOURCE) as archive:
    body = ET.fromstring(archive.read('word/document.xml')).find('w:body', NS)
    numbering = ET.fromstring(archive.read('word/numbering.xml'))
    formats = {a.get('{%s}abstractNumId' % NS['w']): a.find('w:lvl/w:numFmt', NS).get('{%s}val' % NS['w']) for a in numbering.findall('w:abstractNum', NS)}
    list_formats = {a.get('{%s}numId' % NS['w']): 'ul' if formats[a.find('w:abstractNumId', NS).get('{%s}val' % NS['w'])] == 'bullet' else 'ol' for a in numbering.findall('w:num', NS)}

# Link matrix headers using the proposal's own competitor directory.
directory = body.findall('w:tbl', NS)[-1]
competitors = {}
for row in directory.findall('w:tr', NS)[1:]:
    cells = row.findall('w:tc', NS)
    competitors[text(cells[0])] = text(cells[2])

sections = []
current = None
label = ''
pending = []
def flush():
    if current is not None and pending:
        current['parts'].append(render_paragraphs(pending))
    pending.clear()

for element in body:
    if element.tag.endswith('}p'):
        value = text(element)
        if not value:
            continue
        style = element.find('w:pPr/w:pStyle', NS)
        style = style.get('{%s}val' % NS['w']) if style is not None else ''
        if style == 'Heading1':
            flush()
            match = re.match(r'(\d+)\s+(.+)', value)
            if not match:
                continue
            number, title = match.groups()
            current = {'number': int(number), 'title': title, 'parts': []}
            sections.append(current)
            label = title
        elif current is not None:
            if current['number'] == 15 and value == 'Competitor links':
                continue
            if style == 'Heading2':
                flush()
                label = value
                current['parts'].append(f'<h3>{inline(element)}</h3>')
            else:
                pending.append(element)
    elif element.tag.endswith('}tbl') and current is not None:
        flush()
        if element is directory:
            continue
        rows = element.findall('w:tr', NS)
        output = []
        for index, row in enumerate(rows):
            cells = row.findall('w:tc', NS)
            values = []
            for column, cell in enumerate(cells):
                tag = 'th' if index == 0 or column == 0 else 'td'
                scope = (' scope="col"' if index == 0 else ' scope="row"') if tag == 'th' else ''
                span = cell.find('w:tcPr/w:gridSpan', NS)
                colspan = f' colspan="{int(span.get(chr(123)+NS["w"]+chr(125)+"val"))}"' if span is not None else ''
                rendered = paragraphs(cell)
                if current['number'] == 15 and index == 0:
                    for name, url in competitors.items():
                        if name in text(cell):
                            opening = f'<a href="{html.escape(url, quote=True)}" target="_blank" rel="noopener noreferrer">'
                            if name in rendered:
                                rendered = rendered.replace(name, opening + html.escape(name) + '</a>')
                            else:
                                # Word may split a product name across several formatted runs.
                                rendered = re.sub(r'<p>(.*?)</p>', lambda match: '<p>' + opening + match[1] + '</a></p>', rendered, count=1)
                values.append(f'<{tag}{scope}{colspan}>{rendered}</{tag}>')
            output.append('<tr>' + ''.join(values) + '</tr>')
        caption = html.escape(label)
        current['parts'].append(f'<div class="proposal-table table-scroll" role="region" tabindex="0" aria-label="{caption} — scrollable table"><table><caption>{caption}</caption><thead>{output[0]}</thead><tbody>{"".join(output[1:])}</tbody></table></div>')
flush()

# Keep the showcase navigation in presentation order while preserving all source content.
by_number = {section['number']: section for section in sections}
for target, extra in [(8, 4), (9, 10), (9, 11)]:
    by_number[target]['parts'].extend(['<h3>' + html.escape(by_number[extra]['title']) + '</h3>'] + by_number[extra]['parts'])
order = [1, 2, 6, 7, 8, 3, 9, 12, 13, 14, 15, 5]
sections = [by_number[number] for number in order]
for number, section in enumerate(sections, 1):
    section['source_number'] = section['number']
    section['number'] = number

navigation = '<div class="proposal-nav-inner"><div class="topic-links">' + ''.join(f'<button class="topic-link" type="button" data-topic="proposal-{s["number"]}" aria-controls="proposal-{s["number"]}">{html.escape(s["title"])}</button>' for s in sections) + '</div><details class="topic-more"><summary>More<span class="topic-chevron" aria-hidden="true"></span></summary><div class="topic-menu"></div></details></div>'
content = []
for section in sections:
    number = section['number']
    title = 'What is Rafeeq?' if number == 1 else section['title']
    parts = ''.join(section['parts'])
    if section['source_number'] == 9:
        parts = '<div id="discover-features"></div><details class="proposal-specifications"><summary>Full proposal feature specifications</summary>' + parts + '</details>'
    content.append(f'<section class="panel proposal-section" id="proposal-{number}" aria-labelledby="heading-{number}"'+(' hidden' if number != 1 else '')+f'><h2 id="heading-{number}">{html.escape(title)}</h2>{parts}</section>')

template = (ROOT / 'index.html').read_text(encoding='utf-8')
template = template.replace('<title>Overview | Rafeeq AI Showcase</title>', '<title>Discover More About Rafeeq | Rafeeq</title>')
template = re.sub(r'<meta name="description"[^>]+>', '<meta name="description" content="Discover the Rafeeq proposal: the idea, everyday challenges, features, ADHD symptom tracking, requirements and competitors.">', template)
template = template.replace('<body data-page="overview">', '<body data-page="discover">')
template = template.replace('<link rel="stylesheet" href="css/showcase.css">', '<link rel="stylesheet" href="css/showcase.css">\n<link rel="stylesheet" href="css/proposal.css">')
template = template.replace('<script defer src="js/app.js"></script>', '<script defer src="js/proposal.js"></script>\n<script defer src="js/app.js"></script>')
(ROOT / 'discover.html').write_text(template, encoding='utf-8')
import json
payload = {'navigation': navigation, 'content': ''.join(content)}
(ROOT / 'js/proposal.js').write_text('/* Content transcribed from Rafeeq_Final_Updated_Proposal v3.docx. Regenerate with tools/export_proposal.py. */\nRafeeq.proposal = ' + json.dumps(payload, ensure_ascii=False) + ';\n', encoding='utf-8')
print(f'Exported {len(sections)} sections and 18 tables, preserving inline formatting and lists; competitor directory merged into matrix links.')
