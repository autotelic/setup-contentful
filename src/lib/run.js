export const run = async ({
  core,
  github,
  toolCache
}) => {
  const githubToken = core.getInput('githubToken')
  const version = core.getInput('version')

  const octokit = github.getOctokit(githubToken)

  const getReleaseArgs = {
    owner: 'contentful',
    repo: 'contentful-cli'
  }

  const getReleaseMethod = version === 'latest'
    ? 'getLatestRelease'
    : 'getReleaseByTag'

  if (version !== 'latest') {
    getReleaseArgs.tag = version
  }

  const { data: release } = await octokit.rest.repos[getReleaseMethod](getReleaseArgs)
  const { assets, name: versionName } = release
  const { browser_download_url: downloadUrl } = assets.find(({ name }) => name.includes('linux'))

  const toolPath = toolCache.find('contentful', versionName)
  if (toolPath) {
    core.addPath(toolPath)
  } else {
    core.info(`Downloading contentful cli ${versionName} from ${downloadUrl}...`)
    const zipPath = await toolCache.downloadTool(downloadUrl)
    const executablePath = '/usr/local/bin'
    const extractedPath = await toolCache.extractZip(zipPath, executablePath)
    const cachedPath = await toolCache.cacheDir(extractedPath, 'contentful', versionName)
    core.addPath(cachedPath)
  }

  core.info(`contentful cli ${versionName} is installed`)
}
