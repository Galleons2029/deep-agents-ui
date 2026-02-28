# 前端自定义组件迁移说明

本次从 `agent-chat-ui-main` 目录迁移了以下功能特性到主项目中：

## 已迁移的功能

### 1. Mermaid 图表支持 ✅
- **文件**: [src/app/components/MermaidDiagram.tsx](src/app/components/MermaidDiagram.tsx)
- **功能**: 
  - 支持流程图、序列图、甘特图、饼图、类图、状态图、ER图等
  - 透明背景适应页面颜色
  - 可折叠的源代码查看功能
  - 优雅的错误处理

### 2. ECharts 图表支持 ✅
- **文件**: [src/components/ui/chart-component.tsx](src/components/ui/chart-component.tsx)
- **功能**:
  - 支持折线图、柱状图、饼图、散点图等所有 ECharts 图表类型
  - 动态导入减少初始包大小
  - 响应式设计，自动适应窗口大小

### 3. 自定义组件注册表 ✅
- **文件**: [src/app/components/custom-component-registry.tsx](src/app/components/custom-component-registry.tsx)
- **功能**:
  - 支持从 `additional_kwargs.component` 提取组件配置
  - 支持 chart、table、image、file 等组件类型
  - 图片组件支持单张/多张、网格/轮播布局
  - 图片预览和下载功能

### 4. Markdown 扩展 ✅
- **文件**: [src/app/components/markdown-extensions.tsx](src/app/components/markdown-extensions.tsx)
- **功能**:
  - 自定义指令解析（:::chart{...}、:::table{...}）
  - 图表指令组件
  - 表格指令组件
  - Callout 高亮盒子组件

### 5. 增强的 Markdown 渲染 ✅
- **文件**: [src/app/components/MarkdownContent.tsx](src/app/components/MarkdownContent.tsx)
- **功能**:
  - Mermaid 图表在 Markdown 中的渲染
  - KaTeX 数学公式支持（行内和块级）
  - 代码块语法高亮
  - 复制代码功能

## 新增依赖

```json
{
  "mermaid": "^11.x",
  "echarts": "^6.0.0",
  "katex": "^0.16.x",
  "rehype-katex": "^7.0.x",
  "remark-math": "^6.0.x"
}
```

## 使用方法

### Mermaid 图表

在 Markdown 中使用：

\`\`\`markdown
\`\`\`mermaid
graph TD
    A[开始] --> B[处理]
    B --> C[结束]
\`\`\`
\`\`\`

或直接使用组件：

```tsx
import { MermaidDiagram } from '@/app/components/MermaidDiagram';

<MermaidDiagram chart={`
  graph LR
    A[开始] --> B[处理]
    B --> C[结束]
`} />
```

### ECharts 图表

通过后端返回 `additional_kwargs`：

```python
from langchain_core.messages import AIMessage

message = AIMessage(
    content="数据分析完成",
    additional_kwargs={
        "component": {
            "type": "chart",
            "data": {
                "option": {
                    "title": {"text": "月度销售数据"},
                    "xAxis": {"type": "category", "data": ["1月", "2月", "3月"]},
                    "yAxis": {"type": "value"},
                    "series": [{"data": [120, 200, 150], "type": "line"}]
                }
            }
        }
    }
)
```

### 数学公式

在 Markdown 中使用：

```markdown
行内公式: $E = mc^2$

块级公式:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## 测试页面

访问 `/test-components` 可以查看所有组件的演示效果。

## 文档

完整文档已迁移到 `docs/` 目录：
- [custom-components.md](docs/custom-components.md) - 自定义组件完整指南
- [mermaid-integration.md](docs/mermaid-integration.md) - Mermaid 集成指南
- [chart-integration.md](docs/chart-integration.md) - ECharts 集成指南
- [quick-start.md](docs/quick-start.md) - 快速开始
