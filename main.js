require('yargs').command('$0 [url]', 'Crawl websites following links, starting from the given website.', args => {
    args.positional('url', {
        describe: 'Base URL to start crawling from.'
    }).help();
}, argv => {
    if (argv._.length > 0) {
        console.error("Too many options. Call with help to see usage information.");
        process.exit();
    }
    if (argv.url === undefined) {
        console.error("Please provide a base url. Call with help to see usage information.");
        process.exit();
    }
    console.log(`Starting crawl at: ${argv.url}`);
}).argv;
