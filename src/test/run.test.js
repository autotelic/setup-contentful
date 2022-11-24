import test from 'ava'
import sinon from 'sinon'
import * as github from '@actions/github'

import { run } from '../lib/run.js'

test('run', async t => {
  const getInput = sinon.stub()
  getInput.withArgs('githubToken').returns('')
  getInput.withArgs('version').returns('latest')
  // getInput.withArgs('version').returns('v1.16.8')
  const core = { getInput }

  await run({ core, github })
  t.pass()
})
