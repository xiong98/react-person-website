# AI Development Entry Point

本文件是所有 AI 编码助手进入本项目时的第一入口。

开始任何任务前：

1. 阅读本文件；
2. 定位任务涉及的真实代码；
3. 根据任务类型按需读取相关文档；
4. 不要默认读取整个 docs/。

---

# 1. Source of Truth

优先级：

Source Code

> 

Tests / Schema / Config

> 

Generated Documentation

> 

Architecture / Manual / ADR

> 

AI推测

如果文档与代码冲突：

以实际运行代码为准。

同时报告文档可能已经过期。

禁止通过猜测补全未知信息。

---

# 2. Standard Workflow

普通开发任务遵循：

READ
↓
PLAN
↓
IMPACT
↓
CHANGE
↓
VERIFY
↓
DOC
↓
REPORT

简单 L0 修改可以简化 PLAN。

---

# 3. READ

修改前：

- 找到真实实现；
- 检查调用方；
- 检查依赖；
- 检查相关测试；
- 检查相关配置。

不要找到第一个相似文件就立即修改。

---

# 4. Context Routing

根据任务加载文档。

## UI / Page

读取：

docs/generated/UI-TRACE.md

以及相关：

Page
Component
Store / Hook
API

## Route

读取：

docs/generated/ROUTES.md

## API

读取：

docs/generated/API-TRACE.md

以及对应：

Controller
Service
Repository
Model

## Shared Module

读取：

docs/generated/DEPENDENCIES.md

并检查主要调用方。

## Architecture

读取：

docs/ARCHITECTURE.md
docs/adr/

## Business Rule

读取：

docs/PROJECT-MANUAL.md
docs/DOMAIN-GLOSSARY.md

## Database

读取：

Schema
Migration
Model
Repository
相关 ADR

## 提交前

读取：

docs/QUALITY-GATES.md

---

# 5. Risk Levels

## L0

低风险：

文案
CSS
注释
局部UI
非共享内部实现

可直接修改并验证。

## L1

普通风险：

单模块逻辑
普通组件
普通Service
普通Bug

确认影响范围后修改。

## L2

高风险：

Shared Component
Shared Utility
Shared Types
Global Store
Public API
核心 Config
多模块共享逻辑

必须先执行 Impact Analysis。

## L3

极高风险：

Database Schema
Migration
Data Delete
Authentication
Authorization
Payment
Secrets
Encryption
Production Configuration
CI/CD核心配置
Breaking Change
大规模架构调整

禁止直接执行。

必须先：

PLAN
+
IMPACT ANALYSIS
+
等待人工确认。

---

# 6. Minimal Change

只修改完成当前任务所必须的内容。

禁止：

- 顺便重构；
- 顺便升级依赖；
- 顺便改目录；
- 顺便替换框架；
- 顺便统一命名；
- 顺便删除未知代码。

如果发现其他问题：

报告。

不要扩大当前任务范围。

---

# 7. Existing Architecture

遵守当前项目：

- 目录结构；
- 命名；
- 编码风格；
- Error Handling；
- API Style；
- Testing Style；
- Architecture。

不要因为存在“更现代”的方案就自行替换。

重大设计决策优先查询：

docs/adr/

---

# 8. Generated Documentation

以下目录：

docs/generated/

属于自动生成内容。

禁止手工直接维护。

代码结构发生变化后：

运行项目定义的 docs generation command。

---

# 9. Verification

代码修改完成以后：

执行：

docs/QUALITY-GATES.md

定义的验证流程。

禁止声称：

PASS

除非命令真实执行成功。

无法执行时明确报告：

NOT RUN

以及原因。

---

# 10. Documentation Update

只有确实发生相关变化时才更新文档。

Architecture变化：

更新 ARCHITECTURE / ADR。

Business Rule变化：

更新 PROJECT-MANUAL。

Route / API / Dependency变化：

重新生成 docs/generated。

不要为了“流程完整”而无意义修改文档。

---

# 11. Security

禁止：

- 输出Secrets；
- 提交Secrets；
- 写入真实密码；
- 写入真实Token；
- 暴露Private Key；
- 绕过安全检查；
- 未确认执行数据破坏操作。

任何破坏性操作默认按 L3 处理。

---

# 12. Final Report

每次完成任务后报告：

## Changed

修改了什么。

## Why

为什么这样修改。

## Impact

影响哪些模块。

## Verification

实际运行了哪些检查，以及结果。

## Documentation

更新了哪些文档。

## Remaining Risks

仍存在什么风险。

不得只回复：

“已完成”
“应该可以”
“看起来没问题”

## Task Entry

首次初始化：
→ INITIALIZE_PROJECT.md

正常开发任务：
→ 按本文件执行

人工直接修改代码后的检查：
→ MANUAL_CHANGE_REVIEW.md
