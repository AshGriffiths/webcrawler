const { JSDOM } = require('jsdom');

const normalizeURL = url => {
    const urlObj = new URL(url);
    let fullPath = `${urlObj.host}${urlObj.pathname}`;
    if (fullPath.length > 0 && fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0, -1);
    }
    return fullPath;
};

const getURLsFromHTML = (html, baseURL) => {
    const urls = [];
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll('a');
    for (const link of links) {
        if (link.href.slice(0, 1) === '/') {
            try {
                urls.push(new URL(link.href, baseURL).href);
            } catch (err) {
                console.log(`${err.message}: ${link.href}`);
            }
        } else {
            try {
                urls.push(new URL(link.href).href);
            } catch (err) {
                console.log(`${err.message}: ${link.href}`);
            }
        }
    }
    return urls
}

const crawlPage = async (baseURL, currentURL, pages) => {
    const currentUrlObj = new URL(currentURL);
    const baseUrlObj = new URL(baseURL);
    // Leaving base domain, so just stop
    if (currentUrlObj.hostname !== baseUrlObj.hostname){
        return pages;
    }
    const normalizedURL = normalizeURL(currentURL);
    // Already visited?
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL] ++;
        return pages;
    }
    // New link on the domain
    pages[normalizedURL] = 1;
    console.log(`crawling ${currentURL}`);
    let html = '';
    try {
        const resp = await fetch(currentURL)
        if (resp.status > 399) {
            console.log(`Got HTTP error, status code: ${resp.status}`);
            return pages;
        }
        const contentType = resp.headers.get('content-type')
        if (!contentType.includes('text/html')) {
            console.log(`Got non-html response: ${contentType}`);
            return pages;
        }
        html = await resp.text();
    } catch (err) {
        console.log(err.message);
    }
    const nextURLs = getURLsFromHTML(html, baseURL);
    for (const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages);
    }
    return pages;
};

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
};
