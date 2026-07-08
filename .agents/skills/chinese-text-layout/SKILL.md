---
name: chinese-text-layout
description: 提炼 W3C 中文排版需求（clreq）的最佳实践，包括文本方向、字体样式、标点定位、中西文混排、避头尾、行间注（Ruby）和着重号等，用于指导和审查网页与排版设计。
---

# 中文排版需求与规范技能 (Chinese Text Layout)

本技能提炼了 W3C 的《中文排版需求》(Requirements for Chinese Text Layout - clreq) 的核心要素，为中文网页设计、Markdown/MDX 博客文章渲染及 CSS 布局提供标准化的实操规范与审查清单。

---

## 1. 写作方向与行文模式 (Writing Mode & Direction)

中文文本支持横排（自左向右，自上而下）和直排（自上而下，行自右向左）。

### 1.1 横排与直排的 CSS 配置
- **横排**：默认使用 `writing-mode: horizontal-tb;`。
- **直排**：使用 `writing-mode: vertical-rl;`。
- **直排逻辑属性转换**：直排时，应使用逻辑属性（如 `margin-inline-start`, `padding-block-end`）代替物理属性（如 `margin-top`, `padding-bottom`），以保证布局在切换文本方向时自适应。

### 1.2 混排时的“纵中横” (Tate-chu-yoko)
在直排文本中，若包含 1-3 位的短阿拉伯数字或短英文缩写（如：`3.0`、`A+`、`GDP`），应保持其正常直立方向以横排显示。
```css
/* 纵中横样式类 */
.tate-chu-yoko {
  text-combine-upright: all;
  -webkit-text-combine: horizontal;
}
```

---

## 2. 中文网页字体声明方案 (Typefaces)

应针对不同操作系统合理声明中文字体。中文排版中最常用的四种字体类别是：黑体（现代无衬线）、宋体（印刷衬线）、楷体（书法手写）和仿宋（公文过渡）。

### 2.1 推荐 CSS font-family 声明

```css
/* 现代黑体（默认首选，适合无干扰阅读） */
.font-sans-zh {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", 
               "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
}

/* 经典宋体（适合长文、高呼吸感、传统或文学内容） */
.font-serif-zh {
  font-family: "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "SimSun", serif;
}

/* 楷体（常用于引文 blockquote、强调或旁注） */
.font-kaiti-zh {
  font-family: "Kaiti SC", "Noto Sans CJK SC", "KaiTi", "STKaiti", cursive;
}

/* 仿宋（常用于学术引用或细体注释） */
.font-fangsong-zh {
  font-family: "FangSong", "STFangsong", serif;
}
```

---

## 3. 标点符号与避头尾禁则 (Punctuation & Line Breaking)

标点符号不得以破坏语意流利度的方式出现在行首或行尾。

### 3.1 避头尾规则
- **避头符号**（绝对不能出现在一行的开头）：
  - 所有点号：逗号（`，`）、顿号（`、`）、分号（`；`）、冒号（`：`）、句号（`。`）、问号（`？`）、叹号（`！`）。
  - 所有结束引号/括号：`）`、`]`、`}`、`」`、`』`、`”`、`’`、`》`、`〉`。
  - 连接号的后半部分、分隔点（`·`）、省略号（`……`）。
- **避尾符号**（绝对不能出现在一行的末尾）：
  - 所有开始引号/括号：`（`、`[`、`{`、`「`、`『`、`“`、`‘`、`《`、`〈`。
  - 连接号的前半部分。

### 3.2 CSS 避头尾与两端对齐落地
为保证中文长段落左右两侧整齐且正确排版避头尾：
```css
article p {
  /* 强制执行最严格的东亚避头尾规则 */
  line-break: strict;
  /* 允许在单词内断行，确保中西文混排时英文单词过长不会导致整行空白 */
  word-break: break-all;
  /* 开启两端对齐 */
  text-align: justify;
  /* 针对中文字符间距进行微调对齐 */
  text-justify: inter-ideographic;
}
```

---

## 4. 中西文混排间距 (Mixed Text Spacing)

汉字与西文字母、阿拉伯数字之间，在视觉上应留有约 **1/4 个汉字宽度** 的空白（Spacing），以提高辨识度和可读性。

### 4.1 实现规范
- **原生 CSS 新特性**：使用 `text-autospace`（部分现代浏览器如 Chrome 120+ 已逐步支持）。
  ```css
  html {
    text-autospace: normal;
  }
  ```
