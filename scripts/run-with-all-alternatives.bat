@echo off
REM Run Pegasus Atlas with all alternative engines

set APP_CONFIG={"automation":"playwright","parser":"dom-inspector","database":"sqlite"}
npm run dev
