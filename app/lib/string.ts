const HTML_TAG_REGEX = /<[^>]*>/g;

/**
 * Strips HTML tags and normalises whitespace from a raw HTML string.
 * Safe to call with undefined/null — always returns a string.
 */
export function stripHtml(html?: string): string {
  if (!html) return '';
  
  let text = html.replace(HTML_TAG_REGEX, '').trim();
  
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Fix Ophim API weird double quotes (e.g., ""vệ binh"")
  text = text.replace(/""/g, '"');

  // Fix hanging characters/words if the text was abruptly cut off by API (e.g. "nạn nh", "đường ph")
  // Using CSS line-clamp does create ellipsis, but if the API already cuts it, we should clean it up
  if (text.length > 50 && !/[.!?`"'}]$/.test(text.trim())) {
    // Remove the last partial word and append '...'
    text = text.replace(/\s+\S+$/, '') + '...';
  }

  return text;
}
