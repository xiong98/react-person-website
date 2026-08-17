# Project Engineering Constitution

本文件定义项目长期稳定的工程原则。

这些规则不应因为普通功能开发频繁修改。

---

## 1. Source Code Is Truth

项目真实代码是系统当前行为的最终事实来源。

AI 不得通过经验、记忆、惯例或猜测代替代码检查。

---

## 2. Minimal Change

任何任务默认采用最小修改原则。

一次任务只解决一个明确目标。

禁止将 Bug Fix、Refactor、Dependency Upgrade、Architecture Change 混合在同一个修改中，除非任务明确要求。

---

## 3. Understand Before Change

修改前必须理解：实现位置、调用关系、依赖关系、影响范围。

未知代码不得随意删除。

---

## 4. Preserve Architecture

当前架构默认被视为有意设计。

AI 不得因为"更优雅""更现代""最佳实践"擅自改变架构。

重大架构修改必须形成 ADR。

---

## 5. Human Controls High-risk Changes

以下操作必须人工确认：

数据删除、Schema 变更、Migration、Auth、Authorization、Payment、Secrets、Encryption、Production Infrastructure、Breaking API、重大 Architecture Change。

---

## 6. Verification Over Confidence

AI 判断不能代替 Compiler、Type Checker、Lint、Tests、Build、CI 的实际机器执行结果。

---

## 7. Never Fake Verification

没有执行测试：必须写 NOT RUN。

测试失败：必须写 FAIL。

禁止伪造 PASS。

---

## 8. Documentation Records Intent

文档重点记录业务意义、架构、设计原因、约束、不变量、开发入口。

不要复制代码本身。

---

## 9. Generated Facts Are Generated

Route、API、Dependency、UI Mapping 等可以从代码确定的信息，应尽量自动生成。

不得长期建立人工维护的第二份代码事实库。

本项目使用：

npm run docs:generate

生成 docs/generated/。

---

## 10. ADR Records Why

重要技术选择必须能够回答：为什么这么设计？

如果未来需要改变：新增 ADR 或 Supersede 旧 ADR。

---

## 11. Git Records History

代码修改历史由 Git 保存。

PR 记录 Why、What、Impact、Verification。

CHANGELOG 只记录用户可感知的重要变化。

---

## 12. Secrets Stay Secret

任何 Password、API Key、Token、Private Key、Credential 都不得进入代码、Markdown、Log、Example Output。

使用环境变量或 Secret Management。

---

## 13. Destructive Actions Are High Risk

删除数据、Migration 历史、Production 资源、用户文件、数据库表，默认属于最高风险，必须人工确认。

---

## 14. Maintainability Over Cleverness

优先清晰、一致、简单、容易测试、容易定位、容易回滚，而不是复杂抽象、过度设计、炫技代码。

---

## 15. Human + AI Maintainability

所有设计同时考虑：AI 是否容易正确理解、人类是否容易阅读、新人是否容易定位、修改是否容易验证、出现问题是否容易回滚。
