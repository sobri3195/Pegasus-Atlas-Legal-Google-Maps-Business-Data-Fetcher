#!/bin/bash
# Run Pegasus Atlas with SQLite database

export APP_CONFIG='{"automation":"puppeteer","parser":"cheerio","database":"sqlite"}'
npm run dev
