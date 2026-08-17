# Quality Gates

本文件定义代码变更完成前必须执行的机器验证。

具体命令必须与当前项目真实配置保持一致。

---

# 1. Verification Principle

完成代码修改不等于完成任务。

只有通过适合该任务的验证以后：

修改才可以被认为完成。

---

# 2. Unified Verification

优先使用项目统一验证命令：

[由初始化阶段根据实际项目填写]

例如：

npm run verify

或：

make verify

不要填写项目中不存在的命令。

---

# 3. Verification Levels

## L0 Change

至少执行：

相关Lint / TypeCheck

如果存在相关测试：

执行相关测试。

---

## L1 Change

执行：

TypeCheck
Lint
Relevant Tests

必要时：

Build

---

## L2 Change

执行：

TypeCheck
Lint
Relevant Tests
Full Test Suite
Build

必要时：

Integration Tests

---

## L3 Change

除完整验证以外：

需要人工Review。

涉及数据库时：

检查 Migration。

涉及API时：

检查兼容性。

涉及Infrastructure时：

检查 Rollback Plan。

---

# 4. Standard Gates

根据项目实际支持情况填写：

## Format

Command:

[actual command]

## Type Check

Command:

[actual command]

## Lint

Command:

[actual command]

## Unit Test

Command:

[actual command]

## Integration Test

Command:

[actual command]

## E2E

Command:

[actual command]

## Build

Command:

[actual command]

---

# 5. Result Rules

允许的状态只有：

PASS
FAIL
NOT RUN
NOT AVAILABLE

---

## PASS

命令真实执行且 exit code 成功。

## FAIL

命令执行失败。

必须报告主要错误。

## NOT RUN

存在该验证，但本次没有执行。

必须说明原因。

## NOT AVAILABLE

项目当前没有该验证能力。

---

# 6. No Fake Success

禁止使用：

“应该通过”
“看起来正常”
“理论上没问题”

代替 PASS。

---

# 7. Documentation Generation

如果修改影响：

Routes
API
UI Structure
Dependencies

执行：

[actual docs generation command]

例如：

npm run docs:generate

仅在项目真实存在该命令后填写。

---

# 8. CI

CI应该至少重复执行：

TypeCheck
Lint
Tests
Build

本地PASS但CI失败：

最终状态仍然是失败。

---

# 9. Final Verification Report

AI完成开发任务时使用：

Verification:

TypeCheck: PASS / FAIL / NOT RUN / NOT AVAILABLE
Lint: PASS / FAIL / NOT RUN / NOT AVAILABLE
Tests: PASS / FAIL / NOT RUN / NOT AVAILABLE
Build: PASS / FAIL / NOT RUN / NOT AVAILABLE
Docs Generation: PASS / FAIL / NOT RUN / NOT AVAILABLE
