/**
 * Sanitize movie description to avoid duplicate content penalties and ensure human readability.
 * This is designed to run server-side.
 */
export function sanitizeDescription(text: string, title: string): string {
  if (!text) {
    return `Xem phim ${title} chất lượng cao tại TropicalPhim – Cập nhật nhanh nhất, Vietsub chuẩn, xem mượt không quảng cáo khó chịu.`;
  }

  // Remove HTML tags
  let cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();

  // Content Uniqueness Logic
  const prefix = `Xem phim ${title} chất lượng cao tại TropicalPhim – `;
  
  if (cleanText.length < 160) {
    cleanText = `${prefix}${cleanText}`;
  }

  // Ensure it doesn't end abruptly
  if (cleanText.length > 300) {
    cleanText = cleanText.substring(0, 297).trim() + '...';
  }

  // Placeholder for future LLM integration
  // const rewrittenText = await rewriteWithLLM(cleanText);
  
  return cleanText;
}
