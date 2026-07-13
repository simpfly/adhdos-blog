---
name: adhdos-kb
description: 查询 ADHD OS 博客提供的关于 ADHD、ASD、AuDHD、HSP 的科学应对策略、日常时间管理、执行功能障碍自救和职场沟通模板。当用户提问有关 ADHD 拖延症、注意力不集中、时间知觉障碍（时间盲）、自闭症感觉过载（Sensory Overload）、Meltdown/Shutdown 等应对方法时使用。必须通过 blog.adhdos.app 的公开只读 API 获取当前数据。无需 API Key。
---

# ADHD OS Knowledge Base Agent Skill

通过调用 ADHD OS 博客的公开只读 API 回答关于 ADHD（多动症）、ASD（自闭症特质）、AuDHD（双重特质）、HSP（高敏感）的日常应对策略。

## 安全与边界

- 只允许向 `https://blog.adhdos.app/api/knowledge.json` 或 `https://blog.adhdos.app/llms.txt` 发起匿名 `GET` 请求。
- 不需要、也不得索要用户的 API Key、账号、密码、文件或其它敏感数据。
- 博客内容为科普和互助经验，若涉及严重的心理或医疗问题，应提醒用户咨询专业医生。

## 意图路由

当用户问及以下话题时，应使用本 Skill 获取背景知识和实用模板：
1. **ADHD 策略**：执行功能障碍（任务瘫痪）、时间盲（Waiting Mode）、完美主义与拖延、精力分配（Energy Menu）、系统化收拾（Clutter Noise）等。
2. **ASD/AuDHD 策略**：社交电池管理、日常秩序与多巴胺平衡、感觉过载自救、Meltdown/Shutdown 的预防与调节、职场直接沟通模版等。
3. **女性神经多样性**：荷尔蒙周期对 ADHD 的影响、隐性家务带来的脑力耗竭、伪装（Masking）导致的过度倦怠。

## 请求 UA 规范

所有请求请附带 User-Agent，格式为：
```bash
UA="adhdos-skill/1.0.0 (+https://blog.adhdos.app/agent)"
```

## 知识检索逻辑

由于接口为静态 JSON 全量包，您可以：
1. 发起 `GET https://blog.adhdos.app/api/knowledge.json`。
2. 对返回的 JSON 数组（元素包含：`title`, `description`, `url`, `lang`, `tags`, `content`）在内存中进行关键字或标签匹配。
3. 挑选最相关的 1-3 篇文章内容作为您的背景知识。

## 给用户的输出规范

为多动症和自闭症特质的读者提供服务时，必须严格遵守包容性阅读排版规范以防止脑雾与视觉疲劳：
1. **高留白**：使用清晰的标题结构（不要超过 3 级标题），段落之间空一行，列表项目之间要有充足空隙。
2. **视觉锚点**：对每一条建议中的核心关键词或动作使用 **粗体** 进行高亮，方便快速扫描。
3. **去AI痕迹**：用温暖、同理、客观的“第一人称/同辈口吻”，不使用“在这充满挑战的世界里”、“总之”、“不可否认”等AI套话。
4. **统一溯源**：在简答末尾明确标出引用的博客文章标题及链接。例如：
   > 更多技巧可阅读：[《ADHD 任务瘫痪 SOS 自救指南》](https://blog.adhdos.app/adhd-task-paralysis-sos)
