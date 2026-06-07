# AI词库管理器

一个离线可用的单页提示词管理网站。直接打开 `index.html` 即可使用，数据会保存在当前浏览器本地。

## 已包含

- 内置 420 条精选提示词模板
- 额外接入 1814 条 GitHub / Skill 精选提示词，启动后总量约 2234 条
- 追加 100 条最新精选 GPT Store / 智能体 / 开发工作流提示词
- 追加 37 条本机可用 AI Skill 模板，覆盖科研、文档、表格、演示、浏览器、邮件、图像和视频工作流
- 追加 50 条写作高赞提示词
- 追加 500 条教育高赞提示词，覆盖课程设计、学习辅导、测评反馈、学术写作和教育技能模板
- 追加 120 条课题论文高赞提示词，覆盖选题、开题、文献综述、论文结构、LaTeX 润色、审稿与回复
- 追加 30 条视频制作提示词，每条都带对应本地效果视频或动图
- 追加 35 条豆包 P 图/生图提示词，其中 19 条保存了本地效果图
- 美化后的左右栏 UI、提示词卡片、统计区、筛选条和深浅色主题
- 从 YouMind 图像提示词库保存 120 张本地效果图到 `assets/github-effects/`
- 从高星视频提示词来源保存 30 个本地效果视频到 `assets/github-videos/`
- 从豆包/Seedream 图像提示词来源保存 19 张本地效果图到 `assets/github-doubao/`
- 自定义分类、重命名、删除和无限扩展
- 搜索、收藏、图片/视频素材、工作流筛选
- 批量选择和批量删除
- 浅色/深色主题切换
- 文本粘贴导入、电脑文件导入、网络图片/视频链接加载
- JSON 母版导入/导出，适合多设备或团队共享
- 两栏布局：左侧分类，右侧图片和提示词卡片展示
- 工具抽屉实时编辑，双击卡片快速复制
- 应用面板可把模板和本次任务组合成最终提示词

## 支持导入格式

- JSON：本工具导出的母版文件，或包含 `prompts` / `templates` 数组的文件
- TXT / Markdown：单条或多条提示词，多条可用空行或 `---` 分隔
- CSV：支持标题、分类、内容、标签、图片链接、视频链接、素材链接、类型等字段
- 图片和视频文件：会作为本地素材归档

## GitHub 高星来源

- `f/prompts.chat`：约 162.6k stars，导入 699 条
- `f/prompts.chat`：追加 50 条写作、编辑、文案、翻译、文章、故事和简历方向提示词
- `f/prompts.chat`：追加 303 条教育、学习、课程、测评和学术方向提示词
- `PlexPt/awesome-chatgpt-prompts-zh`：约 60.2k stars，导入 123 条中文提示词
- `YouMind-OpenLab/awesome-nano-banana-pro-prompts`：约 12.1k stars，导入 120 条带效果图的图像提示词
- `microsoft/prompts-for-edu`：约 1.8k stars，导入 15 条教育提示词
- `ahmetbersoz/chatgpt-prompts-for-academic-writing`：约 4.7k stars，导入 70 条学术写作提示词
- `ai-boost/awesome-prompts`：约 8.0k stars，导入 15 条 GPT Store 教育/学习提示词，并追加 100 条最新精选通用模板
- `GarethManning/education-agent-skills`：约 254 stars，导入 97 条教育技能模板
- `ahmetbersoz/chatgpt-prompts-for-academic-writing`：追加 66 条课题论文/学术写作提示词
- `xuhangc/ChatGPT-Academic-Prompt`：约 777 stars，导入 19 条论文润色和学术表达提示词
- `hollobit/ResearchChatGPT`：约 252 stars，导入 25 条科研流程提示词
- `binary-husky/gpt_academic`：约 70.7k stars，导入 5 条论文阅读、摘要、LaTeX 润色提示词
- `kaixindelele/ChatPaper`：约 19.5k stars，导入 3 条论文速读和关键词提示词
- `nishiwen1214/ChatReviewer`：约 1.4k stars，导入 2 条审稿和回复提示词
- `langgptai/awesome-doubao-prompts`：约 246 stars，导入 2 条豆包/即梦生图提示词并保存效果图
- `dongyubin/awesome-ai-images-prompts`：约 151 stars，导入 33 条适用于豆包 Seedream 4.0 的生图/P图案例
- `Tencent-Hunyuan/HunyuanVideo-1.5`：约 4.5k stars，导入 20 条带效果视频的官方视频提示词案例
- `YouMind-OpenLab/awesome-seedance-2-prompts`：约 1.1k stars，导入 5 条带 mp4 效果视频的 Seedance 2.0 精选提示词
- `GeminiGenAI/Veo3-AI-Video-API`：约 46 stars，导入 1 条 Veo 3 视频提示词案例
- `easonlai/video_generator_with_sora`：导入 1 条 Sora 视频提示词案例
- `FareedKhan-dev/text2video-from-scratch`：约 82 stars，导入 3 条 Text2Video 动图提示词案例
- 本机 Codex / CC Switch / OpenAI 插件 Skill：导入 37 条可复用 AI Skill 模板
