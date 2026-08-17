# Project AI Governance Bootstrap

你正在第一次接触这个项目。

请执行一次完整的：

**Project Discovery & AI Governance Initialization**

目标不是立即开发新功能，而是：

1. 理解项目真实结构；
2. 建立 AI 与人类共同维护项目所需的最小治理体系；
3. 建立自动验证机制；
4. 建立项目知识入口；
5. 让未来的 AI 编码任务不再需要重新扫描整个项目。

---

## 0. 最重要原则

整个初始化过程遵守：

> Source Code = Truth  
> Tests / CI = Verification  
> Documentation = Intent  
> ADR = Why  
> Git = History  
> Human = High-risk Decision Maker  
> AI = Controlled Engineering Assistant

禁止根据经验猜测项目结构。

所有：

- 文件；
- 路由；
- API；
- 数据库字段；
- Service；
- Store；
- Component；
- 配置；
- 测试命令；

必须根据当前项目真实代码确认。

---

# 1. 第一步：扫描项目

首先读取当前项目。

忽略：

.git
node_modules
dist
build
coverage
.cache
vendor
第三方依赖
生成产物
临时文件

识别：

- 项目语言；
- Framework；
- Package Manager；
- 应用入口；
- 前端入口；
- 后端入口；
- 页面；
- 路由；
- API；
- Controller；
- Service；
- Repository；
- Model；
- Schema；
- Migration；
- Store；
- Config；
- Tests；
- CI/CD；
- Infrastructure；
- Deployment。

不要单纯根据文件夹名称判断职责。

必须结合：

- import；
- 调用关系；
- 路由注册；
- 实际代码；
- 测试；

确认。

---

# 2. 找出核心调用链

根据项目真实情况识别主要执行链。

例如前端：

Route
↓
Page
↓
Component
↓
Hook / Store
↓
API Client

例如后端：

Route
↓
Controller
↓
Service
↓
Repository
↓
Database

如果实际架构不同，以实际代码为准。

---

# 3. 创建治理结构

根据项目实际情况创建：

AGENTS.md
MANUAL_CHANGE_REVIEW.md

docs/
├── CONSTITUTION.md
├── QUALITY-GATES.md
├── ARCHITECTURE.md
├── PROJECT-MANUAL.md
├── DOMAIN-GLOSSARY.md
├── adr/
│   └── README.md
└── generated/
    ├── ROUTES.md
    ├── UI-TRACE.md
    ├── API-TRACE.md
    └── DEPENDENCIES.md

scripts/
└── 项目结构扫描 / 文档生成脚本

.github/
├── workflows/
│   └── ci.yml
└── PULL_REQUEST_TEMPLATE.md

如果某个文件对当前项目没有实际价值：

不要机械创建空文件。

在最终报告中说明：

NOT APPLICABLE

以及原因。

---

# 4. 创建 AGENTS.md

AGENTS.md 是未来所有 AI 编码工具的唯一默认入口。参考： AGENTS_参考.md

要求：

- 简短；

- 稳定；

- 不复制项目详细信息；

- 不复制代码结构；

- 不复制整个项目说明书；

- 主要负责告诉 AI：
  
  1. 工作流程；
  2. 禁止事项；
  3. 风险等级；
  4. 不同任务应该继续读取什么文件。

未来每次 AI 开始任务：

首先只需要阅读：

AGENTS.md

然后根据 AGENTS.md 决定是否继续加载：

ARCHITECTURE
PROJECT-MANUAL
ADR
generated traces
QUALITY-GATES

AGENTS.md 中必须包含一个简短的 Task Routing：

```text
## Task Entry

首次初始化：
→ INITIALIZE_PROJECT.md

正常开发任务：
→ 按本文件执行

人工直接修改代码后的检查：
→ MANUAL_CHANGE_REVIEW.md
```

该路由只负责告诉 AI 不同任务应该进入哪个流程，不要在 AGENTS.md 中复制 MANUAL_CHANGE_REVIEW.md 的详细规则。

---

# 5. 创建 MANUAL_CHANGE_REVIEW.md

MANUAL_CHANGE_REVIEW.md 用于：

当人类开发者已经直接修改项目代码后，让 AI 对这些人工修改执行标准化的 Review / Reconcile / Verify 流程。

它不是普通开发任务，也不是重新执行初始化。

目标是：

> 识别人类刚刚进行的代码修改，理解修改意图，检查其影响，并按照项目现有 AI Governance 规范完成必要的后续工程处理。

MANUAL_CHANGE_REVIEW.md 必须至少包含以下规则。

## 5.1 首先读取项目治理规则

首先读取：

```text
AGENTS.md
```

并根据 AGENTS.md 决定是否继续读取：

