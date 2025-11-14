#!/bin/bash
# Run Pegasus Atlas with Selenium automation engine

export APP_CONFIG='{"automation":"selenium","parser":"cheerio","database":"lowdb"}'
npm run dev
