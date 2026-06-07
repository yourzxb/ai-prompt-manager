import { access, mkdir, writeFile } from "node:fs/promises";
import { extname } from "node:path";

const ROOT = new URL("../", import.meta.url);
const DATA_FILE = new URL("github-prompts.js", ROOT);
const IMAGE_DIR = new URL("assets/github-effects/", ROOT);
const VIDEO_DIR = new URL("assets/github-videos/", ROOT);
const DOUBAO_IMAGE_DIR = new URL("assets/github-doubao/", ROOT);

const SOURCES = {
  promptsChat: {
    owner: "f",
    repo: "prompts.chat",
    stars: 162588,
    forks: 21160,
    url: "https://github.com/f/prompts.chat",
    data: "https://raw.githubusercontent.com/f/prompts.chat/main/prompts.csv",
    limit: 700,
    writingSupplementLimit: 50,
    educationSupplementLimit: 500,
  },
  plexZh: {
    owner: "PlexPt",
    repo: "awesome-chatgpt-prompts-zh",
    stars: 60207,
    forks: 13589,
    url: "https://github.com/PlexPt/awesome-chatgpt-prompts-zh",
    data: "https://raw.githubusercontent.com/PlexPt/awesome-chatgpt-prompts-zh/main/prompts-zh.json",
  },
  youmind: {
    owner: "YouMind-OpenLab",
    repo: "awesome-nano-banana-pro-prompts",
    stars: 12123,
    forks: 1312,
    url: "https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts",
    data: "https://raw.githubusercontent.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/main/README_zh.md",
    limit: 120,
  },
  doubaoPrompts: {
    owner: "langgptai",
    repo: "awesome-doubao-prompts",
    stars: 246,
    forks: 32,
    url: "https://github.com/langgptai/awesome-doubao-prompts",
    data: "https://raw.githubusercontent.com/langgptai/awesome-doubao-prompts/main/README.md",
    rawBase: "https://raw.githubusercontent.com/langgptai/awesome-doubao-prompts/main/",
  },
  aiImagePrompts: {
    owner: "dongyubin",
    repo: "awesome-ai-images-prompts",
    stars: 151,
    forks: 22,
    url: "https://github.com/dongyubin/awesome-ai-images-prompts",
    data: "https://raw.githubusercontent.com/dongyubin/awesome-ai-images-prompts/main/README.md",
    rawBase: "https://raw.githubusercontent.com/dongyubin/awesome-ai-images-prompts/main/",
    doubaoLimit: 34,
  },
  seedanceVideo: {
    owner: "YouMind-OpenLab",
    repo: "awesome-seedance-2-prompts",
    stars: 1143,
    forks: 150,
    url: "https://github.com/YouMind-OpenLab/awesome-seedance-2-prompts",
    data: "https://raw.githubusercontent.com/YouMind-OpenLab/awesome-seedance-2-prompts/main/README.md",
  },
  hunyuanVideo15: {
    owner: "Tencent-Hunyuan",
    repo: "HunyuanVideo-1.5",
    stars: 4500,
    forks: 229,
    url: "https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5",
    data: "https://raw.githubusercontent.com/Tencent-Hunyuan/HunyuanVideo-1.5/main/assets/HunyuanVideo_1_5_Prompt_Handbook_EN.md",
    limit: 20,
  },
  veoVideoApi: {
    owner: "GeminiGenAI",
    repo: "Veo3-AI-Video-API",
    stars: 46,
    forks: 20,
    url: "https://github.com/GeminiGenAI/Veo3-AI-Video-API",
    data: "https://raw.githubusercontent.com/GeminiGenAI/Veo3-AI-Video-API/main/README.md",
    video: "https://raw.githubusercontent.com/GeminiGenAI/Veo3-AI-Video-API/main/assets/videos/veo3-example.mp4",
  },
  soraVideoGenerator: {
    owner: "easonlai",
    repo: "video_generator_with_sora",
    stars: 0,
    forks: 0,
    url: "https://github.com/easonlai/video_generator_with_sora",
    data: "https://raw.githubusercontent.com/easonlai/video_generator_with_sora/main/readme.md",
    videos: [
      "https://raw.githubusercontent.com/easonlai/video_generator_with_sora/main/output_task_01jyfsvg6wfn7tyb0vrnhzg7b1.mp4",
      "https://raw.githubusercontent.com/easonlai/video_generator_with_sora/main/output_task_01jyg1cbqqemr87dtjag42f6x0.mp4",
      "https://raw.githubusercontent.com/easonlai/video_generator_with_sora/main/output_task_01jyg1rjsdep0a7jw8prxj6d11.mp4",
    ],
  },
  text2VideoScratch: {
    owner: "FareedKhan-dev",
    repo: "text2video-from-scratch",
    stars: 82,
    forks: 16,
    url: "https://github.com/FareedKhan-dev/text2video-from-scratch",
    data: "https://raw.githubusercontent.com/FareedKhan-dev/text2video-from-scratch/main/README.md",
    rawBase: "https://raw.githubusercontent.com/FareedKhan-dev/text2video-from-scratch/main/",
  },
  microsoftEdu: {
    owner: "microsoft",
    repo: "prompts-for-edu",
    stars: 1845,
    forks: 207,
    url: "https://github.com/microsoft/prompts-for-edu",
    tree: "https://api.github.com/repos/microsoft/prompts-for-edu/git/trees/main?recursive=1",
    rawBase: "https://raw.githubusercontent.com/microsoft/prompts-for-edu/main/",
  },
  academicWriting: {
    owner: "ahmetbersoz",
    repo: "chatgpt-prompts-for-academic-writing",
    stars: 4670,
    forks: 380,
    url: "https://github.com/ahmetbersoz/chatgpt-prompts-for-academic-writing",
    data: "https://raw.githubusercontent.com/ahmetbersoz/chatgpt-prompts-for-academic-writing/main/README.md",
    paperSupplementLimit: 50,
  },
  xuhangcAcademic: {
    owner: "xuhangc",
    repo: "ChatGPT-Academic-Prompt",
    stars: 777,
    forks: 85,
    url: "https://github.com/xuhangc/ChatGPT-Academic-Prompt",
    data: "https://raw.githubusercontent.com/xuhangc/ChatGPT-Academic-Prompt/main/README.md",
    paperSupplementLimit: 25,
  },
  chatPaper: {
    owner: "kaixindelele",
    repo: "ChatPaper",
    stars: 19500,
    forks: 1946,
    url: "https://github.com/kaixindelele/ChatPaper",
    rawBase: "https://raw.githubusercontent.com/kaixindelele/ChatPaper/main/",
  },
  gptAcademic: {
    owner: "binary-husky",
    repo: "gpt_academic",
    stars: 70692,
    forks: 8389,
    url: "https://github.com/binary-husky/gpt_academic",
    rawBase: "https://raw.githubusercontent.com/binary-husky/gpt_academic/master/",
  },
  chatReviewer: {
    owner: "nishiwen1214",
    repo: "ChatReviewer",
    stars: 1378,
    forks: 123,
    url: "https://github.com/nishiwen1214/ChatReviewer",
    rawBase: "https://raw.githubusercontent.com/nishiwen1214/ChatReviewer/main/",
  },
  researchChatGpt: {
    owner: "hollobit",
    repo: "ResearchChatGPT",
    stars: 252,
    forks: 30,
    url: "https://github.com/hollobit/ResearchChatGPT",
    data: "https://raw.githubusercontent.com/hollobit/ResearchChatGPT/main/README.md",
    paperSupplementLimit: 30,
  },
  garethEdu: {
    owner: "GarethManning",
    repo: "education-agent-skills",
    stars: 254,
    forks: 47,
    url: "https://github.com/GarethManning/education-agent-skills",
    tree: "https://api.github.com/repos/GarethManning/education-agent-skills/git/trees/main?recursive=1",
    rawBase: "https://raw.githubusercontent.com/GarethManning/education-agent-skills/main/",
  },
  aiBoost: {
    owner: "ai-boost",
    repo: "awesome-prompts",
    stars: 7954,
    forks: 736,
    url: "https://github.com/ai-boost/awesome-prompts",
    tree: "https://api.github.com/repos/ai-boost/awesome-prompts/contents/prompts?ref=main",
    rawBase: "https://raw.githubusercontent.com/ai-boost/awesome-prompts/main/",
    latestSupplementLimit: 100,
  },
};

