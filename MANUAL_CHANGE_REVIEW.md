# Manual Change Review Protocol

你正在处理一个已经由人类开发者手动修改过的项目。

本次任务不是重新开发功能，也不是重新执行初始化，更不是对整个项目进行重构。

你的目标是：

> 识别人类刚刚进行的代码修改，理解修改意图，检查其影响，并按照项目现有 AI Governance 规范完成必要的后续工程处理。

---

# 1. 首先读取项目治理规则

首先完整阅读：

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

不要默认全部加载，只读取当前人工修改真正需要的上下文。

---

# 2. 通过 Git 确定人工修改范围

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

不要通过文件修改时间猜测人工修改范围。Git Diff 是本次 Review 的主要变更边界。

如果当前工作区同时包含无法可靠区分的人类修改和 AI 修改，标记：

```text
[CHANGE ORIGIN UNCERTAIN]
```

并在最终报告中说明。

---

# 3. 优先保留 Human Intent

人工修改是本次任务的重要输入。AI 必须先理解：

> 人为什么进行了这些修改？

如果人工修改存在语法、类型、测试、架构或项目规范问题：

- 不要简单恢复到修改前状态；
- 保留人工修改表达出的业务意图；
- 找出真正的问题；
- 使用最小修改方式修复；
- 避免改变与本次修改无关的行为。

如果无法可靠判断人工意图，标记：

```text
[INTENT UNCERTAIN]
```

并在最终报告中说明。

---

# 4. 执行 Impact Analysis

针对人工修改检查真实影响范围，根据项目实际情况检查：

- imports / exports；
- Type / Interface / Schema；
- Function / Method 调用方；
- Component；
- Hook / Store（src/hooks、src/store）；
- Route（src/router.tsx）；
- API Client（src/lib/api.ts）；
- Config（vite.config.ts、tsconfig*、package.json）；
- Shared Module / Shared Utility / Shared Types；
- Authentication / Authorization；
- Tests；
- Build / CI / Documentation。

只根据真实依赖关系判断，禁止根据经验猜测影响范围。

---

# 5. 检查修改完整性

检查人工修改是否产生不完整变更，例如代码已修改但相关：

- 调用方；
- 类型；
- API Contract；
- Tests / Mock；
- Config；
- Route；
- Documentation；
- Generated Trace（docs/generated/）。

没有同步。如果存在遗漏，只补齐与本次人工修改直接相关的部分，禁止借机进行无关重构。

---

# 6. 检查项目规范

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

---

# 7. 风险等级沿用 AGENTS.md

人工修改后的处理仍然使用 AGENTS.md 中定义的 L0 / L1 / L2 / L3 风险等级。

如果属于需要 Impact Analysis 的修改（L2），完成 Impact Analysis 后再处理。

如果属于必须人工批准的高风险操作（L3），不要继续修改，输出：

```text
HUMAN APPROVAL REQUIRED
```

并说明：当前修改内容、风险、影响范围、建议处理方案。

---

# 8. 补齐必要测试

如果人工修改改变业务行为，并且项目已有测试体系（Vitest + Testing Library）：

根据现有测试风格补充或修改必要测试。

禁止：

- 为了覆盖率制造无意义测试；
- 修改测试来掩盖代码错误；
- 删除失败测试绕过问题；
- 伪造测试结果。

---

# 9. 刷新自动生成技术索引

如果人工修改影响：

```text
docs/generated/ROUTES.md
docs/generated/UI-TRACE.md
docs/generated/API-TRACE.md
docs/generated/DEPENDENCIES.md
```

不要手工修改这些文件，执行：

```bash
npm run docs:generate
```

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

普通实现细节不要写进长期文档。

如果涉及重要架构决策，检查 docs/adr/，不要擅自改变已有 ADR 记录的架构决策。

---

# 11. 执行 Quality Gates

根据 docs/QUALITY-GATES.md 执行项目真实支持的验证流程，优先使用统一入口：

```bash
npm run verify
```

验证结果必须真实报告：

```text
Format: PASS / FAIL / NOT AVAILABLE
TypeCheck: PASS / FAIL / NOT AVAILABLE
Lint: PASS / FAIL / NOT AVAILABLE
Tests: PASS / FAIL / NOT AVAILABLE
Build: PASS / FAIL / NOT AVAILABLE
```

---

# 12. 禁止事项

本次流程禁止：

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

---

# 13. 最终报告

完成后输出：

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

如果某项没有内容，填写 NOT APPLICABLE，不要为了让报告完整而制造不存在的工作。
