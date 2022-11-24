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
  const {
    tarball_url: tarballUrl,
    name: versionName
  } = release

  const toolPath = toolCache.find('contentful', versionName)
  if (toolPath) {
    core.addPath(toolPath)
  } else {
    core.info(`Downloading contentful cli ${versionName} from ${tarballUrl}...`)
    const tarPath = await toolCache.downloadTool(tarballUrl)
    const extractedPath = await toolCache.extractTar(tarPath)
    const cachedPath = await toolCache.cacheDir(extractedPath, 'contentful', versionName)
    core.addPath(cachedPath)
  }

  core.info(`contentful cli ${versionName} is installed`)


}
