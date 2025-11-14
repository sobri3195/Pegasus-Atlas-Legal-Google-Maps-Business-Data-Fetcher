@echo off
REM Run Pegasus Atlas with SQLite database

set APP_CONFIG={"automation":"puppeteer","parser":"cheerio","database":"sqlite"}
npm run dev