const BLOCKLIST = /jailbreak|DAN\b|developer mode|ignore (all )?(previous|prior)|bypass|unrestricted|nsfw|porn|erotic|explicit sexual|illegal drugs|weapon instructions/i;

const promptPack = {
  version: "github-stars-2026-05-24-latest100-v1",
  generatedAt: new Date().toISOString(),
  replaceSourcePrefixes: [
    "GitHub写作高赞",
    "GitHub教育高赞",
    "Microsoft教育精选",
    "学术写作高赞",
    "教育技能精选",
    "GPT Store教育精选",
    "课题论文高赞",
    "视频制作高赞",
    "豆包P图生图",
    "最新精选高赞",
  ],
  sources: [],
  prompts: [],
};

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  await mkdir(VIDEO_DIR, { recursive: true });
  await mkdir(DOUBAO_IMAGE_DIR, { recursive: true });

  const promptsChatItems = await importPromptsChat();
  const plexItems = await importPlexZh();
  const youmindItems = await importYouMind();
  const writingSupplementItems = await importWritingSupplement();
  const educationSupplementItems = await importEducationSupplement();
  const paperWritingItems = await importPaperWritingSupplement();
  const videoPromptItems = await importVideoPromptSupplement();
  const doubaoImageItems = await importDoubaoImageSupplement();
  const latestPromptItems = await importLatestPromptSupplement();

  promptPack.prompts.push(
    ...dedupe([
      ...promptsChatItems,
      ...plexItems,
      ...youmindItems,
      ...writingSupplementItems,
      ...educationSupplementItems,
      ...paperWritingItems,
      ...videoPromptItems,
      ...doubaoImageItems,
      ...latestPromptItems,
    ]),
  );
  promptPack.sources = Object.values(SOURCES).map(({ owner, repo, stars, forks, url }) => ({
    owner,
    repo,
    stars,
    forks,
    url,
  }));

  const js = [
    "window.GITHUB_PROMPT_PACK = ",
    JSON.stringify(promptPack, null, 2),
    ";\n",
  ].join("");
  await writeFile(DATA_FILE, js, "utf8");

  const bySource = promptPack.prompts.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify({ total: promptPack.prompts.length, bySource }, null, 2));
}

async function importEducationSupplement() {
  const promptsChatItems = await importPromptsChatEducation();
  const microsoftItems = await importMicrosoftEducation();
  const academicWritingItems = await importAcademicWritingEducation();
  const aiBoostItems = await importAiBoostEducation();
  const garethItems = await importGarethEducationSkills();
  const items = [
    ...promptsChatItems.slice(0, 400),
    ...microsoftItems.slice(0, 15),
    ...academicWritingItems.slice(0, 70),
    ...aiBoostItems.slice(0, 15),
    ...garethItems.slice(0, 100),
    ...promptsChatItems.slice(400),
    ...microsoftItems.slice(15),
    ...academicWritingItems.slice(70),
    ...aiBoostItems.slice(15),
    ...garethItems.slice(100),
  ];

  return items.slice(0, SOURCES.promptsChat.educationSupplementLimit);
}

async function importPromptsChatEducation() {
  const csv = await fetchText(SOURCES.promptsChat.data);
  const rows = parseCsv(csv);
  const headers = rows.shift();
  const candidates = [];

  rows.forEach((row, index) => {
    const record = objectFromRow(headers, row);
    const title = clean(record.act);
    const content = clean(record.prompt);
    const searchable = `${title}\n${content}`;
    if (!title || !content || BLOCKLIST.test(searchable)) return;

    const score = educationScore(title, content);
    if (!isEducationCandidate(title, content, score)) return;

    candidates.push({
      score,
      index,
      item: educationItem({
        id: stableId("github-edu-f", title),
        title,
        source: `GitHub教育高赞 ${formatStars(SOURCES.promptsChat.stars)}★ · f/prompts.chat`,
        sourceTag: "prompts.chat",
        favorite: candidates.length < 18,
        content,
      }),
    });
  });

  return candidates
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((candidate) => candidate.item);
}

