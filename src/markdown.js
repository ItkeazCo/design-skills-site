// Minimal Markdown for docs/STORY.md: headings, paragraphs, lists, images, bold, italic, code.
const inline = (s) => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, a, src) => `<img alt="${a}" src="${src.replace('../public/', '/')}" loading="lazy" />`)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

export function markdown(md) {
  return md.trim().split(/\n{2,}/).map((block) => {
    const lines = block.split('\n');
    if (block.startsWith('# ')) return `<h1>${inline(block.slice(2))}</h1>`;
    if (block.startsWith('## ')) return `<h2>${inline(block.slice(3))}</h2>`;
    if (lines.every((l) => l.startsWith('- '))) return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    if (lines.every((l) => l.startsWith('!['))) return `<div class="shots">${lines.map(inline).join('')}</div>`;
    return `<p>${inline(block)}</p>`;
  }).join('');
}
