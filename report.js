const printReport = pages => {
    console.log('==========');
    console.log('REPORT');
    console.log('==========');
    const sortedPages = sortPages(pages);
    for (const sortedPage of sortedPages) {
        const url = sortedPage[0];
        const count = sortedPage[1];
        console.log(`Found ${count} internal links to ${url}`);
    }
};

const sortPages = pages => {
    const pagesEntries = Object.entries(pages);
    pagesEntries.sort((pageOne, pageTwo) => {
        return pageTwo[1] - pageOne[1];
    })
    return pagesEntries;
};

module.exports = {
    printReport,
    sortPages
}