```text
docs/CONSTITUTION.md
docs/QUALITY-GATES.md
docs/ARCHITECTURE.md
docs/PROJECT-MANUAL.md
docs/adr/
docs/generated/
```

不要默认全部加载。

只读取当前人工修改真正需要的上下文。

## 5.2 通过 Git 确定人工修改范围

优先执行：

```bash
git status
git diff
git diff --staged
```

必要时结合：

```bash
git log
git diff <base>...HEAD
```

确认：

- 修改了哪些文件；
- 新增了哪些文件；
- 删除了哪些文件；
- 修改了哪些函数、类型、组件、接口、配置或业务规则。

不要通过文件修改时间猜测人工修改范围。

Git Diff 是本次 Review 的主要变更边界。

如果当前工作区同时包含无法可靠区分的人类修改和 AI 修改：

标记：

```text
[CHANGE ORIGIN UNCERTAIN]
```

并在最终报告中说明。

## 5.3 优先保留 Human Intent

人工修改是本次任务的重要输入。

AI 必须先理解：

> 人为什么进行了这些修改？

如果人工修改存在语法、类型、测试、架构或项目规范问题：

不要简单恢复到修改前状态。

应该优先：

1. 保留人工修改表达出的业务意图；
2. 找出真正的问题；
3. 使用最小修改方式修复；
4. 避免改变与本次修改无关的行为。

如果无法可靠判断人工意图：

标记：

```text
[INTENT UNCERTAIN]
```

并在最终报告中说明。

## 5.4 执行 Impact Analysis

针对人工修改检查真实影响范围。

根据项目实际情况检查：

- imports / exports；
- Type / Interface / Schema；
- Function / Method 调用方；
- Component；
- Hook / Store；
- Route；
- API Client；
- Controller；
- Service；
- Repository；
- Model；
- Database；
- Config；
- Shared Module；
- Shared Utility；
- Shared Types；
- Authentication；
- Authorization；
- Tests；
- Build；
- CI/CD；
- Documentation。

只根据真实依赖关系判断。

禁止根据经验猜测影响范围。

## 5.5 检查修改完整性

检查人工修改是否产生不完整变更。

例如代码已经修改，但是相关：

- 调用方；
- 类型；
- API Contract；
- Schema；
- Tests；
- Mock；
- Config；
- Route；
- Documentation；
- Generated Trace；

没有同步。

如果存在遗漏：

只补齐与本次人工修改直接相关的部分。

禁止借机进行无关重构。

## 5.6 检查项目规范

确认人工修改是否违反：

```text
AGENTS.md
docs/CONSTITUTION.md
docs/QUALITY-GATES.md
```

重点检查：

- 是否绕过现有架构；
- 是否重复实现已有能力；
- 是否破坏模块边界；
- 是否产生新的循环依赖；
- 是否影响 Shared API；
- 是否影响公共类型；
- 是否引入不必要依赖；
- 是否硬编码 Secret；
- 是否绕过 Authentication / Authorization；
- 是否产生潜在数据破坏行为；
- 是否进行了不必要的大范围修改。

不要因为个人风格偏好重写有效代码。

## 5.7 风险等级继续沿用 AGENTS.md

人工修改后的处理仍然使用 AGENTS.md 中定义的 L0 / L1 / L2 / L3 风险等级。

如果属于需要 Impact Analysis 的修改：

完成 Impact Analysis 后再处理。

如果属于必须人工批准的高风险操作：

不要继续修改。

输出：

```text
HUMAN APPROVAL REQUIRED
```

并说明：

- 当前修改；
- 风险；
- 影响范围；
- 建议方案。

## 5.8 补齐必要测试

如果人工修改改变业务行为，并且项目已有测试体系：

根据现有测试风格补充或修改必要测试。

禁止：

- 为了覆盖率制造无意义测试；
- 修改测试来掩盖代码错误；
- 删除失败测试绕过问题；
- 伪造测试结果。

## 5.9 刷新自动生成技术索引

如果人工修改影响：

```text
docs/generated/ROUTES.md
docs/generated/UI-TRACE.md
docs/generated/API-TRACE.md
docs/generated/DEPENDENCIES.md
```

不要直接手工修改这些文件。

执行项目真实存在的生成命令，例如：

```bash
npm run docs:generate
```

或其他实际命令。

## 5.10 更新人工维护文档

只有人工修改真正改变项目事实或工程约定时，才检查是否需要更新：

```text
docs/ARCHITECTURE.md
docs/PROJECT-MANUAL.md
docs/DOMAIN-GLOSSARY.md
CHANGELOG.md
README.md
```

普通实现细节不要写进长期文档。

如果涉及重要架构决策：

检查：

