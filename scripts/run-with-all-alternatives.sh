#!/bin/bash
# Run Pegasus Atlas with all alternative engines

export APP_CONFIG='{"automation":"playwright","parser":"dom-inspector","database":"sqlite"}'
npm run dev
