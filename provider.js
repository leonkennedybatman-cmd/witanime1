// provider.js for witanime.life

class WitAnimeProvider {
  async search(query) {
    const searchUrl = `https://witanime.life/?s=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, { credentials: 'omit' });
    const html = await response.text();

    const results = [];
    const itemRegex = /<a[^>]+href="([^"]+)"[^>]*>\s*<div[^>]*class="thumb"[^>]*>[\s\S]*?<h2[^>]*>([^<]+)<\/h2>/gi;
    let match;

    while ((match = itemRegex.exec(html)) !== null) {
      results.push({
        id: match[1],
        title: match[2].trim(),
      });
    }

    return results;
  }

  async getEpisodes(animeId) {
    const response = await fetch(animeId, { credentials: 'omit' });
    const html = await response.text();

    const episodes = [];
    const episodeRegex = /<a[^>]+href="([^"]+)"[^>]*>\s*<span[^>]*class="ep-num"[^>]*>([^<]+)<\/span>/gi;
    let match;

    while ((match = episodeRegex.exec(html)) !== null) {
      episodes.push({
        id: match[1],
        title: match[2].trim(),
      });
    }

    return episodes;
  }

  async getVideoSources(episodeId) {
    const response = await fetch(episodeId, { credentials: 'omit' });
    const html = await response.text();

    const sources = [];
    const iframeRegex = /<iframe[^>]+src="([^"]+)"/gi;
    const videoRegex = /<source[^>]+src="([^"]+)"/gi;
    let match;

    while ((match = iframeRegex.exec(html)) !== null) {
      sources.push({
        url: match[1].trim(),
        type: match[1].includes('.m3u8') ? 'hls' : 'iframe',
      });
    }

    while ((match = videoRegex.exec(html)) !== null) {
      sources.push({
        url: match[1].trim(),
        type: match[1].includes('.m3u8') ? 'hls' : 'direct',
      });
    }

    return sources;
  }
}

module.exports = WitAnimeProvider;
