"use client";

import { useState } from "react";
import { MarkdownContent } from "@/app/components/MarkdownContent";
import { MermaidDiagram } from "@/app/components/MermaidDiagram";
import { ChartComponent } from "@/components/ui/chart-component";
import {
  CustomComponentRenderer,
  ComponentConfig,
} from "@/app/components/custom-component-registry";

export default function TestComponentsPage() {
  const [activeTab, setActiveTab] = useState<
    "mermaid" | "chart" | "markdown" | "custom"
  >("mermaid");

  // Mermaid 图表示例
  const mermaidExamples = {
    flowchart: `graph TD
    A[用户请求] --> B{判断类型}
    B -->|查询| C[执行检索]
    B -->|分析| D[调用工具]
    C --> E[生成回复]
    D --> E`,
    sequence: `sequenceDiagram
    participant 用户
    participant 前端
    participant 后端
    participant 数据库

    用户->>前端: 提交订单
    前端->>后端: POST /api/orders
    后端->>数据库: 验证库存
    数据库-->>后端: 库存充足
    后端-->>前端: 返回结果
    前端-->>用户: 显示确认`,
    gantt: `gantt
    title 功能开发计划
    dateFormat YYYY-MM-DD
    section 第一阶段
    需求分析    :done, 2024-01-01, 3d
    UI设计      :done, 2024-01-04, 3d
    section 第二阶段
    前端开发    :active, 2024-01-07, 7d
    后端开发    :active, 2024-01-07, 7d
    section 第三阶段
    测试        :2024-01-14, 3d
    上线        :2024-01-17, 1d`,
    pie: `pie title 项目分布
    "前端开发" : 35
    "后端开发" : 30
    "UI设计" : 20
    "测试" : 15`,
  };

  // ECharts 图表示例
  const chartConfig = {
    option: {
      title: { text: "月度销售数据", left: "center" },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["1月", "2月", "3月", "4月", "5月", "6月"],
      },
      yAxis: { type: "value", name: "销售额（万元）" },
      series: [
        {
          name: "销售额",
          data: [120, 200, 150, 180, 220, 280],
          type: "line",
          smooth: true,
          itemStyle: { color: "#5470c6" },
        },
      ],
    },
  };

  // Markdown 示例（包含 Mermaid 和数学公式）
  const markdownContent = `
# Markdown 渲染测试

## 数学公式支持

行内公式: $E = mc^2$

块级公式:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Mermaid 图表

\`\`\`mermaid
graph LR
    A[开始] --> B[处理]
    B --> C{判断}
    C -->|是| D[结束]
    C -->|否| B
\`\`\`

## 代码高亮

\`\`\`python
def hello_world():
    print("Hello, World!")
    return 42

# 调用函数
result = hello_world()
\`\`\`

## 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| Mermaid 图表 | ✅ 完成 | 支持流程图、序列图等 |
| ECharts 图表 | ✅ 完成 | 支持各种统计图表 |
| 数学公式 | ✅ 完成 | KaTeX 渲染 |
| 代码高亮 | ✅ 完成 | Prism 语法高亮 |

## 引用

> 这是一段引用文字
> 可以包含多行
`;

  // 自定义组件配置示例
  const imageConfig: ComponentConfig = {
    type: "image",
    data: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
      alt: "数据分析图表",
      caption: "商业数据分析仪表板",
    },
  };

  const tableConfig: ComponentConfig = {
    type: "table",
    data: {
      headers: ["姓名", "年龄", "城市", "职业"],
      rows: [
        ["张三", 25, "北京", "工程师"],
        ["李四", 30, "上海", "设计师"],
        ["王五", 28, "深圳", "产品经理"],
        ["赵六", 35, "广州", "项目经理"],
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          🎨 组件测试页面
        </h1>

        {/* 标签页导航 */}
        <div className="mb-6 flex gap-2">
          {[
            { id: "mermaid", label: "🔷 Mermaid 图表" },
            { id: "chart", label: "📊 ECharts 图表" },
            { id: "markdown", label: "📝 Markdown 渲染" },
            { id: "custom", label: "🎯 自定义组件" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          {activeTab === "mermaid" && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold">Mermaid 图表示例</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-gray-700">流程图</h3>
                  <MermaidDiagram chart={mermaidExamples.flowchart} />
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-gray-700">饼图</h3>
                  <MermaidDiagram chart={mermaidExamples.pie} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">序列图</h3>
                <MermaidDiagram chart={mermaidExamples.sequence} />
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">甘特图</h3>
                <MermaidDiagram chart={mermaidExamples.gantt} />
              </div>
            </div>
          )}

          {activeTab === "chart" && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold">ECharts 图表示例</h2>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">折线图</h3>
                <ChartComponent
                  config={chartConfig}
                  className="rounded-lg border"
                />
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">柱状图</h3>
                <ChartComponent
                  config={{
                    option: {
                      title: { text: "季度销售对比", left: "center" },
                      tooltip: { trigger: "axis" },
                      xAxis: {
                        type: "category",
                        data: ["Q1", "Q2", "Q3", "Q4"],
                      },
                      yAxis: { type: "value" },
                      series: [
                        {
                          name: "2023年",
                          data: [150, 230, 224, 218],
                          type: "bar",
                          itemStyle: { color: "#91cc75" },
                        },
                        {
                          name: "2024年",
                          data: [200, 280, 260, 310],
                          type: "bar",
                          itemStyle: { color: "#5470c6" },
                        },
                      ],
                    },
                  }}
                  className="rounded-lg border"
                />
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">饼图</h3>
                <ChartComponent
                  config={{
                    option: {
                      title: { text: "流量来源", left: "center" },
                      tooltip: { trigger: "item" },
                      series: [
                        {
                          name: "访问来源",
                          type: "pie",
                          radius: "50%",
                          data: [
                            { value: 1048, name: "搜索引擎" },
                            { value: 735, name: "直接访问" },
                            { value: 580, name: "邮件营销" },
                            { value: 484, name: "联盟广告" },
                            { value: 300, name: "视频广告" },
                          ],
                          emphasis: {
                            itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                          },
                        },
                      ],
                    },
                  }}
                  className="rounded-lg border"
                />
              </div>
            </div>
          )}

          {activeTab === "markdown" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Markdown 渲染（含 Mermaid 和数学公式）
              </h2>
              <div className="rounded-lg border p-4">
                <MarkdownContent content={markdownContent} />
              </div>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold">自定义组件渲染器测试</h2>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">
                  图片组件 (type: &quot;image&quot;)
                </h3>
                <CustomComponentRenderer config={imageConfig} />
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">
                  表格组件 (type: &quot;table&quot;)
                </h3>
                <CustomComponentRenderer config={tableConfig} />
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">
                  图表组件 (type: &quot;chart&quot;)
                </h3>
                <CustomComponentRenderer
                  config={{
                    type: "chart",
                    data: chartConfig,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-blue-900">
            📖 使用说明
          </h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Mermaid 图表：</strong>在 Markdown
              中使用代码块，语言设置为 <code>mermaid</code>
            </p>
            <p>
              <strong>ECharts 图表：</strong>通过{" "}
              <code>additional_kwargs.component</code> 传递配置
            </p>
            <p>
              <strong>数学公式：</strong>使用 <code>$...$</code> 表示行内公式，
              <code>$$...$$</code> 表示块级公式
            </p>
            <p>
              <strong>自定义组件：</strong>支持 chart, table, image, file
              等类型
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
