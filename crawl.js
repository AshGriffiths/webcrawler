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

const crawlPage = async (url) => {
    console.log(`crawling ${url}`);
    try {
        const resp = await fetch(url)
        if (resp.status > 399) {
            console.log(`Got HTTP error, status code: ${resp.status}`);
            return;
        }
        const contentType = resp.headers.get('content-type')
        if (!contentType.includes('text/html')) {
            console.log(`Got non-html response: ${contentType}`);
            return;
        }
        console.log(await resp.text());
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
};