- **降级/开发习惯**：若浏览器不支持，在书写中英文内容时，应手动插入**一个半角空格**（如 `中文 English 混排`），切忌插入全角空格或完全不留间距。
- **注意**：标点符号与西文字符之间不需要额外加空格（例如 `“Hello” 说` 中，“ 已经提供了足够的视觉停顿，无需加空格）。
- **中西文括号混排规范**：
  - **非必要不要标注英文**：当中文句子中已包含明确通用的中文译名（如“高敏感”、“自闭特质”、“多动特质”、“核磁共振”）时，**绝对禁止**在其中文后以括号备注英文缩写（如禁用：`高敏感 (HSP)`、`自闭特质 (ASD)`、`多动特质 (ADHD)`）。直接使用干净的中文书写即可，以降低读者的认知负荷并消除页面视觉杂音。
  - **不得不使用的括号排版**：如果确实因为学术规范或极少数无中文对应的缩写必须附带英文（如 `认知行为疗法 (CBT) 的`），**必须使用半角括号并配以半角空格修饰**。在半角左括号前和半角右括号后（若紧跟中文字符）均需手动插入一个半角空格，而半角括号内侧与英文缩写之间保持无空格。
  - **禁用全角括号内夹英文缩写**：禁用如 `高敏感（HSP）` 的形式，这会导致全角符号特有的占宽与西文字体冲突，在最终网页上渲染出极其不协调的巨大字距空档。

---

## 5. 着重号、书名号与专名号 (Emphasis & Highlighting)

在中文排版中，对文字的强调应当避免使用西文惯用的斜体（`italic`），因为中文斜体容易导致字符变形甚至难以辨认。

### 5.1 着重号 (Emphasis Dots)
中文强调应首选**着重号**（在汉字下方或右侧标记实心圆点）。
```css
/* 使用 CSS 原生着重号属性 */
.zh-emphasis {
  text-emphasis: dot;
  /* 横排时位于下方，直排时自动调整为右侧 */
  text-emphasis-position: under right;
  /* 避免与着重号颜色与主题冲突，可根据需要设置 */
  text-emphasis-color: currentColor;
}
```

### 5.2 书名号与专名号
- **书名号**：横排与直排均统一使用 `《》`。双书名号内嵌套时，内层使用单书名号 `〈〉`。
- **专名号**（标示人名、地名）：
  ```css
  .proper-noun {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  ```

---

## 6. 行间注/旁注 (Ruby Annotation)

主要用于生僻字标音、拼音辅导或中外文对照翻译。

### 6.1 HTML5 `<ruby>` 标准结构
```html
<!-- 单字拼音旁注 -->
<ruby>汉<rt>hàn</rt>字<rt>zì</rt></ruby>

<!-- 词组对照旁注 -->
<ruby>人工智能<rt>Artificial Intelligence</rt></ruby>
```

### 6.2 CSS 控制
- **横排**：注文默认位于基文字符上方。可通过 `ruby-position: over;`（上方，默认）或 `ruby-position: under;`（下方）控制。
- **直排**：注文将自动靠右对齐。

---

## 7. 省略号 (Ellipsis)

- 中文省略号规范必须为 **6 个点，占 2 个汉字宽度**。
- 应使用两个连续的省略号字符 `……`（或在 HTML 中使用 `&hellip;&hellip;` / `\u2026\u2026`）。
- **防止换行拆分**：省略号本身作为一个整体，切忌被自动换行截断分行显示。
  ```html
  <!-- 防止省略号被拆分到两行 -->
  <span style="white-space: nowrap;">……</span>
  ```

---

## 8. 中文排版审查自检清单 (Checklist)

在编写、审查中文网页设计或博客渲染模板时，必须依次确认以下问题：

* [ ] **写作方向与逻辑属性**：是否正确使用了物理/逻辑属性？若使用直排模式，短数字或缩写是否应用了 `.tate-chu-yoko`（纵中横）？
* [ ] **字体退化链**：`font-family` 是否按规范设置？是否首先匹配了 PingFang/Hiragino（macOS）和 YaHei（Windows）？
* [ ] **避头尾及对齐**：段落是否开启了 `line-break: strict` and `text-align: justify`？首尾行是否出现了非法的标点符号？
* [ ] **中西文间距**：汉字与英文、阿拉伯数字相遇时，是否手动留出半角空格，或使用了 `text-autospace`？
* [ ] **强调形式**：页面中是否错误地对中文使用了斜体（`em`, `i` 标签）？对于需要突出的文本，是否应用了 `text-emphasis` 着重号？
* [ ] **省略号长度**：省略号是否为完整的 6 个点 `……` 且未被换行截断？
* [ ] **书名号层级**：嵌套的书名号是否正确遵循了“外双内单”（`《……〈……〉……》`）的层级关系？
