#!/usr/bin/env node
/**
 * Project structure scanner / documentation generator.
 *
 * Scans `src/` and writes:
 *   docs/generated/ROUTES.md
 *   docs/generated/UI-TRACE.md
 *   docs/generated/API-TRACE.md
 *   docs/generated/DEPENDENCIES.md
 *
 * Pure Node built-ins only. Run with: npm run docs:generate
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')
const OUT = join(ROOT, 'docs', 'generated')

const HEADER =
  '<!-- AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. SOURCE CODE IS THE SOURCE OF TRUTH. -->\n'

const IGNORED_FILES = new Set(['auto-imports.d.ts', 'vite-env.d.ts'])

const SKIP_RE = /\.(test|spec|stories)\.(ts|tsx)$/

function listSourceFiles(dir = SRC) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...listSourceFiles(full))
    } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      if (IGNORED_FILES.has(entry) || SKIP_RE.test(entry)) continue
      files.push(full)
    }
  }
  return files
}

function toProjectPath(file) {
  return relative(ROOT, file).split(sep).join('/')
}

function stripComments(code) {
  // 去掉 /* */ 与 // 行注释，避免把注释里的 import 误当成真实依赖
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:/'"`])\/\/.*$/gm, '$1')
}
function extractImports(code) {
  const imports = new Set()
  const re = /import\s+(?:type\s+)?(?:\{[\s\S]*?\}|[^'"\n]+?)\s+from\s+['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(stripComments(code))) !== null) imports.add(m[1])
  return [...imports]
}

function extractExportedNames(code) {
  const names = new Set()
  const re = /export\s+(?:default\s+)?(?:(?:async\s+)?function\s+(\w+)|const\s+(\w+)|type\s+(\w+))/g
  let m
  while ((m = re.exec(stripComments(code))) !== null) {
    m.slice(1)
      .filter(Boolean)
      .forEach((n) => names.add(n))
  }
  return [...names]
}

function resolveLocalImport(importingFile, spec) {
  if (spec.startsWith('@/')) {
    return join(SRC, spec.slice(2))
  }
  if (spec.startsWith('./') || spec.startsWith('../')) {
    return join(dirname(importingFile), spec)
  }
  return null
}

const files = listSourceFiles()
const fileContent = new Map()
for (const f of files) fileContent.set(f, readFileSync(f, 'utf8'))

// ---- build local import graph -------------------------------------------
const importersOf = new Map() // targetProjectPath -> [{ file, names }]
const packageUsage = new Map() // package name -> count

for (const f of files) {
  const code = fileContent.get(f)
  for (const spec of extractImports(code)) {
    const target = resolveLocalImport(f, spec)
    if (target) {
      const key = toProjectPath(target)
      if (!importersOf.has(key)) importersOf.set(key, [])
      importersOf.get(key).push({ file: toProjectPath(f), spec })
    } else if (!spec.startsWith('node:')) {
      const pkg = spec
        .split('/')
        .slice(0, spec.startsWith('@') ? 2 : 1)
        .join('/')
      packageUsage.set(pkg, (packageUsage.get(pkg) ?? 0) + 1)
    }
  }
}

// ---- simple import-graph cycle detection ---------------------------------
function findCycles() {
  const edges = new Map()
  for (const f of files) {
    edges.set(
      f,
      extractImports(f)
        .map((s) => resolveLocalImport(f, s))
        .filter(Boolean),
    )
  }
  const visiting = new Set()
  const visited = new Set()
  const stack = []
  const cycles = []
  const prefix = SRC.endsWith(sep) ? SRC : SRC + sep

  function dfs(node) {
    if (visiting.has(node)) {
      const idx = stack.indexOf(node)
      const cycle = stack.slice(idx).concat(node).map(toProjectPath)
      cycles.push(cycle)
      return
    }
    if (visited.has(node)) return
    visiting.add(node)
    stack.push(node)
    for (const next of edges.get(node) ?? []) {
      if (next.startsWith(prefix)) dfs(next)
    }
    stack.pop()
    visiting.delete(node)
    visited.add(node)
  }

  for (const f of files) dfs(f)
  return [...new Set(cycles.map((c) => c.join(' -> ')))]
}