```text
docs/adr/
```

不要擅自改变已有 ADR 记录的架构决策。

## 5.11 执行 Quality Gates

根据：

```text
docs/QUALITY-GATES.md
```

执行项目真实支持的验证流程。

优先使用统一验证入口，例如：

```bash
npm run verify
```

或：

```bash
make verify
```

或项目实际存在的其他命令。

验证结果必须真实报告：

```text
Format: PASS / FAIL / NOT AVAILABLE
TypeCheck: PASS / FAIL / NOT AVAILABLE
Lint: PASS / FAIL / NOT AVAILABLE
Tests: PASS / FAIL / NOT AVAILABLE
Build: PASS / FAIL / NOT AVAILABLE
```

## 5.12 禁止事项

MANUAL_CHANGE_REVIEW 流程禁止：

- 重新执行 INITIALIZE_PROJECT.md；
- 无理由扫描并重构整个项目；
- 修改与人工变更无关的代码；
- 因个人风格偏好重写代码；
- 擅自改变架构；
- 擅自覆盖 Human Intent；
- 手工维护自动生成文件；
- 删除失败测试绕过问题；
- 伪造验证结果；
- 对无法确认的项目事实进行猜测。

始终遵守：

> Minimal Change  
> Source Code = Truth  
> Git = History  
> Human Intent Must Be Preserved

## 5.13 最终报告

MANUAL_CHANGE_REVIEW.md 必须要求 AI 最终输出：

```text
# Manual Change Review Report

## Human Changes Detected

## Intent

## Impact Analysis

## Problems Found

## Follow-up Changes

## Tests Updated

## Documentation Updated

## Generated Files Refreshed

## Quality Gate Results

## Remaining Risks

## Human Approval Required
```

如果某项没有内容：

填写：

```text
NOT APPLICABLE
```

不要为了让报告完整而制造不存在的工作。

---

# 6. 创建 CONSTITUTION.md

CONSTITUTION.md 只记录长期工程原则。参考：CONSTITUTION_参考.md

它应该非常稳定。

主要记录：

- Source Code 是事实来源；
- 最小修改原则；
- 不允许猜测代码；
- 不允许无关重构；
- 不允许未经允许更换架构；
- 高风险操作必须人工批准；
- 自动生成文档不能手工维护；
- 测试结果不能伪造；
- Secrets 不允许写进代码或文档；
- 数据破坏操作必须人工确认。

不要在 CONSTITUTION 中记录：

- 当前路由；
- 当前API；
- 当前目录；
- 某个Component；
- 当前业务模块；

这些属于动态信息。

---

# 7. 创建 QUALITY-GATES.md

根据真实技术栈建立验证规则。参考：QUALITY-GATES_参考.md

优先尝试建立统一入口，例如：

npm run verify

或：

make verify

或：

./scripts/verify.sh

具体命令必须基于项目当前技术栈。

验证可能包括：

Format
TypeCheck
Lint
Unit Test
Integration Test
Build

不得引用不存在的命令。

如果缺少某种验证：

记录：

NOT AVAILABLE

而不是伪造。

---

# 8. 创建 ARCHITECTURE.md

记录项目真实架构：

- 系统组成；
- 前端架构；
- 后端架构；
- 数据层；
- 状态管理；
- 外部服务；
- 核心数据流；
- 部署结构；
- 模块边界。

ARCHITECTURE 重点回答：

“这个系统是如何组织起来的？”

不要复制大量代码。

---

# 9. 创建 PROJECT-MANUAL.md

PROJECT-MANUAL 面向第一次进入项目的人类开发者。

记录：

- 项目是什么；
- 如何运行；
- 核心业务；
- 核心模块；
- 主要开发入口；
- 核心业务规则；
- 环境变量说明；
- 常见开发路径。

重点回答：

“我要维护这个项目，需要知道什么？”

禁止逐行解释代码。

---

# 10. 创建 ADR

创建：

docs/adr/

ADR 用于保存重要设计决策。

例如：

0001-use-postgresql.md
0002-auth-cookie-strategy.md
0003-state-management.md

ADR回答：

“为什么当时这么设计？”

格式：

# Decision

## Status

Accepted / Deprecated / Superseded

## Context

## Decision

## Alternatives

## Consequences

以后 AI 如果准备改变某项架构：

必须先查相关 ADR。

---

# 11. 建立自动生成技术索引

尽量不要让 AI 手工长期维护：

Route列表
API列表
UI映射
Dependency关系
引用数量

这些信息应该尽可能通过程序扫描生成。

输出：

docs/generated/

所有生成文件顶部写：

AUTO-GENERATED FILE.
DO NOT EDIT MANUALLY.
SOURCE CODE IS THE SOURCE OF TRUTH.

