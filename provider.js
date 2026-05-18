// provider.js for witanime.life

function WitAnimeProvider() {}

WitAnimeProvider.prototype.search = function (query) {
  var searchUrl = 'https://witanime.life/?s=' + encodeURIComponent(query);
  var html = fetchContent(searchUrl);
  var results = [];
  var itemRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(?:[\s\S]*?<h[12][^>]*>([^<]+)<\/h[12]>|([^<]+?))<\/a>/gi;
  var match;

  while ((match = itemRegex.exec(html)) !== null) {
    var title = (match[2] || match[3] || '').trim();
    if (title.length > 1) {
      results.push({
        id: match[1],
        title: title,
      });
    }
  }

  return results;
};

WitAnimeProvider.prototype.getEpisodes = function (animeId) {
  var html = fetchContent(animeId);
  var episodes = [];
  var episodeRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(?:[\s\S]*?<span[^>]*>([^<]+)<\/span>|([^<]+?))<\/a>/gi;
  var match;

  while ((match = episodeRegex.exec(html)) !== null) {
    var title = (match[2] || match[3] || '').trim();
    if (title.length > 0) {
      episodes.push({
        id: match[1],
        title: title,
      });
    }
  }

  return episodes;
};

WitAnimeProvider.prototype.getVideoSources = function (episodeId) {
  var html = fetchContent(episodeId);
  var sources = [];
  var regexes = [
    /<iframe[^>]+src=["']([^"']+)["']/gi,
    /<source[^>]+src=["']([^"']+)["']/gi,
  ];
  var match;

  for (var i = 0; i < regexes.length; i += 1) {
    while ((match = regexes[i].exec(html)) !== null) {
      sources.push({
        url: match[1].trim(),
        type: match[1].indexOf('.m3u8') !== -1 ? 'hls' : 'direct',
      });
    }
  }

  return sources;
};

function fetchContent(url) {
  if (typeof fetchUrl === 'function') {
    return fetchUrl(url);
  }
  if (typeof request === 'function') {
    return request(url);
  }
  if (typeof fetch === 'function') {
    // Seanime likely does not support browser fetch, but keep this fallback.
    throw new Error('Use fetchUrl or request in Seanime environment');
  }
  throw new Error('No supported HTTP request API available in Seanime provider');
}

module.exports = WitAnimeProvider;
