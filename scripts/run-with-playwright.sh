#!/bin/bash
# Run Pegasus Atlas with Playwright automation engine

export APP_CONFIG='{"automation":"playwright","parser":"cheerio","database":"lowdb"}'
npm run dev
