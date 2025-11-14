@echo off
REM Run Pegasus Atlas with Playwright automation engine

set APP_CONFIG={"automation":"playwright","parser":"cheerio","database":"lowdb"}
npm run dev