async function importMicrosoftEducation() {
  const tree = JSON.parse(await fetchText(SOURCES.microsoftEdu.tree));
  const promptPaths = tree.tree
    .filter((entry) => entry.type === "blob")
    .map((entry) => entry.path)
    .filter((path) => /^(Educators|Students)\/Prompts\/.+\.md$/i.test(path))
    .filter((path) => !/\/Media\//i.test(path))
    .sort((a, b) => a.localeCompare(b));

  const items = [];
  for (const path of promptPaths) {
    const raw = await fetchText(`${SOURCES.microsoftEdu.rawBase}${encodePath(path)}`);
    const title = titleFromPath(path);
    const content = cleanMarkdownPrompt(raw);
    if (!content || BLOCKLIST.test(`${title}\n${content}`)) continue;

    items.push(
      educationItem({
        id: stableId("github-edu-ms", path),
        title,
        source: `Microsoft教育精选 ${formatStars(SOURCES.microsoftEdu.stars)}★ · microsoft/prompts-for-edu`,
        sourceTag: "Microsoft",
        favorite: items.length < 8,
        content,
      }),
    );
  }

  return items;
}

async function importAcademicWritingEducation() {
  const markdown = await fetchText(SOURCES.academicWriting.data);
  return extractMarkdownCodePrompts(markdown).map((prompt, index) =>
    educationItem({
      id: stableId("github-edu-academic", `${prompt.heading}-${index}-${prompt.content.slice(0, 64)}`),
      title: `${prompt.heading} · ${titleFromPrompt(prompt.content, index)}`,
      source: `学术写作高赞 ${formatStars(SOURCES.academicWriting.stars)}★ · ahmetbersoz/chatgpt-prompts-for-academic-writing`,
      sourceTag: "学术写作",
      favorite: index < 8,
      content: prompt.content,
    }),
  );
}

async function importAiBoostEducation() {
  const entries = JSON.parse(await fetchText(SOURCES.aiBoost.tree));
  const educationFileName =
    /academic|adaptive|learn|learning|teach|teacher|tutor|course|curriculum|education|student|research|writing|peer|review|study|knowledge|cognitive|quiz|exam|math|language|mentor|coach|science|thesis|paper/i;
  const paths = entries
    .filter((entry) => entry.type === "file")
    .map((entry) => entry.path)
    .filter((path) => /^prompts\/.+\.txt$/i.test(path) && educationFileName.test(path))
    .sort((a, b) => a.localeCompare(b));

  const items = [];
  for (const path of paths) {
    const raw = await fetchText(`${SOURCES.aiBoost.rawBase}${encodePath(path)}`);
    const title = titleFromPath(path);
    const content = clean(raw);
    if (!content || BLOCKLIST.test(`${title}\n${content}`)) continue;
    if (educationScore(title, content) < 4) continue;

    items.push(
      educationItem({
        id: stableId("github-edu-aiboost", path),
        title,
        source: `GPT Store教育精选 ${formatStars(SOURCES.aiBoost.stars)}★ · ai-boost/awesome-prompts`,
        sourceTag: "GPT Store",
        favorite: items.length < 8,
        content,
      }),
    );
  }

  return items;
}

async function importGarethEducationSkills() {
  const tree = JSON.parse(await fetchText(SOURCES.garethEdu.tree));
  const paths = tree.tree
    .filter((entry) => entry.type === "blob")
    .map((entry) => entry.path)
    .filter((path) => /^skills\/.+\/SKILL\.md$/i.test(path))
    .sort((a, b) => a.localeCompare(b));

  const items = [];
  for (const path of paths) {
    if (items.length >= 110) break;

    const raw = await fetchText(`${SOURCES.garethEdu.rawBase}${encodePath(path)}`);
    const skill = parseEducationSkill(raw, path);
    if (!skill.content || BLOCKLIST.test(`${skill.title}\n${skill.content}`)) continue;

    items.push(
      educationItem({
        id: stableId("github-edu-gareth", path),
        title: skill.title,
        source: `教育技能精选 ${formatStars(SOURCES.garethEdu.stars)}★ · GarethManning/education-agent-skills`,
        sourceTag: "教育技能",
        favorite: items.length < 8,
        content: skill.content,
      }),
    );
  }

  return items;
}

function educationItem({ id, title, source, sourceTag, favorite, content }) {
  return {
    id,
    title: `教育高赞｜${title}`,
    category: "教育高赞·GitHub",
    type: "文本",
    tags: ["GitHub", "教育", "高星", "500补充", sourceTag],
    favorite,
    imageUrl: "",
    source,
    createdAt: "2026-05-21T00:00:00.000Z",
    updatedAt: "2026-05-21T00:00:00.000Z",
    content,
  };
}

async function importPaperWritingSupplement() {
  const academicWritingItems = await importAcademicWritingPaperSupplement();
  const xuhangcItems = await importXuhangcPaperSupplement();
  const researchItems = await importResearchChatGptPaperSupplement();
  const curatedItems = importCuratedPaperToolPrompts();
  const items = dedupeByContent([
    ...academicWritingItems.slice(0, SOURCES.academicWriting.paperSupplementLimit),
    ...xuhangcItems.slice(0, SOURCES.xuhangcAcademic.paperSupplementLimit),
    ...researchItems.slice(0, SOURCES.researchChatGpt.paperSupplementLimit),
    ...curatedItems,
    ...academicWritingItems.slice(SOURCES.academicWriting.paperSupplementLimit),
    ...xuhangcItems.slice(SOURCES.xuhangcAcademic.paperSupplementLimit),
    ...researchItems.slice(SOURCES.researchChatGpt.paperSupplementLimit),
  ]);

  return items.slice(0, 120);
}

async function importAcademicWritingPaperSupplement() {
  const markdown = await fetchText(SOURCES.academicWriting.data);
  return extractMarkdownCodePrompts(markdown)
    .filter((prompt) => isPaperWritingPrompt(`${prompt.heading}\n${prompt.content}`))
    .map((prompt, index) =>
      paperItem({
        id: stableId("github-paper-ahmet", `${prompt.heading}-${index}-${prompt.content.slice(0, 80)}`),
        title: `${prompt.heading} · ${titleFromPrompt(prompt.content, index)}`,
        source: `课题论文高赞 ${formatStars(SOURCES.academicWriting.stars)}★ · ahmetbersoz/chatgpt-prompts-for-academic-writing`,
        sourceTag: "学术写作",
        favorite: index < 8,
        content: prompt.content,
      }),
    );
}

async function importXuhangcPaperSupplement() {
  const markdown = await fetchText(SOURCES.xuhangcAcademic.data);
  return markdown
    .split(/\n+/)
    .map((line) => clean(line))
    .filter((line) => line.length > 35)
    .filter((line) => !line.startsWith("#") && !line.startsWith("[") && !line.startsWith("!"))
    .filter((line) => !/^https?:\/\//i.test(line))
    .filter(isPaperWritingPrompt)
    .map((content, index) =>
      paperItem({
        id: stableId("github-paper-xuhangc", `${index}-${content.slice(0, 80)}`),
        title: `Academic Prompt · ${titleFromPrompt(content, index)}`,
        source: `课题论文高赞 ${formatStars(SOURCES.xuhangcAcademic.stars)}★ · xuhangc/ChatGPT-Academic-Prompt`,
        sourceTag: "论文润色",
        favorite: index < 6,
        content,
      }),
    );
}

async function importResearchChatGptPaperSupplement() {
  const markdown = await fetchText(SOURCES.researchChatGpt.data);
  const tasks = [...markdown.matchAll(/^\d+\.\s+\[([^\]]+)]/gm)].map((match) => clean(match[1]));

  return tasks
    .filter((task) => /research|literature|methodolog|hypoth|writing|paper|citation|finding|data|ethical|participant|sample|instrument|qualitative|quantitative|thesis|introduction|conclusion/i.test(task))
    .map((task, index) =>
      paperItem({
        id: stableId("github-paper-researchchatgpt", `${index}-${task}`),
        title: `ResearchGPT · ${task}`,
        source: `课题论文高赞 ${formatStars(SOURCES.researchChatGpt.stars)}★ · hollobit/ResearchChatGPT`,
        sourceTag: "科研流程",
        favorite: index < 6,
        content: clean(`
Act as a senior research mentor. Help me complete this research-paper task: ${task}.

First ask for any missing context: research field, paper type, target journal or course requirement, available data/materials, deadline, expected language, and citation style.

Then provide:
1. A concise diagnosis of the current research need.
2. A step-by-step action plan.
3. A reusable writing template or checklist.
4. Risks, limitations, and academic-integrity reminders.
5. A polished example that I can adapt, without fabricating sources or results.
`),
      }),
    );
}

function importCuratedPaperToolPrompts() {
  const groups = [
    {
      source: `课题论文高赞 ${formatStars(SOURCES.gptAcademic.stars)}★ · binary-husky/gpt_academic`,
      sourceTag: "GPT Academic",
      prefix: "github-paper-gptacademic",
      prompts: [
        {
          title: "PDF论文四问精读报告",
          content:
            "请作为科研论文解读专家，基于我提供的论文内容输出中文精读报告：1. 论文题目及中文翻译；2. 作者与机构；3. 研究背景；4. 过去方法及其问题；5. 本文方法、模型或理论框架；6. 实验任务、数据、指标和主要结果；7. 创新点；8. 局限性；9. 可复现性风险；10. 后续可开展的课题方向。",
        },
        {
          title: "LaTeX论文全文润色",
          content:
            "以下是一篇学术论文的 LaTeX 片段。请按学术论文标准润色，提高语法、清晰度、连贯性和可读性。不要修改任何 LaTeX 命令、引用、公式、表格环境或标签。只输出修改后的 LaTeX 原文，并在最后列出主要修改原则。",
        },
        {
          title: "论文摘要中英文生成",
          content:
            "请逐段分析我提供的论文材料，先提炼研究问题、方法、数据、结果和贡献，再用学术语言生成一段中文摘要和一段英文摘要。摘要需避免夸大结论，不编造实验结果，并保持可投稿论文的正式风格。",
        },
        {
          title: "论文核心问题拆解",
          content:
            "请基于论文内容回答四个核心问题：1. 主要研究问题、目标和动机是什么；2. 关键方法、模型或理论框架是什么；3. 主要发现、结论和创新点是什么；4. 局限性、未来方向和潜在影响是什么。请保持客观、准确，并引用原文证据位置。",
        },
        {
          title: "文献综述 Related Work 框架",
          content:
            "请根据我的研究主题和已读文献，帮助我组织 Related Work。要求：按研究脉络分组，而不是逐篇罗列；指出每组文献的共同假设、方法差异和不足；最后自然引出本文课题的研究空白和贡献定位。",
        },
      ],
    },
    {
      source: `课题论文高赞 ${formatStars(SOURCES.chatPaper.stars)}★ · kaixindelele/ChatPaper`,
      sourceTag: "ChatPaper",
      prefix: "github-paper-chatpaper",
      prompts: [
        {
          title: "论文速读四点总结",
          content:
            "请阅读论文后按四点总结：1. 研究背景是什么；2. 过去方案是什么、存在什么问题；3. 本文提出了什么方法，具体步骤是什么；4. 本文在哪些任务上取得了什么效果，结果是否支撑目标。请用中文回答，专业名词保留英文。",
        },
        {
          title: "课题关键词提取",
          content:
            "我会提供论文题目、摘要或课题设想。请为学术数据库检索提取 3 到 5 个最相关的英文关键词/研究领域，并按重要性 1-10 打分。请输出可被 JSON 解析的对象，不要添加额外解释。",
        },
        {
          title: "论文预备概念排序",
          content:
            "给定论文题目和主要贡献，请提出读懂这篇论文前必须掌握的预备概念，并按学习顺序排序。输出 JSON：键为概念名称，值为顺序编号；编号越小越应先介绍。",
        },
      ],
    },
    {
      source: `课题论文高赞 ${formatStars(SOURCES.chatReviewer.stars)}★ · nishiwen1214/ChatReviewer`,
      sourceTag: "审稿反馈",
      prefix: "github-paper-chatreviewer",
      prompts: [
        {
          title: "模拟审稿意见",
          content:
            "请作为该领域的专业审稿人，评估我提供的论文。输出：Overall Review、Paper Strength、Paper Weakness、Questions To Authors And Suggestions For Rebuttal、Overall Score(1-10)。请重点讨论创新性、正确性、清晰度、结果意义、潜在影响和表达质量。",
        },
        {
          title: "审稿回复 Response Letter",
          content:
            "请作为论文作者，根据审稿意见逐条生成回复。要求提取每个 reviewer 的 concern，逐点回应；措辞使用已经完成的修改，不写空泛承诺；每条回复包含修改位置、修改内容和理由。输出 Response to reviewers 格式。",
        },
      ],
    },
  ];

  return groups.flatMap((group) =>
    group.prompts.map((prompt, index) =>
      paperItem({
        id: stableId(group.prefix, `${prompt.title}-${index}`),
        title: prompt.title,
        source: group.source,
        sourceTag: group.sourceTag,
        favorite: index < 3,
        content: prompt.content,
      }),
    ),
  );
}

function paperItem({ id, title, source, sourceTag, favorite, content }) {
  return {
    id,
    title: `课题论文｜${title}`,
    category: "课题论文高赞·GitHub",
    type: "文本",
    tags: ["GitHub", "课题论文", "科研写作", "高星", sourceTag],
    favorite,
    imageUrl: "",
    source,
    createdAt: "2026-05-21T00:00:00.000Z",
    updatedAt: "2026-05-21T00:00:00.000Z",
    content,
  };
}

function isPaperWritingPrompt(value) {
  const text = clean(value);
  if (!text || BLOCKLIST.test(text)) return false;
  if (/!\[|what does the following code do|add comments to the following code|formal email to|business collaboration/i.test(text)) {
    return false;
  }
  return /research|paper|academic|literature|thesis|abstract|introduction|methodolog|result|discussion|conclusion|citation|bibliograph|journal|review|proposal|hypoth|latex|paragraph|proofread|polish|summari[sz]e|outline|experiment|conference|CVPR|ICCV|ICML|NeurIPS/i.test(
    text,
  );
}

async function importWritingSupplement() {
  const csv = await fetchText(SOURCES.promptsChat.data);
  const rows = parseCsv(csv);
  const headers = rows.shift();
  const items = [];
  const writingTitle =
    /translator|translation|summari[sz]er|summary|copywriter|copywriting|article|literature|story|storytelling|writing|writer|cover letter|\bcv\b|linguistic|proofreading|proofreader|social media|brand story|screenplay|blog|linkedin|resume|cold email|paper drafting|podcast|ghostwriter|landing page copy|book|technical blog|writing advisor|seo|outline|birthday message|content|newsletter|headline|editor|rewrite/i;
  const offTopic =
    /developer|code|program|python|javascript|sql|terminal|linux|ethereum|contract|debug|app development|dashboard|technical drawing|image analysis|photography|photo|portrait|selfie|cinematic|render|stable diffusion|midjourney|floor plan|pharmacy|course|grader|study|finance tracker|candlestick|network|monitoring|pos application|cartoon|process feasibility|continuous execution|recipe|investigative|storyboard|demolition|academic advisor|prompt optimization|optimized versions|home page|safety week|YKS|PDF editor|illustrator|chat history|functional analyst|fish|sacrifice|mockup interview|PromptAudit|AI Kickstart|spec interview/i;

  rows.forEach((row, index) => {
    if (items.length >= SOURCES.promptsChat.writingSupplementLimit) return;
    if (index < SOURCES.promptsChat.limit) return;

    const record = objectFromRow(headers, row);
    const title = clean(record.act);
    const content = clean(record.prompt);
    const searchable = `${title}\n${content}`;
    if (!title || !content || BLOCKLIST.test(searchable)) return;
    if (!writingTitle.test(title) || offTopic.test(searchable)) return;

    items.push({
      id: stableId("github-writing50", title),
      title: `写作高赞｜${title}`,
      category: "写作高赞·GitHub",
      type: "文本",
      tags: ["GitHub", "写作", "高星", "补充"],
      favorite: items.length < 10,
      imageUrl: "",
      source: `GitHub写作高赞 ${formatStars(SOURCES.promptsChat.stars)}★ · f/prompts.chat`,
      createdAt: "2026-05-20T00:00:00.000Z",
      updatedAt: "2026-05-20T00:00:00.000Z",
      content,
    });
  });

  return items;
}

async function importLatestPromptSupplement() {
  const entries = JSON.parse(await fetchText(SOURCES.aiBoost.tree));
  const paths = entries
    .filter((entry) => entry.type === "file")
    .map((entry) => entry.path)
    .filter((path) => /^prompts\/.+\.(txt|md)$/i.test(path))
    .filter((path) => isLatestPromptCandidate(path))
    .sort((a, b) => latestPromptPriority(a) - latestPromptPriority(b) || a.localeCompare(b));

  const items = [];
  for (const path of paths) {
    if (items.length >= SOURCES.aiBoost.latestSupplementLimit) break;

    const raw = await fetchText(`${SOURCES.aiBoost.rawBase}${encodePath(path)}`);
    const content = cleanPromptBody(raw);
    const title = titleFromPath(path);
    if (!content || content.length < 80 || BLOCKLIST.test(`${title}\n${content}`)) continue;
    if (isUnsafeLatestPrompt(title, content)) continue;

    items.push({
      id: stableId("github-latest-aiboost", path),
      title: `最新精选｜${title}`,
      category: "最新精选·GitHub",
      type: latestPromptType(title, content),
      tags: ["GitHub", "最新精选", "GPT Store", latestPromptTag(title, content)],
      favorite: items.length < 16,
      imageUrl: "",
      source: `最新精选高赞 ${formatStars(SOURCES.aiBoost.stars)}★ · ai-boost/awesome-prompts`,
      createdAt: "2026-05-24T00:00:00.000Z",
      updatedAt: "2026-05-24T00:00:00.000Z",
      content,
    });
  }

  return items;
}

function isLatestPromptCandidate(path) {
  const lower = path.toLowerCase();
  if (/jailbreak|dan|nsfw|vulnerability|red_team|exploit|malware|phishing|weapon/.test(lower)) return false;
  if (/academic|paper|thesis|education|learning|teacher|student|course|curriculum|tutor|exam|quiz|clinical|legal|medical/.test(lower)) {
    return false;
  }
  return true;
}

function latestPromptPriority(path) {
  const lower = path.toLowerCase();
  const buckets = [
    /agent|tool|workflow|orchestrator|automation|computer_use/,
    /code|debug|developer|software|api|database|cloud|architecture|security|review/,
    /product|project|program|operations|strategy|manager|career|change/,
    /data|analytics|research|knowledge|documentation|technical/,
    /design|brand|content|writing|creative|narrative|video/,
  ];
  const index = buckets.findIndex((pattern) => pattern.test(lower));
  return index < 0 ? buckets.length : index;
}

function isUnsafeLatestPrompt(title, content) {
  const text = `${title}\n${content}`;
  return /bypass|exploit|malware|phishing|credential|weapon|jailbreak|DAN\b|unrestricted|vulnerability scanner|red team/i.test(text);
}

function cleanPromptBody(raw) {
  return clean(
    raw
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      .replace(/^\s*#\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n"),
  );
}

function latestPromptType(title, content) {
  const text = `${title}\n${content}`;
  if (/workflow|operations|program manager|project|orchestrator|agent|tool|automation/i.test(text)) return "工作流";
  if (/image|visual|video|cinematography|artist|diffusion/i.test(text)) return "图像";
  return "文本";
}

function latestPromptTag(title, content) {
  const text = `${title}\n${content}`.toLowerCase();
  if (/agent|orchestrator|tool|computer_use|workflow/.test(text)) return "智能体";
  if (/code|debug|developer|software|api|database|cloud|architecture|security/.test(text)) return "开发";
  if (/product|project|program|operations|strategy|manager|career/.test(text)) return "效率";
  if (/data|analytics|research|knowledge|documentation|technical/.test(text)) return "知识";
  if (/design|brand|content|writing|creative|narrative|video/.test(text)) return "创意";
  return "通用";
}

async function importPromptsChat() {
  const csv = await fetchText(SOURCES.promptsChat.data);
  const rows = parseCsv(csv);
  const headers = rows.shift();
  const items = [];

  for (const row of rows) {
    if (items.length >= SOURCES.promptsChat.limit) break;
    const record = objectFromRow(headers, row);
    const title = clean(record.act);
    const content = clean(record.prompt);
    if (!title || !content || BLOCKLIST.test(`${title}\n${content}`)) continue;

    const category = categoryFromTitle(title, content);
    items.push({
      id: stableId("github-f", title),
      title: `GitHub高星｜${title}`,
      category,
      type: record.type === "IMAGE" ? "图像" : "文本",
      tags: compact(["GitHub", "高星", "prompts.chat", record.for_devs === "TRUE" ? "开发者" : "通用"]),
      favorite: SOURCES.promptsChat.stars > 100000 && items.length < 20,
      imageUrl: "",
      source: `GitHub高星 ${formatStars(SOURCES.promptsChat.stars)}★ · f/prompts.chat`,
      createdAt: "2026-05-20T00:00:00.000Z",
      updatedAt: "2026-05-20T00:00:00.000Z",
      content,
    });
  }

  return items;
}

async function importPlexZh() {
  const json = JSON.parse(await fetchText(SOURCES.plexZh.data));
  return json
    .filter((item) => !BLOCKLIST.test(`${item.act}\n${item.prompt}`))
    .map((item, index) => ({
      id: stableId("github-plex", item.act || `zh-${index}`),
      title: `中文高星｜${clean(item.act) || `提示词 ${index + 1}`}`,
      category: "GitHub精选·中文",
      type: "文本",
      tags: ["GitHub", "中文", "高星", "PlexPt"],
      favorite: index < 12,
      imageUrl: "",
      source: `GitHub高星 ${formatStars(SOURCES.plexZh.stars)}★ · PlexPt/awesome-chatgpt-prompts-zh`,
      createdAt: "2026-05-20T00:00:00.000Z",
      updatedAt: "2026-05-20T00:00:00.000Z",
      content: clean(item.prompt),
    }))
    .filter((item) => item.content);
}

async function importYouMind() {
  const markdown = await fetchText(SOURCES.youmind.data);
  const sections = splitYouMindSections(markdown).slice(0, SOURCES.youmind.limit);
  const items = [];

  for (const section of sections) {
    const prompt = extractFirstCodeBlock(section.body);
    if (!prompt || BLOCKLIST.test(`${section.title}\n${prompt}`)) continue;

    const imageUrl = extractFirstImage(section.body);
    const localImage = imageUrl
      ? await downloadEffectImage(imageUrl, stableId("youmind", section.title))
      : "";

    items.push({
      id: stableId("github-youmind", section.title),
      title: `效果图｜${section.title}`,
      category: categoryFromYouMindTitle(section.title),
      type: "图像",
      tags: ["GitHub", "效果图", "图像提示词", "YouMind"],
      favorite: items.length < 12,
      imageUrl: localImage,
      source: `GitHub高星 ${formatStars(SOURCES.youmind.stars)}★ · YouMind Nano Banana Pro`,
      createdAt: "2026-05-20T00:00:00.000Z",
      updatedAt: "2026-05-20T00:00:00.000Z",
      content: prompt,
    });
  }

  return items;
}

async function importVideoPromptSupplement() {
  const hunyuanItems = await importHunyuanVideoPrompts();
  const seedanceItems = await importSeedanceVideoPrompts();
  const veoItems = await importVeoVideoPrompt();
  const soraItems = await importSoraVideoPrompt();
  const scratchItems = await importText2VideoScratchPrompts();

  return dedupeByContent([
    ...hunyuanItems,
    ...seedanceItems,
    ...veoItems,
    ...soraItems,
    ...scratchItems,
  ]);
}

async function importDoubaoImageSupplement() {
  const doubaoSpecificItems = await importDoubaoSpecificImages();
  const compatibleItems = await importDoubaoCompatibleImages();

  return dedupeByContent([
    ...doubaoSpecificItems,
    ...compatibleItems,
  ]);
}

async function importDoubaoSpecificImages() {
  const markdown = await fetchText(SOURCES.doubaoPrompts.data);
  const imageSection = sectionBetween(markdown, "### 生图提示词", "### 💼");
  const sections = splitHeadingSections(imageSection, /^####\s+(.+)$/gm);
  const items = [];

  for (const section of sections) {
    const prompt = extractFirstFence(section.body);
    if (!prompt || BLOCKLIST.test(`${section.title}\n${prompt}`)) continue;

    const imageUrl = extractFirstMarkdownImage(section.body);
    const localImage = imageUrl
      ? await downloadDoubaoImage(new URL(imageUrl, SOURCES.doubaoPrompts.rawBase).toString(), stableId("doubao", section.title))
      : "";
    const model = clean(section.body.match(/模型[:：]\s*([^\n]+)/)?.[1]) || "即梦3.0 / 豆包生图";

    items.push(
      doubaoImageItem({
        id: stableId("github-doubao-specific", section.title),
        title: `豆包生图｜${section.title}`,
        source: `豆包P图生图 ${formatStars(SOURCES.doubaoPrompts.stars)}★ · langgptai/awesome-doubao-prompts`,
        sourceTag: "豆包专用",
        favorite: true,
        imageUrl: localImage,
        content: `推荐模型：${model}\n\n${prompt}`,
      }),
    );
  }

  return items;
}

async function importDoubaoCompatibleImages() {
  const markdown = await fetchText(SOURCES.aiImagePrompts.data);
  const gallery = sectionBetween(markdown, "## AI生图提示词展示案例", "## 10 个 Nano Banana Pro 专业级生图技巧");
  const sections = splitHeadingSections(gallery, /^###\s+(.+)$/gm);
  const items = [];

  for (const section of sections) {
    if (items.length >= SOURCES.aiImagePrompts.doubaoLimit) break;
    const prompt = extractFirstFence(section.body);
    if (!prompt || BLOCKLIST.test(`${section.title}\n${prompt}`)) continue;

    const imageUrl = extractFirstMarkdownImage(section.body);
    const localImage = imageUrl
      ? await downloadDoubaoImage(new URL(imageUrl, SOURCES.aiImagePrompts.rawBase).toString(), stableId("doubao-compatible", section.title))
      : "";
    const model =
      clean(section.body.match(/使用生图模型[:：]\s*([^\n]+)/)?.[1]) ||
      clean(section.body.match(/模型[:：]\s*([^\n]+)/)?.[1]) ||
      "豆包 Seedream 4.0 / 即梦图片生成";

    items.push(
      doubaoImageItem({
        id: stableId("github-doubao-compatible", section.title),
        title: `豆包适配｜${section.title}`,
        source: `豆包P图生图 ${formatStars(SOURCES.aiImagePrompts.stars)}★ · dongyubin/awesome-ai-images-prompts`,
        sourceTag: isImageEditPrompt(section.title, prompt) ? "P图/图生图" : "Seedream适配",
        favorite: items.length < 8,
        imageUrl: localImage,
        content: `参考模型：${model}\n适配方向：豆包 Seedream 4.0 / 即梦图片生成 / 主流生图模型\n\n${prompt}`,
      }),
    );
  }

  return items;
}

function doubaoImageItem({ id, title, source, sourceTag, favorite, imageUrl, content }) {
  return {
    id,
    title,
    category: "豆包P图生图·GitHub",
    type: "图像",
    tags: ["GitHub", "豆包", "Seedream", "P图生图", sourceTag],
    favorite,
    imageUrl,
    source,
    createdAt: "2026-05-21T00:00:00.000Z",
    updatedAt: "2026-05-21T00:00:00.000Z",
    content,
  };
}

function sectionBetween(markdown, startHeading, endHeading) {
  const start = markdown.indexOf(startHeading);
  if (start < 0) return "";
  const end = markdown.indexOf(endHeading, start + startHeading.length);
  return markdown.slice(start, end < 0 ? markdown.length : end);
}

function splitHeadingSections(markdown, headingRegex) {
  const matches = [...markdown.matchAll(headingRegex)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    return {
      title: clean(match[1]).replace(/\*\*/g, ""),
      body: markdown.slice(start, end),
    };
  });
}

function extractFirstFence(markdown) {
  const match = markdown.match(/```[^\n]*\n([\s\S]*?)```|~~~[^\n]*\n([\s\S]*?)~~~/);
  return clean(match?.[1] || match?.[2]);
}

function extractFirstMarkdownImage(markdown) {
  const match = markdown.match(/!\[[^\]]*]\(([^)]+)\)/);
  return clean(match?.[1]);
}

function isImageEditPrompt(title, prompt) {
  return /P图|图生图|图片变|修复|老照片|参考图|输入图|上传|edit|image-to-image|上色|换|变|去除/i.test(`${title}\n${prompt}`);
}

async function importHunyuanVideoPrompts() {
  const markdown = await fetchText(SOURCES.hunyuanVideo15.data);
  const pairs = extractHunyuanVideoPairs(markdown).slice(0, SOURCES.hunyuanVideo15.limit);
  const items = [];

  for (const [index, pair] of pairs.entries()) {
    if (!pair.prompt || !pair.video || BLOCKLIST.test(pair.prompt)) continue;
    const localVideo = await downloadEffectVideo(pair.video, stableId("hunyuan-video", `${index}-${pair.prompt.slice(0, 72)}`));
    if (!localVideo) continue;

    items.push(
      videoItem({
        id: stableId("github-video-hunyuan", `${index}-${pair.prompt.slice(0, 96)}`),
        title: `HunyuanVideo 1.5｜${titleFromPrompt(pair.prompt, index)}`,
        source: `视频制作高赞 ${formatStars(SOURCES.hunyuanVideo15.stars)}★ · Tencent-Hunyuan/HunyuanVideo-1.5`,
        sourceTag: "HunyuanVideo 1.5",
        favorite: index < 8,
        content: pair.prompt,
        imageUrl: localVideo,
      }),
    );
  }

  return items;
}

function extractHunyuanVideoPairs(markdown) {
  const pairRegex =
    /<video\s+src="([^"]+)"[\s\S]*?<summary>📋 Show input prompt<\/summary>\s*```([\s\S]*?)```/g;
  return [...markdown.matchAll(pairRegex)].map((match) => ({
    video: clean(match[1]),
    prompt: clean(match[2]),
  }));
}

