import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { homedir } from "node:os";

const ROOT = new URL("../", import.meta.url);
const DATA_FILE = new URL("github-prompts.js", ROOT);
const HOME = homedir();

const SKILL_ROOTS = [
  join(HOME, ".codex/skills"),
  join(HOME, ".cc-switch/skills"),
  join(HOME, ".codex/plugins/cache"),
];

const SKIP_PATH = /\/dogfood\/|\/assets\/|\/scripts\/|\/references\//i;

async function main() {
  const raw = await readFile(DATA_FILE, "utf8");
  const pack = JSON.parse(raw.match(/window\.GITHUB_PROMPT_PACK\s*=\s*([\s\S]*);\s*$/)?.[1]);
  const skills = await collectSkills();

  pack.version = "github-stars-2026-05-27-local-skills-v1";
  pack.generatedAt = new Date().toISOString();
  pack.replaceSourcePrefixes = Array.from(new Set([...(pack.replaceSourcePrefixes || []), "AI技能精选"]));
  pack.prompts = [
    ...pack.prompts.filter((item) => !String(item.source || "").startsWith("AI技能精选")),
    ...skills,
  ];

  await writeFile(DATA_FILE, `window.GITHUB_PROMPT_PACK = ${JSON.stringify(pack, null, 2)};\n`, "utf8");

  const bySource = skills.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify({ added: skills.length, total: pack.prompts.length, siteTotal: pack.prompts.length + 420, bySource }, null, 2));
}

async function collectSkills() {
  const paths = [];
  for (const root of SKILL_ROOTS) {
    paths.push(...(await findSkillFiles(root)));
  }

  const seen = new Set();
  const items = [];

  for (const path of paths.sort()) {
    if (SKIP_PATH.test(path)) continue;
    const raw = await readFile(path, "utf8");
    const frontMatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
    const inferred = basename(path.replace(/\/SKILL\.md$/i, ""));
    const name = clean(frontMatterField(frontMatter, "name") || frontMatterField(frontMatter, "skill_name") || inferred);
    const description = clean(frontMatterField(frontMatter, "description") || firstParagraph(raw));
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());

    const body = clean(raw.replace(/^---\n[\s\S]*?\n---\n/, ""));
    items.push({
      id: stableId("local-skill", `${name}-${path}`),
      title: `Skill｜${displayName(name)}`,
      category: "AI技能·Skill",
      type: "工作流",
      tags: ["Skill", "AI技能", sourceTag(path), domainTag(name, description, body)],
      favorite: items.length < 12,
      imageUrl: "",
      source: `AI技能精选 · ${sourceTag(path)}`,
      createdAt: "2026-05-27T00:00:00.000Z",
      updatedAt: "2026-05-27T00:00:00.000Z",
      content: clean(`Skill name: ${name}
Description: ${description}
Source path: ${path.replace(HOME, "~")}

${body}`),
    });
  }

  return items;
}

async function findSkillFiles(root) {
  try {
    const entries = await readdir(root, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = join(root, entry.name);
      if (entry.isDirectory()) files.push(...(await findSkillFiles(fullPath)));
      if (entry.isFile() && entry.name === "SKILL.md") files.push(fullPath);
    }
    return files;
  } catch {
    return [];
  }
}

function frontMatterField(frontMatter, field) {
  const quoted = new RegExp(`^${field}:\\s*"([^"]+)"`, "m").exec(frontMatter)?.[1];
  if (quoted) return quoted;
  return new RegExp(`^${field}:\\s*(.+)$`, "m").exec(frontMatter)?.[1];
}

function firstParagraph(markdown) {
  return clean(markdown.replace(/^---\n[\s\S]*?\n---\n/, "").split(/\n{2,}/).find((part) => clean(part).length > 20));
}

function sourceTag(path) {
  if (path.includes("/.codex/plugins/cache/openai-primary-runtime/")) return "OpenAI文档插件";
  if (path.includes("/.codex/plugins/cache/openai-bundled/")) return "OpenAI工具插件";
  if (path.includes("/.codex/plugins/cache/openai-curated/")) return "OpenAI连接器";
  if (path.includes("/.codex/skills/.system/")) return "Codex系统";
  if (path.includes("/.cc-switch/skills/")) return "CC Switch";
  if (path.includes("/.codex/skills/")) return "Codex本地";
  return "本地";
}

function domainTag(name, description, body) {
  const text = `${name}\n${description}\n${body}`.toLowerCase();
  if (/paper|academic|research|literature|manuscript|论文|科研|文献/.test(text)) return "科研";
  if (/ppt|presentation|slides|deck|演示|汇报/.test(text)) return "演示";
  if (/docx|document|word|docs|文档/.test(text)) return "文档";
  if (/spreadsheet|excel|sheet|表格/.test(text)) return "表格";
  if (/browser|chrome|computer|automation|terminal/.test(text)) return "工具";
  if (/image|figure|draw|diagram|flowchart|图片|图/.test(text)) return "视觉";
  if (/gmail|email|mail/.test(text)) return "邮件";
  if (/video|hyperframes|animation/.test(text)) return "视频";
  return "工作流";
}

function stableId(prefix, value) {
  let hash = 2166136261;
  for (const char of clean(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}

function displayName(value) {
  return clean(value).replace(/[-_]+/g, " ").replace(/\s+/g, " ");
}

function clean(value) {
  return String(value ?? "").trim();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
