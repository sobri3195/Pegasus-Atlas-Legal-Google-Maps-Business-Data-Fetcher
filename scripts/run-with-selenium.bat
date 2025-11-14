@echo off
REM Run Pegasus Atlas with Selenium automation engine

set APP_CONFIG={"automation":"selenium","parser":"cheerio","database":"lowdb"}
npm run dev