async function importSeedanceVideoPrompts() {
  const markdown = await fetchText(SOURCES.seedanceVideo.data);
  const sections = splitSeedanceVideoSections(markdown);
  const items = [];

  for (const section of sections) {
    const prompt = extractSeedancePrompt(section.body);
    const video = extractFirstVideo(section.body);
    if (!prompt || !video || BLOCKLIST.test(`${section.title}\n${prompt}`)) continue;

    const localVideo = await downloadEffectVideo(video, stableId("seedance-video", section.title));
    if (!localVideo) continue;

    items.push(
      videoItem({
        id: stableId("github-video-seedance", section.title),
        title: `Seedance｜${section.title}`,
        source: `视频制作高赞 ${formatStars(SOURCES.seedanceVideo.stars)}★ · YouMind-OpenLab/awesome-seedance-2-prompts`,
        sourceTag: "Seedance 2.0",
        favorite: items.length < 5,
        content: prompt,
        imageUrl: localVideo,
      }),
    );
  }

  return items;
}

async function importVeoVideoPrompt() {
  const markdown = await fetchText(SOURCES.veoVideoApi.data);
  const prompt =
    clean(markdown.match(/\*\*🎯 Prompt Example:\*\*[\s\S]*?>\s*(.+)/)?.[1]) ||
    "Extreme close-up of an eye with a city reflected in it.";
  const localVideo = await downloadEffectVideo(SOURCES.veoVideoApi.video, "veo3-eye-city-reflection");
  if (!localVideo) return [];

  return [
    videoItem({
      id: stableId("github-video-veo3", prompt),
      title: "Veo 3｜城市倒影眼睛特写",
      source: `视频制作高赞 ${formatStars(SOURCES.veoVideoApi.stars)}★ · GeminiGenAI/Veo3-AI-Video-API`,
      sourceTag: "Veo 3",
      favorite: true,
      content: `${prompt}\n\nSettings: Veo 3, 16:9, 1080p.`,
      imageUrl: localVideo,
    }),
  ];
}

