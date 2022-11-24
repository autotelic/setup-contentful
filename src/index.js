import * as core from '@actions/core'
import * as github from '@actions/github'
import * as toolCache from '@actions/tool-cache'

import { run } from './lib/run.js'

;(async () => {
  run({ core, github, toolCache}).catch(error => {
    core.setFailed(error.message)
  })
})()
