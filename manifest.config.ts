import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
const { version } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major = '1', minor = '0', patch = '0', label = '1'] = version

  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)
export default defineManifest(async (env) => ({
  // 版本
  manifest_version: 3,
  // 工具名
  name:
    env.mode === 'staging'
      ? '[INTERNAL] CRXJS Power Tools'
      : env.mode === 'production' ? '收藏小工具' : '收藏小工具测试',

  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  // 功能允许,可能需要使用的功能,请在这里写入
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
  // 首页
  side_panel: {
    default_path: "index.html"
  },
  action: {
    'default_title': "hello world",
    // 'default_popup': "index.html"
  },
  // 后台程序设置
  background: {
    service_worker: "src/background.ts",
    type: "module"
  },
  description: "用于自开发收藏夹上传",
  // 允许存在的域名,我这样写,基本可以通吃所有网址
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