async function importSoraVideoPrompt() {
  const markdown = await fetchText(SOURCES.soraVideoGenerator.data);
  const prompt =
    clean(markdown.match(/\*\*Prompt used:\*\*[\s\S]*?>\s*(.+)/)?.[1]) ||
    "A majestic tiger strides through a lush jungle, its orange fur glowing under dappled sunlight, piercing amber eyes scanning the vibrant greenery.";
  const localVideo = await downloadEffectVideo(SOURCES.soraVideoGenerator.videos[0], "sora-tiger-jungle");
  if (!localVideo) return [];

  return [
    videoItem({
      id: stableId("github-video-sora", prompt),
      title: "Sora｜雨林老虎电影镜头",
      source: `视频制作高赞 ${formatStars(SOURCES.soraVideoGenerator.stars)}★ · easonlai/video_generator_with_sora`,
      sourceTag: "Sora",
      favorite: false,
      content: prompt,
      imageUrl: localVideo,
    }),
  ];
}

async function importText2VideoScratchPrompts() {
  const markdown = await fetchText(SOURCES.text2VideoScratch.data);
  const promptPairs = [
    ...markdown.matchAll(/Prompt:\s*\*\*([^*]+?)\*\*[\s\S]*?<img\s+src="([^"]+\.(?:gif|mp4|webm))"/gi),
  ];
  const items = [];

  for (const [index, match] of promptPairs.entries()) {
    const title = clean(match[1]).replace(/\s*-\s*\d+K Training Steps/i, "");
    const video = new URL(match[2], SOURCES.text2VideoScratch.rawBase).toString();
    const localVideo = await downloadEffectVideo(video, stableId("scratch-video", title));
    if (!title || !localVideo) continue;

    items.push(
      videoItem({
        id: stableId("github-video-scratch", `${title}-${index}`),
        title: `Text2Video｜${title}`,
        source: `视频制作高赞 ${formatStars(SOURCES.text2VideoScratch.stars)}★ · FareedKhan-dev/text2video-from-scratch`,
        sourceTag: "Text2Video",
        favorite: false,
        content: `${title}\n\nUse this concise text-to-video prompt to test subject motion, temporal consistency, and scene coherence.`,
        imageUrl: localVideo,
      }),
    );
  }

  return items;
}