---

# 12. ROUTES.md

根据真实路由生成：

Route
Page
Component
Layout
Authorization

不存在的字段不要猜。

---

# 13. UI-TRACE.md

尽可能生成：

Page / Component
Physical File
Route
Store / Hook
API Client
Major Dependencies

无法确认：

[UNRESOLVED]

---

# 14. API-TRACE.md

尽可能生成：

Method
Endpoint
Controller
Service
Repository
Model
Authorization
Frontend Caller

以项目真实架构为准。

---

# 15. DEPENDENCIES.md

识别：

- 高频引用文件；
- Shared Modules；
- Shared Types；
- Utilities；
- Global Store；
- API Client；
- 公共组件；
- 高耦合模块；
- 循环依赖。

至少输出：

Top 20 高频依赖文件。

引用次数只是风险判断因素之一。

不能简单认为：

引用多 = 禁止修改。

---

# 16. 自动生成脚本

根据当前技术栈建立：

docs:generate

或类似命令。

理想流程：

Source Code
↓
Scanner
↓
docs/generated/

而不是：

Source Code
↓
AI 手工更新 Markdown

---

# 17. 风险等级

初始化 AGENTS.md 时建立以下标准。

## L0

低风险：

- 文案；
- 样式；
- 注释；
- 单页面局部UI。

AI可以直接修改并验证。

## L1

普通风险：

- 单模块业务逻辑；
- 普通Service；
- 普通组件；
- 普通Bug。

AI完成影响确认后修改。

## L2

高风险：

- Shared Component；
- Shared Utility；
- Public API；
- Global Store；
- Shared Types；
- 核心Config。

修改前必须执行 Impact Analysis。

## L3

极高风险：

- Database Schema；
- Migration；
- Data Delete；
- Authentication；
- Authorization；
- Payment；
- Secret；
- Encryption；
- Production Config；
- CI/CD核心配置；
- Breaking API；
- 大范围架构调整。

不得直接修改。

必须：

分析
↓
给出方案
↓
等待人工确认
↓
再执行

---

# 18. 建立 CI

如果项目使用 GitHub：

建立或完善：

.github/workflows/ci.yml

运行项目实际支持的：

TypeCheck
Lint
Test
Build

CI 应与 QUALITY-GATES 保持一致。

---

# 19. 扫描测试情况

识别：

Unit Test
Integration Test
E2E Test

重点检查：

- Authentication；
- Authorization；
- Payment；
- State Machine；
- 数据转换；
- 核心业务规则；
- 历史高风险逻辑。

不要为了覆盖率批量制造没有业务价值的测试。

---

# 20. 检查高风险区域

主动识别：

Authentication
Authorization
Database
Payment
Global State
Shared Modules
Public API
External Services
Infrastructure
Deployment
Secrets
Destructive Operations

记录风险。

不要在初始化阶段顺手大范围重构。

---

# 21. 建立 README 导航

README 不承担所有项目知识。

README 只提供：

项目介绍
安装
启动
测试
Build
核心目录
文档入口

并链接到：

AGENTS.md
docs/PROJECT-MANUAL.md
docs/ARCHITECTURE.md

---

# 22. CHANGELOG 规则

CHANGELOG 只用于：

Features
Important Bug Fixes
Breaking Changes
API Behavior Changes
Security Fixes

不要记录：

变量改名
格式调整
普通Refactor
注释修改
文档小修改

代码历史由：

Git + Pull Request

保存。

---

# 23. 初始化完成后验证

运行项目当前能够执行的验证。

报告实际结果：

TypeCheck: PASS / FAIL / NOT AVAILABLE
Lint: PASS / FAIL / NOT AVAILABLE
Tests: PASS / FAIL / NOT AVAILABLE
Build: PASS / FAIL / NOT AVAILABLE

禁止用：

“应该没问题”

代替实际执行结果。

---

# 24. 最终输出

初始化结束以后，输出：

# Project Initialization Report

## Technology Stack

## Project Structure

## Core Modules

## Core Execution Flow

## Routes

## APIs

## Database

## Testing

## Top Shared Dependencies

## High Risk Areas

## Documentation Created

## Automation Created

## Quality Gate Results

## Problems Discovered

## Recommended Next Steps

如果发现已有项目存在问题：

先报告。

不要借初始化任务擅自进行大规模修改。

---

初始化完成后：

以后不要重新执行本 Bootstrap。

后续所有 AI 任务统一从：

AGENTS.md

开始。

如果是人类开发者已经直接修改代码后的检查与收尾：

读取并执行：

MANUAL_CHANGE_REVIEW.md

不要重新执行本 Bootstrap。

现在开始扫描项目并执行初始化。
