#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ADHDOS 博客本地 GEO 审计工具
扫描本地 Markdown/MDX 文件的 GEO 指标并生成报告。
"""

import os
import re
import sys

def count_words(text, lang):
    # 移除 frontmatter
    text = re.sub(r'^---.*?---', '', text, flags=re.DOTALL)
    # 移除 JSX imports 和 components
    text = re.sub(r'import\s+.*?;', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    # 移除 Markdown 符号
    text = re.sub(r'[#*`_\-~[\]()]/g', '', text)
    
    if lang == 'zh':
        cn_chars = len(re.findall(r'[\u4e00-\u9fa5]', text))
        en_words = len(re.findall(r'\b[a-zA-Z0-9_\-]+\b', text))
        return cn_chars + en_words
    else:
        words = len(re.findall(r'\b[a-zA-Z0-9_\-]+\b', text))
        return words

def audit_file(filepath):
    filename = os.path.basename(filepath)
    # 判断语言
    lang = 'en' if '/en/' in filepath else 'zh'
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    # 1. 字数
    words = count_words(content, lang)
    
    # 2. 检查 FAQ
    has_faq = 'FAQSchema' in content
    faq_count = 0
    if has_faq:
        # 简单正则匹配 questions 数组项数
        faq_count = len(re.findall(r'question\s*:', content))
        if faq_count == 0:
            # 兼容另一种可能写法
            faq_count = len(re.findall(r'{\s*question\s*:', content))
            
    # 3. 检查 Citation（学术引用）
    has_citation_section = bool(re.search(r'##\s*(引用来源|References)', content, re.I))
    # 匹配文中的学术链接，或括号引用 (Author, 20xx)
    citations_in_text = len(re.findall(r'https?://(?:pubmed|ncbi|doi|www\.psychiatry|www\.nature|www\.science|www\.thelancet)\b', content, re.I))
    academic_ref_pattern = len(re.findall(r'\([A-Z][a-zA-Z\s]+,\s*(?:19|20)\d{2}\)', content))
    citation_score_base = max(citations_in_text, academic_ref_pattern)
    
    # 4. 检查 Statistics（统计数据）
    stats_percentage = len(re.findall(r'\d+(?:\.\d+)?%', content))
    stats_keywords = len(re.findall(r'(?:百分之|数据显示|调查|统计|研究发现|根据\w*研究|data shows|study reveals|percent|statistics)', content, re.I))
    stats_count = stats_percentage + stats_keywords
    
    # 5. GEO 评分系统 (总分 100)
    # 基础分 40
    score = 40
    
    # FAQ 结构 (Max 15)
    if has_faq and faq_count > 0:
        score += min(15, faq_count * 7.5)
        
    # 引用来源 (Max 25)
    if has_citation_section:
        score += 15
        score += min(10, citation_score_base * 3)
    else:
        score += min(15, citation_score_base * 4)
        
    # 统计数据 (Max 20)
    score += min(20, stats_count * 4)
    
    # 格式规范分：标题层级等 (Max 5)
    has_h2 = '## ' in content
    has_h3 = '### ' in content
    if has_h2 and has_h3:
        score += 5
    elif has_h2:
        score += 3
        
    # 确保分数在合理范围
    score = min(100.0, score)
    
    return {
        'filename': filename,
        'path': filepath,
        'lang': lang,
        'words': words,
        'has_faq': has_faq,
        'faq_count': faq_count,
        'has_citation': has_citation_section or (citation_score_base > 0),
        'citation_count': max(1 if has_citation_section else 0, citation_score_base),
        'stats_count': stats_count,
        'score': score
    }

def main():
    blog_dir = './src/content/blog'
    if not os.path.exists(blog_dir):
        print(f"Error: Directory {blog_dir} not found. Run from workspace root.")
        sys.exit(1)
        
    files = []
    for root, dirs, filenames in os.walk(blog_dir):
        for f in filenames:
            if f.endswith(('.mdx', '.md')):
                files.append(os.path.join(root, f))
                
    results = []
    for filepath in files:
        results.append(audit_file(filepath))
        
    # 排序：按分数从低到高，方便找出最需要优化的文章
    results.sort(key=lambda x: x['score'])
    
    zh_results = [r for r in results if r['lang'] == 'zh']
    en_results = [r for r in results if r['lang'] == 'en']
    
    avg_score = sum(r['score'] for r in results) / len(results) if results else 0
    avg_zh = sum(r['score'] for r in zh_results) / len(zh_results) if zh_results else 0
    avg_en = sum(r['score'] for r in en_results) / len(en_results) if en_results else 0
    
    # 输出报告到 artifacts
    report_path = '/Users/curiosita/.gemini/antigravity/brain/f4d2f946-4917-440c-976e-0e399a036c61/geo_audit_report.md'
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# ADHDOS 博客 GEO 本地审计报告\n\n")
        f.write(f"审计时间: 2026-07-09\n\n")
        f.write("## 1. 站点 GEO 概要指标\n\n")
        f.write(f"- **全站文章总数**: {len(results)} 篇 (中文: {len(zh_results)} 篇, 英文: {len(en_results)} 篇)\n")
        f.write(f"- **全站 GEO 平均分**: {avg_score:.2f} / 100 分\n")
        f.write(f"- **中文文章平均分**: {avg_zh:.2f} / 100 分\n")
        f.write(f"- **英文文章平均分**: {avg_en:.2f} / 100 分\n\n")
        
        f.write("## 2. GEO 重点提升建议\n\n")
        f.write("> [!TIP]\n")
        f.write("> **普林斯顿 GEO 研究表明**：Citations (引用来源) 可提升 AI 引用率 +40%，Statistics (统计数据) 提升 +37%。\n")
        f.write("> 两者结合是目前生成式搜索引擎优化（GEO）的最高收益策略。同时，确保每篇博客都有清晰的 FAQ 问答。\n\n")
        
        f.write("## 3. 分数最低的 5 篇文章 (最需优化)\n\n")
        f.write("| 文章名称 | 语言 | 字数 | FAQ 数量 | 引用数 | 统计数据数 | 当前 GEO 得分 |\n")
        f.write("|----------|------|------|----------|--------|------------|----------------|\n")
        for r in results[:5]:
            f.write(f"| `{r['filename']}` | {r['lang'].upper()} | {r['words']} | {r['faq_count']} | {r['citation_count']} | {r['stats_count']} | **{r['score']:.1f}** |\n")
            
        f.write("\n## 4. 全站文章明细列表\n\n")
        f.write("| 文章名称 | 语言 | FAQ 状态 | 引用状态 | 统计数据密度 | GEO 得分 |\n")
        f.write("|----------|------|----------|----------|--------------|----------|\n")
        # 按照分数从高到低显示明细
        for r in sorted(results, key=lambda x: x['score'], reverse=True):
            faq_status = f"✅ ({r['faq_count']})" if r['has_faq'] else "❌"
            cit_status = f"✅ ({r['citation_count']})" if r['has_citation'] else "❌"
            f.write(f"| `{r['filename']}` | {r['lang'].upper()} | {faq_status} | {cit_status} | {r['stats_count']} | {r['score']:.1f} |\n")
            
    print(f"Audit completed. Report saved to: {report_path}")
    print(f"Total files audited: {len(results)}")
    print(f"Average site GEO score: {avg_score:.2f}")

if __name__ == '__main__':
    main()