function splitSeedanceVideoSections(markdown) {
  const headingRegex = /^### No\.\s*\d+:\s*(.+)$/gm;
  const matches = [...markdown.matchAll(headingRegex)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    return {
      title: clean(match[1]),
      body: markdown.slice(start, end),
    };
  });
}

function extractSeedancePrompt(section) {
  const codeBlock = section.match(/#### 📝 Prompt[\s\S]*?```[^\n]*\n([\s\S]*?)```/);
  const looseBlock = section.match(/#### 📝 Prompt\s*\n([\s\S]*?)(?=\n#### 🎬 Video|\n#### 📌 Details|\n### No\.|$)/);
  return cleanVideoPrompt(codeBlock?.[1] || looseBlock?.[1]);
}

function extractFirstVideo(section) {
  const match = section.match(/https?:\/\/[^\s)>'"]+\.mp4(?:[?#][^\s)>'"]*)?/i);
  return clean(match?.[0]);
}

function cleanVideoPrompt(value) {
  return clean(
    value
      ?.replace(/<a[\s\S]*$/i, "")
      .replace(/!\[[^\]]*]\([^)]+\)/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n"),
  );
}

function videoItem({ id, title, source, sourceTag, favorite, content, imageUrl }) {
  return {
    id,
    title: `视频制作｜${title}`,
    category: "视频制作高赞·GitHub",
    type: "视频",
    tags: ["GitHub", "视频制作", "效果视频", "高星", sourceTag],
    favorite,
    imageUrl,
    source,
    createdAt: "2026-05-21T00:00:00.000Z",
    updatedAt: "2026-05-21T00:00:00.000Z",
    content,
  };
}

function splitYouMindSections(markdown) {
  const headingRegex = /^### No\. \d+:\s*(.+)$/gm;
  const matches = [...markdown.matchAll(headingRegex)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    return {
      title: clean(match[1]),
      body: markdown.slice(start, end),
    };
  });
}

function extractFirstCodeBlock(section) {
  const match = section.match(/#### 📝 提示词[\s\S]*?```[^\n]*\n([\s\S]*?)```/);
  return clean(match?.[1]);
}

function extractFirstImage(section) {
  const match = section.match(/<img\s+src="([^"]+)"/);
  return clean(match?.[1]);
}

async function downloadEffectImage(url, name) {
  try {
    const extension = extensionFromUrl(url, "");
    const fileName = `${name}${extension}`;
    const fileUrl = new URL(fileName, IMAGE_DIR);
    if (await fileExists(fileUrl)) return `assets/github-effects/${fileName}`;
    const response = await fetchWithTimeout(url, {}, 24000);
    if (!response.ok) return "";
    const bytes = new Uint8Array(await response.arrayBuffer());
    await writeFile(fileUrl, bytes);
    return `assets/github-effects/${fileName}`;
  } catch {
    return "";
  }
}

async function downloadDoubaoImage(url, name) {
  try {
    const extension = extensionFromUrl(url, "");
    const fileName = `${name}${extension}`;
    const fileUrl = new URL(fileName, DOUBAO_IMAGE_DIR);
    if (await fileExists(fileUrl)) return `assets/github-doubao/${fileName}`;
    const response = await fetchWithTimeout(url, { redirect: "follow", headers: { "User-Agent": "codex-prompt-import" } }, 24000);
    if (!response.ok) return "";
    const bytes = new Uint8Array(await response.arrayBuffer());
    await writeFile(fileUrl, bytes);
    return `assets/github-doubao/${fileName}`;
  } catch {
    return "";
  }
}

async function downloadEffectVideo(url, name) {
  try {
    const extension = videoExtensionFromUrl(url, "");
    const fileName = `${name}${extension}`;
    const fileUrl = new URL(fileName, VIDEO_DIR);
    if (await fileExists(fileUrl)) return `assets/github-videos/${fileName}`;
    const response = await fetchWithTimeout(url, { redirect: "follow", headers: { "User-Agent": "codex-prompt-import" } }, 45000);
    if (!response.ok) return "";
    const bytes = new Uint8Array(await response.arrayBuffer());
    await writeFile(fileUrl, bytes);
    return `assets/github-videos/${fileName}`;
  } catch {
    return "";
  }
}

function extensionFromUrl(url, contentType) {
  const parsed = new URL(url);
  const ext = extname(parsed.pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return ext;
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  return ".jpg";
}

function videoExtensionFromUrl(url, contentType) {
  const parsed = new URL(url);
  const ext = extname(parsed.pathname).toLowerCase();
  if ([".mp4", ".webm", ".mov", ".m4v", ".ogv", ".gif"].includes(ext)) return ext;
  if (contentType.includes("webm")) return ".webm";
  if (contentType.includes("gif")) return ".gif";
  if (contentType.includes("quicktime")) return ".mov";
  return ".mp4";
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, { headers: { "User-Agent": "codex-prompt-import" } }, 60000);
      if (response.ok) return response.text();
      lastError = new Error(`Failed to fetch ${url}: ${response.status}`);
    } catch (error) {
      lastError = new Error(`Failed to fetch ${url}: ${error.name || "Error"} ${error.message || error}`);
    }
    await sleep(800 * (attempt + 1));
  }
  throw lastError;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  return fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeoutMs),
  });
}

