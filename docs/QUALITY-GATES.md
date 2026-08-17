# Quality Gates

本文件定义代码变更完成前必须执行的机器验证。

具体命令与当前项目真实配置保持一致。

---

# 1. Verification Principle

完成代码修改不等于完成任务。

只有通过适合该任务的验证以后，修改才可以被认为完成。

---

# 2. Unified Verification

统一验证入口（真实存在）：

```bash
npm run verify
```

等价于依次执行：

1. `npm run format:check`（prettier --check .）
2. `npm run lint`（eslint .）
3. `npm run test:run`（vitest run）
4. `npm run build`（tsc -b && vite build）
5. `npm run docs:generate`（node scripts/generate-docs.mjs）

---

# 3. Verification Levels

## L0 Change

至少执行：`npm run lint` 与相关 TypeCheck。

如果存在相关测试：执行相关测试。

## L1 Change

执行：TypeCheck、Lint、Relevant Tests。必要时 Build。

## L2 Change

执行：TypeCheck、Lint、Full Test Suite、Build。必要时 Integration Tests。

## L3 Change

除完整验证（`npm run verify`）以外，需要人工 Review。

---

# 4. Standard Gates

## Format

Command: `npm run format:check`（`prettier --check .`）

## Type Check

Command: `npm run typecheck`（`tsc -b`）

Build 中已包含 TypeCheck。

## Lint

Command: `npm run lint`（`eslint .`）

## Unit Test

Command: `npm run test:run`（`vitest run`）

## Integration Test

Command: NOT AVAILABLE（项目当前无集成测试）

## E2E

Command: NOT AVAILABLE（项目当前无 E2E 测试）

## Build

Command: `npm run build`（`tsc -b && vite build`）

## Docs Generation

Command: `npm run docs:generate`

---

# 5. Result Rules

允许的状态只有：PASS / FAIL / NOT RUN / NOT AVAILABLE。

## PASS

命令真实执行且 exit code 成功。

## FAIL

命令执行失败，必须报告主要错误。

## NOT RUN

存在该验证，但本次没有执行，必须说明原因。

## NOT AVAILABLE

项目当前没有该验证能力。

---

# 6. No Fake Success

禁止使用"应该通过""看起来正常""理论上没问题"代替 PASS。

---

# 7. Documentation Generation

如果修改影响 Routes、API、UI Structure、Dependencies：

执行 `npm run docs:generate` 刷新 docs/generated/。

禁止手工编辑 docs/generated/ 下的文件。

---

# 8. CI

CI 至少重复执行：TypeCheck、Lint、Tests、Build。

本地 PASS 但 CI 失败：最终状态仍然是失败。

---

# 9. Final Verification Report

AI 完成开发任务时使用：

Verification:

TypeCheck: PASS / FAIL / NOT RUN / NOT AVAILABLE
Lint: PASS / FAIL / NOT RUN / NOT AVAILABLE
Tests: PASS / FAIL / NOT RUN / NOT AVAILABLE
Build: PASS / FAIL / NOT RUN / NOT AVAILABLE
Docs Generation: PASS / FAIL / NOT RUN / NOT AVAILABLE