// ---- ROUTES ---------------------------------------------------------------
function buildRoutes() {
  const routerFile = join(SRC, 'router.tsx')
  if (!existsSync(routerFile)) return '无路由定义文件（src/router.tsx 不存在）\n'
  const code = fileContent.get(routerFile) ?? readFileSync(routerFile, 'utf8')

  const componentToFile = new Map()
  for (const f of files) {
    for (const name of extractExportedNames(fileContent.get(f))) {
      if (!componentToFile.has(name)) componentToFile.set(name, toProjectPath(f))
    }
  }

  const routes = []
  const pathRe = /path:\s*['"]([^'"]+)['"]/g
  const compRe = /component:\s*(\w+)/g
  const paths = [...code.matchAll(pathRe)].map((m) => m[1])
  const comps = [...code.matchAll(compRe)].map((m) => m[1])
  for (let i = 0; i < Math.max(paths.length, comps.length); i++) {
    routes.push({
      path: paths[i] ?? '(root layout)',
      component: comps[i] ?? '—',
      file: comps[i] ? (componentToFile.get(comps[i]) ?? '[UNRESOLVED]') : 'src/router.tsx',
      layout: 'root layout（src/router.tsx rootRoute）',
    })
  }

  const lines = [
    '# Routes',
    '',
    '| Route | Component | File | Layout |',
    '| --- | --- | --- | --- |',
    ...routes.map((r) => `| \`${r.path}\` | ${r.component} | ${r.file} | ${r.layout} |`),
    '',
    '说明：路由在 `src/router.tsx` 中通过 TanStack Router 以代码方式声明（createRootRoute / createRoute / createRouter）。',
    '',
  ]
  return lines.join('\n')
}

// ---- UI-TRACE -------------------------------------------------------------
function buildUiTrace() {
  const lines = [
    '# UI Trace',
    '',
    '| Page / Component | Physical File | Route | Store / Hook | API Client | Major Dependencies |',
    '| --- | --- | --- | --- | --- | --- |',
  ]

  const isRouteComponent = new Set()
  {
    const routerFile = join(SRC, 'router.tsx')
    const code = fileContent.get(routerFile) ?? ''
    const compRe = /component:\s*(\w+)/g
    for (const m of code.matchAll(compRe)) isRouteComponent.add(m[1])
  }

  for (const f of files) {
    if (!f.endsWith('.tsx')) continue
    const code = fileContent.get(f)
    const names = extractExportedNames(code)
    if (names.length === 0) continue
    const imports = extractImports(code)
    const localImports = imports.map((s) => resolveLocalImport(f, s)).filter(Boolean)
    const storesHooks = localImports
      .filter((p) => p.includes(join('src', 'store')) || p.includes(join('src', 'hooks')))
      .map(toProjectPath)
    const apiClients = localImports.filter((p) => p.includes(join('src', 'lib'))).map(toProjectPath)
    const pkgs = imports
      .filter((s) => !s.startsWith('@/') && !s.startsWith('.') && !s.startsWith('node:'))
      .join(', ')
    const route =
      names
        .filter((n) => isRouteComponent.has(n))
        .map((n) => `/ → ${n}`)
        .join(' ') || '—'
    lines.push(
      `| ${names.join(', ')} | ${toProjectPath(f)} | ${route} | ${storesHooks.join(', ') || '—'} | ${apiClients.join(', ') || '—'} | ${pkgs || '—'} |`,
    )
  }
  lines.push('')
  return lines.join('\n')
}