async function fileExists(fileUrl) {
  try {
    await access(fileUrl);
    return true;
  } catch {
    return false;
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((line) => line.some((value) => clean(value)));
}

function objectFromRow(headers, row) {
  return headers.reduce((acc, header, index) => {
    acc[header] = row[index] || "";
    return acc;
  }, {});
}

function categoryFromTitle(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  if (/developer|code|program|python|javascript|sql|terminal|linux|ethereum|contract|debug/.test(text)) {
    return "GitHub精选·开发";
  }
  if (/write|editor|blog|essay|copy|story|translator|grammar|poet|screenwriter/.test(text)) {
    return "GitHub精选·写作";
  }
  if (/marketing|sales|seo|social media|advertis|brand|startup|business/.test(text)) {
    return "GitHub精选·营销";
  }
  if (/teacher|tutor|student|learn|course|education|exam|ielts|math/.test(text)) {
    return "GitHub精选·学习";
  }
  if (/design|image|photo|midjourney|stable diffusion|visual|artist/.test(text)) {
    return "GitHub精选·图像";
  }
  if (/data|analyst|statistics|excel|research|paper/.test(text)) {
    return "GitHub精选·分析";
  }
  return "GitHub精选·通用";
}

function educationScore(title, content) {
  const titleText = title.toLowerCase();
  const bodyText = content.toLowerCase();
  let score = 0;

  score += countMatches(
    /\b(teacher|tutor|student|educator|professor|instructor|lecturer|coach|mentor|trainer)\b/g,
    titleText,
  ) * 10;
  score += countMatches(
    /\b(education|educational|teaching|learning|learner|learn|school|classroom|lesson|course|curriculum|syllabus|lecture|homework|assignment|exam|quiz|test|grade|rubric|study|academic|research|paper|thesis|journal|peer review|university|college)\b/g,
    titleText,
  ) * 8;
  score += countMatches(
    /\b(math|mathematics|science|physics|chemistry|biology|history|grammar|language|vocabulary|english|ielts|toefl|kanji|literature|philosophy|socratic|critical thinking|worksheet|concept|knowledge)\b/g,
    titleText,
  ) * 6;
  score += countMatches(
    /\b(teacher|tutor|student|educator|professor|instructor|teaching|learning|lesson|course|curriculum|exam|quiz|rubric|academic|research|school|classroom|study|homework|assignment|knowledge|concept)\b/g,
    bodyText,
  ) * 2;
  score += countMatches(
    /\b(explain|explanation|evaluate|assess|feedback|practice|personalized|guide|step-by-step|beginner|advanced|understand)\b/g,
    bodyText,
  );
  score -= countMatches(
    /\b(marketing|sales|seo|brand|startup|business|finance|trading|crypto|contract|image|photo|portrait|midjourney|stable diffusion|code|python|javascript|sql|linux|terminal|developer|debug|recipe|travel|fashion|interior|dating|fitness|real estate)\b/g,
    titleText,
  ) * 8;
  score -= countMatches(
    /\b(marketing|sales|seo|brand|startup|finance|trading|crypto|contract|image|photo|portrait|midjourney|stable diffusion|code|python|javascript|sql|linux|terminal|developer|debug)\b/g,
    bodyText,
  );

  return score;
}

function isEducationCandidate(title, content, score) {
  const bodyText = content.toLowerCase();
  const bodySignals = countMatches(
    /\b(teacher|tutor|student|educator|professor|instructor|teaching|learning|lesson|course|curriculum|exam|quiz|rubric|academic|research|school|classroom|study|homework|assignment|knowledge|concept|explain|practice|feedback|assess|evaluate|beginner|understand)\b/g,
    bodyText,
  );
  const hasTitleSignal =
    /teacher|tutor|student|educator|professor|instructor|lecturer|mentor|education|educational|teaching|learning|learner|learn|school|classroom|lesson|course|curriculum|syllabus|lecture|homework|assignment|exam|quiz|test|grade|rubric|study|academic|research|paper|thesis|journal|peer review|university|college|math|mathematics|science|physics|chemistry|biology|history|grammar|language|vocabulary|english|ielts|toefl|kanji|literature|philosophy|socratic|critical thinking|worksheet|concept|knowledge/i.test(
      title,
    );
  const hasOffTopicTitle =
    /shooter|dogfight|combat|investment|stock market|finance|trading|crypto|marketing|sales|seo|brand|startup|business|real estate|customer support|recipe|fashion|interior|dating|fitness|game|movie|film|song|music|blender|3d|logo|photo|image|portrait|raycast|vector-based/i.test(
      title,
    );

  if (hasTitleSignal) return score >= 1;
  if (score >= 4 && bodySignals >= 2) return true;
  return score >= 2 && bodySignals >= 3 && !hasOffTopicTitle;
}

function countMatches(pattern, text) {
  return (text.match(pattern) || []).length;
}

function categoryFromYouMindTitle(title) {
  const prefix = title.split(" - ")[0]?.trim();
  if (prefix && prefix.length <= 24 && prefix !== title) return `效果图·${prefix}`;
  return "效果图·图像提示词";
}

function titleFromPath(path) {
  const fileName = path.split("/").pop() || path;
  return clean(
    fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " "),
  );
}

