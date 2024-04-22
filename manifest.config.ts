import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
const { version } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name:
    env.mode === 'staging'
      ? '[INTERNAL] CRXJS Power Tools'
      : '收藏小工具',
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  permissions: [
    'sidePanel',
    "bookmarks",
    "storage",
    "webRequest",
    "fileSystemProvider",
    "fileBrowserHandler",
    'edge://favorites/*',
    "activeTab",
    "tabs",
  ],
  side_panel: {
    default_path: "index.html"
  },
  action: {
    'default_title': "hello world",
    // 'default_popup': "index.html"
  },
  background: {
    service_worker: "src/background.ts",
    type: "module"
  },
  description: "用于自开发收藏夹上传1",
  host_permissions: [
    "edge://\*/\*",
    "file:///\*/\*",
    "http://\*/\*",
    "https://\*/\*",
  ],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
  }

  // content_scripts: [
  //   {
  //     js: ['src/content.ts'],
  //     matches: [
  //       "*://favorites/*/*",
  //       "https://blog.csdn.net/",
  //       "https://blog.csdn.net/*/*",
  //     ]
  //   }
  // ]

}))