// ---- API-TRACE ------------------------------------------------------------
function buildApiTrace() {
  const apiFile = join(SRC, 'lib', 'api.ts')
  if (!existsSync(apiFile)) return '未发现 API 客户端（src/lib/api.ts）\n'
  const code = fileContent.get(apiFile) ?? readFileSync(apiFile, 'utf8')

  const calls = []
  const callRe = /api\.(get|post|put|patch|delete)\s*<\s*[^>]*\s*>?\s*\(\s*['"`]([^'"`]+)['"`]/g
  let m
  while ((m = callRe.exec(code)) !== null) {
    calls.push({ method: m[1].toUpperCase(), endpoint: m[2] })
  }
  const fallbackRe = /baseURL:\s*[^']*['"`]([^'"`]+)['"`]/
  const base = code.match(fallbackRe)?.[1] ?? 'import.meta.env.VITE_API_BASE_URL'

  const exportedFns = extractExportedNames(code)
  const callersOfFn = new Map()
  for (const fn of exportedFns) {
    const callers = []
    for (const f of files) {
      if (f === apiFile) continue
      if (new RegExp(`\\b${fn}\\b`).test(fileContent.get(f))) {
        callers.push(toProjectPath(f))
      }
    }
    callersOfFn.set(fn, callers)
  }

  const lines = [
    '# API Trace',
    '',
    '| Method | Endpoint | API Client Function | Frontend Caller |',
    '| --- | --- | --- | --- |',
  ]
  const seen = new Set()
  for (const call of calls) {
    if (seen.has(call.endpoint)) continue
    seen.add(call.endpoint)
    const fn =
      exportedFns.find((name) => name !== 'api' && (callersOfFn.get(name)?.length ?? 0) > 0) ?? '—'
    const callers = callersOfFn.get(fn) ?? []
    lines.push(`| ${call.method} | \`${call.endpoint}\` | ${fn} | ${callers.join(', ') || '—'} |`)
  }
  lines.push(
    '',
    `Axios baseURL：\`${base}\`（可用环境变量 VITE_API_BASE_URL 覆盖）`,
    '',
    '说明：当前项目为纯前端演示，无后端 Controller / Service / Repository / Model；数据来自第三方公开 Mock API。',
    '',
  )
  return lines.join('\n')
}

// ---- DEPENDENCIES ---------------------------------------------------------
function buildDependencies() {
  const rows = [...importersOf.entries()]
    .map(([target, importers]) => ({ target, count: importers.length, importers }))
    .sort((a, b) => b.count - a.count)

  const top20 = rows.slice(0, 20)
  const shared = rows.filter((r) => r.count >= 3)
  const cycles = findCycles()

  const lines = [
    '# Dependencies',
    '',
    `## Top ${top20.length} 高频被引用文件`,
    '',
    '| 文件 | 被引用次数 | 引用方 |',
    '| --- | --- | --- |',
    ...top20.map(
      (r) => `| ${r.target} | ${r.count} | ${r.importers.map((i) => i.file).join(', ')} |`,
    ),
    '',
    '## Shared Modules（被 3 个及以上文件引用）',
    '',
    ...(shared.length ? shared.map((r) => `- ${r.target}（${r.count} 处引用）`) : ['无']),
    '',
    '## 循环依赖',
    '',
    ...(cycles.length ? cycles.map((c) => `- ${c}`) : ['未发现循环依赖']),
    '',
    '## 第三方依赖使用次数',
    '',
    '| Package | 被 import 次数 |',
    '| --- | --- |',
    ...[...packageUsage.entries()].sort((a, b) => b[1] - a[1]).map(([p, n]) => `| ${p} | ${n} |`),
    '',
    '引用次数只是风险判断因素之一，不能简单认为"被引用多 = 禁止修改"。',
    '',
  ]
  return lines.join('\n')
}

// ---- write ----------------------------------------------------------------
mkdirSync(OUT, { recursive: true })
const targets = {
  'ROUTES.md': buildRoutes(),
  'UI-TRACE.md': buildUiTrace(),
  'API-TRACE.md': buildApiTrace(),
  'DEPENDENCIES.md': buildDependencies(),
}
for (const [name, body] of Object.entries(targets)) {
  writeFileSync(join(OUT, name), HEADER + body)
  console.log(`generated docs/generated/${name}`)
}
console.log('docs:generate done')