function cleanMarkdownPrompt(markdown) {
  return clean(
    markdown
      .replace(/!\[[^\]]*]\([^)]+\)/g, "")
      .replace(/\[[^\]]+]\([^)]+\)/g, (match) => match.match(/^\[([^\]]+)]/)?.[1] || "")
      .replace(/^#+\s+/gm, "")
      .replace(/^\s*[-*]\s+/gm, "- ")
      .replace(/\n{3,}/g, "\n\n"),
  );
}

function extractMarkdownCodePrompts(markdown) {
  const codeBlock = /```[^\n]*\n([\s\S]*?)```/g;
  const prompts = [];
  let match;
  while ((match = codeBlock.exec(markdown))) {
    const content = clean(match[1]);
    if (!content || content.length < 20) continue;
    prompts.push({
      heading: headingBefore(markdown, match.index),
      content,
    });
  }
  return prompts;
}

function headingBefore(markdown, position) {
  const headings = [...markdown.slice(0, position).matchAll(/^#{2,4}\s+(.+)$/gm)];
  return clean(headings.at(-1)?.[1]).replace(/[*_`]/g, "") || "Academic Writing";
}

function titleFromPrompt(prompt, index) {
  const firstLine = clean(prompt.split(/\n/).find(Boolean) || prompt)
    .replace(/\[[^\]]+]/g, "")
    .replace(/\s+/g, " ");
  const sentence = firstLine.split(/[.?!:：。？！]/)[0] || firstLine;
  const words = sentence.split(/\s+/).slice(0, 9).join(" ");
  return clean(words).slice(0, 72) || `Academic Prompt ${index + 1}`;
}

function parseEducationSkill(markdown, path) {
  const frontMatter = markdown.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  const skillName = frontMatterField(frontMatter, "skill_name") || titleFromPath(path.replace(/\/SKILL\.md$/i, ""));
  const description = frontMatterField(frontMatter, "description");
  const domain = frontMatterField(frontMatter, "domain") || path.split("/")[1] || "education";
  const whatItDoes = sectionText(markdown, "What This Skill Does");
  const evidence = sectionText(markdown, "Evidence Foundation");
  const inputSchema = sectionText(markdown, "Input Schema");
  const outputSchema = sectionText(markdown, "Output Schema");

  const content = clean(`
Act as an evidence-based education assistant using the "${skillName}" workflow.

Purpose:
${description || whatItDoes}

Educational context:
- Domain: ${domain}
- Ask for missing grade level, subject, learner profile, learning goal, constraints, or available materials before producing the final output.
- If enough context is provided, ask no more than 3 clarifying questions and then deliver a classroom-ready result.

Workflow basis:
${whatItDoes}

Input guidance:
${inputSchema}

Expected output:
${outputSchema}

Evidence notes:
${evidence}
`);

  return {
    title: `${toTitleCase(skillName)}｜${domain}`,
    content,
  };
}

function frontMatterField(frontMatter, field) {
  const quoted = new RegExp(`^${field}:\\s*"([^"]+)"`, "m").exec(frontMatter)?.[1];
  if (quoted) return clean(quoted);
  return clean(new RegExp(`^${field}:\\s*(.+)$`, "m").exec(frontMatter)?.[1]);
}

function sectionText(markdown, heading) {
  const pattern = new RegExp(`^## ${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n---|$)`, "m");
  return clean(pattern.exec(markdown)?.[1]).slice(0, 1600);
}

function toTitleCase(value) {
  return clean(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.title}\n${item.content.slice(0, 160)}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeByContent(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = clean(item.content).slice(0, 240).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stableId(prefix, value) {
  let hash = 2166136261;
  for (const char of clean(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}

function formatStars(stars) {
  return stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : String(stars);
}

function clean(value) {
  return String(value ?? "").trim();
}

function compact(values) {
  return values.filter(Boolean);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
