# Manual Change Review Protocol

你正在处理一个已经由人类开发者手动修改过的项目。

本次任务不是重新开发功能，也不是对整个项目进行重构。

你的目标是：

> **识别人类刚刚进行的代码修改，理解修改意图，检查其影响，并按照项目现有 AI Governance 规范完成必要的后续工程处理。**

---

# 1. 首先读取项目治理规则

首先完整阅读：

```text
AGENTS.md
```

并按照 `AGENTS.md` 的规则决定是否需要继续读取：

```text
docs/CONSTITUTION.md
docs/QUALITY-GATES.md
docs/ARCHITECTURE.md
docs/PROJECT-MANUAL.md
docs/adr/
docs/generated/
```

不要默认全部加载。

只读取当前变更真正需要的上下文。

---

# 2. 确定人工修改范围

优先通过 Git 确定当前人工修改：

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

* 修改了哪些文件；
* 新增了哪些文件；
* 删除了哪些文件；
* 修改了哪些函数、类型、组件、接口、配置或业务规则。

不要依赖“最近修改时间”判断。

不要扫描整个项目后猜测哪些内容是人工修改。

Git Diff 是本次任务的主要变更边界。

---

# 3. 不要擅自覆盖人工意图

人工修改视为本次任务的输入。

首先理解：

> **人为什么进行了这些修改？**

如果修改在语法、类型、测试、架构或项目规范上存在问题：

不要简单恢复到修改前状态。

应该优先：

1. 保留人工修改表达出的业务意图；
2. 找出真正的问题；
3. 使用最小修改方式修复；
4. 避免改变与本次人工修改无关的行为。

如果无法可靠判断人工意图：

标记：

```text
[INTENT UNCERTAIN]
```

并在最终报告中说明。

对于高风险修改，按照 `AGENTS.md` 的风险等级处理。

---

# 4. 分析变更影响

针对每项人工修改执行 Impact Analysis。

检查是否影响：

* imports / exports；
* Type / Interface / Schema；
* Function / Method 调用方；
* Component；
* Hook / Store；
* Route；
* API Client；
* Controller；
* Service；
* Repository；
* Model；
* Database；
* Config；
* Shared Module；
* Shared Utility；
* Shared Types；
* Authentication；
* Authorization；
* Tests；
* Build；
* CI/CD；
* Documentation。

只分析真实存在的依赖关系。

禁止根据经验猜测影响范围。

---

# 5. 检查修改完整性

检查人工修改是否产生“不完整修改”。

例如：

代码修改了，但是：

* 调用方没有同步；
* 类型没有同步；
* API Contract 没有同步；
* Schema 没有同步；
* Test 没有同步；
* Mock 没有同步；
* Config 没有同步；
* Route 没有同步；
* Documentation 没有同步；
* Generated Trace 没有重新生成。

如果存在遗漏：

只补齐与本次人工修改直接相关的部分。

禁止借机进行无关重构。

---

# 6. 检查项目规范

确认人工修改是否违反：

```text
AGENTS.md
docs/CONSTITUTION.md
docs/QUALITY-GATES.md
```

重点检查：

* 是否绕过现有架构；
* 是否重复实现已有能力；
* 是否破坏模块边界；
* 是否产生新的循环依赖；
* 是否修改 Shared API；
* 是否修改公共类型；
* 是否引入不必要依赖；
* 是否硬编码 Secret；
* 是否绕过 Authentication / Authorization；
* 是否产生潜在数据破坏行为；
* 是否进行了不必要的大范围修改。

不要因为风格偏好修改有效代码。

---

# 7. 风险判断

按照 `AGENTS.md` 中定义的风险等级判断人工修改。

如果属于普通低风险修改：

可以继续完成必要后续处理。

如果属于需要 Impact Analysis 的修改：

完成 Impact Analysis 后再处理。

如果属于需要人工批准的高风险操作：

不要继续修改。

输出：

```text
HUMAN APPROVAL REQUIRED
```

并说明：

* 当前修改内容；
* 风险；
* 影响范围；
* 建议处理方案。

---

# 8. 补齐必要测试

检查当前人工修改是否已有对应测试。

如果修改涉及业务行为，并且项目已有测试体系：

根据现有测试风格补充或修改必要测试。

测试必须验证真实行为。

禁止：

* 为了覆盖率制造无意义测试；
* 修改测试来掩盖代码错误；
* 删除失败测试绕过问题；
* 伪造测试结果。

---

# 9. 更新动态技术索引

如果项目存在自动生成技术文档，例如：

```text
docs/generated/ROUTES.md
docs/generated/UI-TRACE.md
docs/generated/API-TRACE.md
docs/generated/DEPENDENCIES.md
```

不要直接手工编辑这些文件。

如果人工修改影响这些索引：

执行项目已经定义的生成命令，例如：

```bash
npm run docs:generate
```

或项目实际存在的对应命令。

只允许使用项目真实存在的命令。

---

# 10. 更新人工维护文档

只有人工修改真正改变项目事实或工程约定时，才检查是否需要更新：

```text
docs/ARCHITECTURE.md
docs/PROJECT-MANUAL.md
docs/DOMAIN-GLOSSARY.md
CHANGELOG.md
README.md
```

不要因为普通实现细节修改这些文档。

如果修改涉及重要架构决策：

检查：

```text
docs/adr/
```

不要擅自改变已有 ADR 所记录的重要架构决策。

---

# 11. 执行 Quality Gates

根据：

```text
docs/QUALITY-GATES.md
```

执行项目真实支持的验证流程。

例如：

```text
Format
TypeCheck
Lint
Unit Test
Integration Test
Build
```

优先使用项目已经提供的统一验证入口，例如：

```bash
npm run verify
```

或：

```bash
make verify
```

实际命令以项目为准。

禁止使用不存在的命令。

---

# 12. 不要做的事情

本次任务禁止：

* 重新执行 `INITIALIZE_PROJECT.md`；
* 无理由扫描并重构整个项目；
* 修改与人工变更无关的代码；
* 因个人代码风格偏好重写代码；
* 擅自改变架构；
* 擅自覆盖人工业务意图；
* 手工维护自动生成文件；
* 删除失败测试绕过问题；
* 伪造验证结果；
* 对无法确认的项目事实进行猜测。

始终遵守：

> Minimal Change

> Source Code = Truth

> Git = History

> Human Intent Must Be Preserved

---

# 13. 最终报告

完成后输出：

```text
# Manual Change Review Report

## Human Changes Detected
本次识别到的人工修改。

## Intent
对这些修改意图的理解。

## Impact Analysis
受影响的模块、调用方和依赖。

## Problems Found
发现的问题。

## Follow-up Changes
为了保证修改完整性而补充的修改。

## Tests Updated
新增或修改的测试。

## Documentation Updated
更新的文档。

## Generated Files Refreshed
重新生成的技术索引。

## Quality Gate Results
Format:
TypeCheck:
Lint:
Tests:
Build:

## Remaining Risks
仍然存在的风险或不确定项。

## Human Approval Required
如果存在需要人工确认的操作，在这里列出。
```

如果没有某项：

填写：

```text
NOT APPLICABLE
```

不要为了让报告完整而制造不存在的工作。
