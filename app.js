(() => {
  const STORAGE_KEY = "ai-prompt-library-v1";
  const ALL_CATEGORY = "__all__";
  const MEDIA_CATEGORY = "__media__";
  const UNCATEGORIZED = "未分类";

  const seedCategories = [
    "写作润色",
    "营销增长",
    "产品运营",
    "设计创意",
    "摄影影像",
    "插画绘画",
    "代码开发",
    "数据分析",
    "科研学习",
    "教育培训",
    "商业策略",
    "团队协作",
    "社媒内容",
    "视频脚本",
    "个人效率",
  ];

  const seedTasks = [
    "整理核心需求",
    "创建结构化大纲",
    "生成行动清单",
    "做反向提问",
    "制定质量检查表",
    "输出多版本方案",
    "优化标题命名",
    "模拟专家评审",
    "拆解用户画像",
    "编写冷启动流程",
    "转换为表格",
    "提炼关键洞察",
    "改写为自然语气",
    "扩展成完整方案",
    "压缩成一页摘要",
    "生成常见问答",
    "设计AB测试",
    "规划30天执行",
    "找出风险假设",
    "建立评分标准",
    "产出中英双语版本",
    "生成可复用模板",
    "创建案例库",
    "梳理竞品差异",
    "设计提示词变量",
    "输出会议材料",
    "生成复盘报告",
    "制作交付清单",
  ];

  const roleByCategory = {
    写作润色: "资深编辑和内容策略顾问",
    营销增长: "增长营销负责人",
    产品运营: "产品运营专家",
    设计创意: "品牌设计总监",
    摄影影像: "商业摄影指导",
    插画绘画: "视觉艺术指导",
    代码开发: "高级软件工程师",
    数据分析: "数据分析负责人",
    科研学习: "研究方法导师",
    教育培训: "课程设计专家",
    商业策略: "管理咨询顾问",
    团队协作: "组织效率教练",
    社媒内容: "社交媒体主编",
    视频脚本: "短视频策划导演",
    个人效率: "个人效率教练",
  };

  const state = {
    prompts: [],
    categories: [],
    selectedCategory: ALL_CATEGORY,
    filter: "all",
    sort: "updated",
    search: "",
    selectedIds: new Set(),
    activePromptId: null,
    githubPackVersion: null,
    theme: "light",
  };

  const els = {};
  let toastTimer = null;
  let saveTimer = null;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    loadState();
    const importedGithubPack = mergeGithubPromptPack();
    if (importedGithubPack) persist();
    applyTheme();
    bindEvents();
    renderAll();
  }

  function cacheElements() {
    Object.assign(els, {
      searchInput: document.querySelector("#searchInput"),
      categoryList: document.querySelector("#categoryList"),
      allCount: document.querySelector("#allCount"),
      mediaCount: document.querySelector("#mediaCount"),
      addCategoryBtn: document.querySelector("#addCategoryBtn"),
      renameCategoryBtn: document.querySelector("#renameCategoryBtn"),
      removeCategoryBtn: document.querySelector("#removeCategoryBtn"),
      exportBtn: document.querySelector("#exportBtn"),
      importFileBtn: document.querySelector("#importFileBtn"),
      fileImportPanelBtn: document.querySelector("#fileImportPanelBtn"),
      fileInput: document.querySelector("#fileInput"),
      restoreSeedBtn: document.querySelector("#restoreSeedBtn"),
      pageTitle: document.querySelector("#pageTitle"),
      themeToggle: document.querySelector("#themeToggle"),
      applyToolBtn: document.querySelector("#applyToolBtn"),
      importToolBtn: document.querySelector("#importToolBtn"),
      newPromptBtn: document.querySelector("#newPromptBtn"),
      toolDrawer: document.querySelector("#toolDrawer"),
      drawerBackdrop: document.querySelector("#drawerBackdrop"),
      closeDrawerBtn: document.querySelector("#closeDrawerBtn"),
      statPrompts: document.querySelector("#statPrompts"),
      statCategories: document.querySelector("#statCategories"),
      statFavorites: document.querySelector("#statFavorites"),
      statVisible: document.querySelector("#statVisible"),
      sortSelect: document.querySelector("#sortSelect"),
      batchBar: document.querySelector("#batchBar"),
      selectionText: document.querySelector("#selectionText"),
      selectVisibleBtn: document.querySelector("#selectVisibleBtn"),
      clearSelectionBtn: document.querySelector("#clearSelectionBtn"),
      deleteSelectedBtn: document.querySelector("#deleteSelectedBtn"),
      promptGrid: document.querySelector("#promptGrid"),
      editorTitle: document.querySelector("#editorTitle"),
      saveState: document.querySelector("#saveState"),
      promptForm: document.querySelector("#promptForm"),
      promptTitle: document.querySelector("#promptTitle"),
      promptCategory: document.querySelector("#promptCategory"),
      promptType: document.querySelector("#promptType"),
      promptTags: document.querySelector("#promptTags"),
      promptImage: document.querySelector("#promptImage"),
      promptContent: document.querySelector("#promptContent"),
      categoryOptions: document.querySelector("#categoryOptions"),
      imagePreview: document.querySelector("#imagePreview"),
      previewImage: document.querySelector("#previewImage"),
      previewVideo: document.querySelector("#previewVideo"),
      previewCaption: document.querySelector("#previewCaption"),
      savePromptBtn: document.querySelector("#savePromptBtn"),
      copyPromptBtn: document.querySelector("#copyPromptBtn"),
      deletePromptBtn: document.querySelector("#deletePromptBtn"),
      selectedPromptSummary: document.querySelector("#selectedPromptSummary"),
      taskContext: document.querySelector("#taskContext"),
      toneSelect: document.querySelector("#toneSelect"),
      formatSelect: document.querySelector("#formatSelect"),
      extraRules: document.querySelector("#extraRules"),
      composedPrompt: document.querySelector("#composedPrompt"),
      copyComposedBtn: document.querySelector("#copyComposedBtn"),
      copyOriginalBtn: document.querySelector("#copyOriginalBtn"),
      pasteBox: document.querySelector("#pasteBox"),
      pasteCategory: document.querySelector("#pasteCategory"),
      pasteImportBtn: document.querySelector("#pasteImportBtn"),
      remoteImageTitle: document.querySelector("#remoteImageTitle"),
      remoteImageUrl: document.querySelector("#remoteImageUrl"),
      addRemoteImageBtn: document.querySelector("#addRemoteImageBtn"),
      toast: document.querySelector("#toast"),
    });
  }

  function bindEvents() {
    els.searchInput.addEventListener("input", () => {
      state.search = els.searchInput.value.trim();
      state.selectedIds.clear();
      renderListArea();
    });

    document.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => setCategory(button.dataset.category));
    });

    els.categoryList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (button) setCategory(button.dataset.category);
    });

    els.addCategoryBtn.addEventListener("click", addCategory);
    els.renameCategoryBtn.addEventListener("click", renameCategory);
    els.removeCategoryBtn.addEventListener("click", removeCategory);
    els.exportBtn.addEventListener("click", exportMasterFile);
    els.importFileBtn.addEventListener("click", () => els.fileInput.click());
    els.fileImportPanelBtn.addEventListener("click", () => els.fileInput.click());
    els.fileInput.addEventListener("change", handleFileInput);
    els.restoreSeedBtn.addEventListener("click", restoreSeedPrompts);
    els.themeToggle.addEventListener("click", toggleTheme);
    els.applyToolBtn.addEventListener("click", () => activatePanel("apply"));
    els.importToolBtn.addEventListener("click", () => activatePanel("import"));
    els.newPromptBtn.addEventListener("click", () => startNewPrompt());
    els.closeDrawerBtn.addEventListener("click", closeDrawer);
    els.drawerBackdrop.addEventListener("click", closeDrawer);

    document.querySelectorAll(".segmented [data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        state.selectedIds.clear();
        document.querySelectorAll(".segmented [data-filter]").forEach((item) => {
          item.classList.toggle("active", item === button);
        });
        renderListArea();
      });
    });

    els.sortSelect.addEventListener("change", () => {
      state.sort = els.sortSelect.value;
      renderListArea();
    });

    els.selectVisibleBtn.addEventListener("click", () => {
      getVisiblePrompts().forEach((item) => state.selectedIds.add(item.id));
      renderListArea();
    });

    els.clearSelectionBtn.addEventListener("click", () => {
      state.selectedIds.clear();
      renderListArea();
    });

    els.deleteSelectedBtn.addEventListener("click", deleteSelectedPrompts);

    els.promptForm.addEventListener("submit", (event) => {
      event.preventDefault();
      savePromptFromForm();
    });

    ["input", "change"].forEach((eventName) => {
      [
        els.promptTitle,
        els.promptCategory,
        els.promptType,
        els.promptTags,
        els.promptImage,
        els.promptContent,
      ].forEach((input) => {
        input.addEventListener(eventName, handleEditorInput);
      });
    });

    els.promptCategory.addEventListener("blur", () => {
      const category = cleanText(els.promptCategory.value);
      if (category) addCategoryName(category);
      persistAndRender({ skipEditor: true });
    });

    els.copyPromptBtn.addEventListener("click", () => {
      const item = getActivePrompt();
      copyText(item ? item.content : els.promptContent.value, "提示词已复制");
    });

    els.deletePromptBtn.addEventListener("click", deleteActivePrompt);

    document.querySelectorAll(".panel-tabs [data-panel]").forEach((button) => {
      button.addEventListener("click", () => activatePanel(button.dataset.panel));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && els.toolDrawer.classList.contains("open")) {
        closeDrawer();
      }
    });

    [els.taskContext, els.toneSelect, els.formatSelect, els.extraRules].forEach((input) => {
      input.addEventListener("input", renderApplyPanel);
      input.addEventListener("change", renderApplyPanel);
    });

    els.copyComposedBtn.addEventListener("click", () => {
      copyText(els.composedPrompt.value, "组合提示词已复制");
    });

    els.copyOriginalBtn.addEventListener("click", () => {
      const item = getActivePrompt();
      copyText(item ? item.content : "", "原模板已复制");
    });

    els.pasteImportBtn.addEventListener("click", importFromPaste);
    els.addRemoteImageBtn.addEventListener("click", addRemoteImage);
  }

  function loadState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaults = createDefaultData();
      Object.assign(state, defaults);
      state.selectedIds = new Set();
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      state.prompts = Array.isArray(parsed.prompts)
        ? parsed.prompts.map(normalizePrompt).filter((item) => item.title && item.content)
        : [];
      state.categories = normalizeCategories(parsed.categories, state.prompts);
      state.theme = parsed.theme || preferredTheme();
      state.githubPackVersion = parsed.githubPackVersion || null;
    } catch {
      const defaults = createDefaultData();
      Object.assign(state, defaults);
      state.selectedIds = new Set();
    }

    if (!state.prompts.length) {
      const defaults = createDefaultData();
      Object.assign(state, defaults);
      state.selectedIds = new Set();
    }

    state.activePromptId = state.prompts[0]?.id || null;
    state.selectedCategory = ALL_CATEGORY;
    state.filter = "all";
    state.sort = "updated";
    state.search = "";
    state.selectedIds = new Set();
  }

  function createDefaultData() {
    const prompts = createSeedPrompts();
    return {
      prompts,
      categories: normalizeCategories([...seedCategories, "素材管理", "团队工作流"], prompts),
      selectedCategory: ALL_CATEGORY,
      filter: "all",
      sort: "updated",
      search: "",
      selectedIds: new Set(),
      activePromptId: prompts[0]?.id || null,
      githubPackVersion: null,
      theme: preferredTheme(),
    };
  }

  function mergeGithubPromptPack() {
    const pack = window.GITHUB_PROMPT_PACK;
    if (!pack?.prompts?.length || state.githubPackVersion === pack.version) return false;

    let imported = 0;

    if (Array.isArray(pack.replaceSourcePrefixes)) {
      state.prompts = state.prompts.filter((item) => {
        const source = String(item.source || "");
        return !pack.replaceSourcePrefixes.some((prefix) => source.startsWith(prefix));
      });
    }

    const existingIds = new Set(state.prompts.map((item) => item.id));

    pack.prompts.map(normalizePrompt).forEach((item) => {
      if (!item.title || !item.content || existingIds.has(item.id)) return;
      state.prompts.push(item);
      existingIds.add(item.id);
      addCategoryName(item.category);
      imported += 1;
    });

    state.githubPackVersion = pack.version || "unknown";
    if (!state.activePromptId) state.activePromptId = state.prompts[0]?.id || null;
    return imported > 0 || true;
  }

  function preferredTheme() {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function createSeedPrompts() {
    const prompts = [];
    const baseTime = Date.now() - 1000 * 60 * 60 * 24 * 60;

    seedCategories.forEach((category, categoryIndex) => {
      seedTasks.forEach((task, taskIndex) => {
        const type = inferType(category);
        const title = `${category}｜${task}`;
        const role = roleByCategory[category] || "资深AI提示词专家";
        const deliverable = deliveryLine(category, task);
        const tags = seedTags(category, task);
        const createdAt = new Date(baseTime + prompts.length * 1000 * 60 * 7).toISOString();

        prompts.push({
          id: `seed-${categoryIndex + 1}-${taskIndex + 1}`,
          title,
          category,
          type,
          tags,
          favorite: taskIndex < 2,
          imageUrl: "",
          source: "内置精选",
          createdAt,
          updatedAt: createdAt,
          content: [
            `你是一名${role}。请基于国际常用提示工程范式，围绕「{主题或目标}」完成：${task}。`,
            "",
            "请先用3-5个问题确认关键背景；如果信息不足，请列出合理假设并标注假设来源。",
            "",
            "输出结构：",
            `1. 目标拆解：说明最重要的判断标准。`,
            `2. 执行方案：给出可直接应用的步骤。`,
            `3. ${deliverable}`,
            "4. 质量检查：列出可验证的检查项、风险和下一步优化建议。",
            "",
            "约束：语言简洁，避免空泛口号；必要时使用表格；结果要适合复制到团队流程中复用。",
          ].join("\n"),
        });
      });
    });

    return prompts;
  }

  function deliveryLine(category, task) {
    if (category === "摄影影像") return "画面描述：包含主体、光线、镜头、构图、质感和负面提示。";
    if (category === "插画绘画") return "视觉规范：包含风格、色彩、构图、材质和可替换变量。";
    if (category === "代码开发") return "工程建议：包含实现思路、边界情况、测试点和可维护性说明。";
    if (category === "数据分析") return "分析结果：包含指标口径、洞察、异常解释和行动建议。";
    if (category === "团队协作") return "协作模板：包含负责人、时间线、交付物和同步机制。";
    if (task.includes("表格")) return "表格字段：给出字段名、示例值和使用说明。";
    return "交付内容：给出3个可直接复制使用的版本。";
  }

  function seedTags(category, task) {
    const tags = [category.slice(0, 4), task.slice(0, 4)];
    if (["摄影影像", "插画绘画", "设计创意"].includes(category)) tags.push("视觉");
    if (["团队协作", "产品运营", "商业策略"].includes(category)) tags.push("工作流");
    if (["写作润色", "社媒内容", "营销增长"].includes(category)) tags.push("文案");
    return Array.from(new Set(tags));
  }

  function inferType(category) {
    if (/视频|影视|短片|Video/i.test(category)) return "视频";
    if (["摄影影像", "插画绘画", "设计创意"].includes(category)) return "图像";
    if (["团队协作", "产品运营", "商业策略", "个人效率"].includes(category)) return "工作流";
    return "文本";
  }

  function normalizePrompt(item) {
    const now = new Date().toISOString();
    const category = cleanText(item.category) || UNCATEGORIZED;
    const content = cleanText(item.content || item.prompt || item.text || item.body);
    const title = cleanText(item.title || item.name || content.split("\n")[0] || "未命名提示词");

    return {
      id: cleanText(item.id) || createId("prompt"),
      title: title.slice(0, 140),
      category,
      type: cleanText(item.type) || inferType(category),
      tags: normalizeTags(item.tags),
      favorite: Boolean(item.favorite),
      imageUrl: cleanText(item.videoUrl || item.mediaUrl || item.imageUrl || item.image || item.url),
      source: cleanText(item.source) || "自定义",
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now,
      content,
    };
  }

  function normalizeTags(tags) {
    if (Array.isArray(tags)) return tags.map(cleanText).filter(Boolean).slice(0, 8);
    return cleanText(tags)
      .split(/[,，、\s]+/)
      .map(cleanText)
      .filter(Boolean)
      .slice(0, 8);
  }

  function normalizeCategories(categories, prompts) {
    const names = Array.isArray(categories) ? categories.map(cleanText).filter(Boolean) : [];
    prompts.forEach((item) => {
      if (item.category) names.push(item.category);
    });
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  }

  function cleanText(value) {
    return String(value ?? "").trim();
  }

  function createId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        theme: state.theme,
        githubPackVersion: state.githubPackVersion,
        categories: state.categories,
        prompts: state.prompts,
      }),
    );
  }

  function persistAndRender(options = {}) {
    persist();
    renderAll(options);
  }

  function renderAll(options = {}) {
    renderCategoryOptions();
    renderCounts();
    renderCategories();
    renderListArea();
    if (!options.skipEditor) renderEditor();
    renderApplyPanel();
  }

  function renderListArea() {
    renderPageTitle();
    renderCounts();
    renderCategoryButtonsState();
    renderGrid();
    renderBatchBar();
  }

  function renderPageTitle() {
    const titleMap = {
      [ALL_CATEGORY]: "全部提示词",
      [MEDIA_CATEGORY]: "素材归档",
    };
    els.pageTitle.textContent = titleMap[state.selectedCategory] || state.selectedCategory;
  }

  function renderCounts() {
    const visibleCount = getVisiblePrompts().length;
    const mediaCount = state.prompts.filter(isMediaPrompt).length;
    const favoriteCount = state.prompts.filter((item) => item.favorite).length;

    els.allCount.textContent = state.prompts.length;
    els.mediaCount.textContent = mediaCount;
    els.statPrompts.textContent = state.prompts.length;
    els.statCategories.textContent = state.categories.length;
    els.statFavorites.textContent = favoriteCount;
    els.statVisible.textContent = visibleCount;
  }

  function renderCategories() {
    els.categoryList.innerHTML = "";
    const counts = new Map();
    state.prompts.forEach((item) => {
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    });

    state.categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "category-item";
      button.type = "button";
      button.dataset.category = category;
      button.classList.toggle("active", state.selectedCategory === category);

      const label = document.createElement("span");
      label.textContent = category;
      const count = document.createElement("strong");
      count.textContent = counts.get(category) || 0;

      button.append(label, count);
      els.categoryList.append(button);
    });

    renderCategoryButtonsState();
  }

  function renderCategoryButtonsState() {
    document.querySelectorAll("[data-category]").forEach((button) => {
      button.classList.toggle("active", button.dataset.category === state.selectedCategory);
    });
    const canEdit = ![ALL_CATEGORY, MEDIA_CATEGORY].includes(state.selectedCategory);
    els.renameCategoryBtn.disabled = !canEdit;
    els.removeCategoryBtn.disabled = !canEdit;
  }

  function renderCategoryOptions() {
    els.categoryOptions.innerHTML = "";
    state.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      els.categoryOptions.append(option);
    });
  }

  function renderGrid() {
    const prompts = getVisiblePrompts();
    els.promptGrid.innerHTML = "";

    if (!prompts.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = "<div><strong>没有匹配的提示词</strong><br />调整搜索、筛选，或新增一个模板。</div>";
      els.promptGrid.append(empty);
      return;
    }

    prompts.forEach((item) => {
      els.promptGrid.append(createPromptCard(item));
    });
  }

  function createPromptCard(item) {
    const card = document.createElement("article");
    card.className = "prompt-card";
    card.dataset.id = item.id;
    card.dataset.type = item.type;
    card.classList.toggle("active", item.id === state.activePromptId);

    const top = document.createElement("div");
    top.className = "card-top";

    const checkbox = document.createElement("input");
    checkbox.className = "card-check";
    checkbox.type = "checkbox";
    checkbox.checked = state.selectedIds.has(item.id);
    checkbox.title = "选择";
    checkbox.addEventListener("click", (event) => event.stopPropagation());
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) state.selectedIds.add(item.id);
      else state.selectedIds.delete(item.id);
      renderBatchBar();
    });

    const title = document.createElement("h3");
    title.className = "card-title";
    const titleText = document.createElement("span");
    titleText.textContent = item.title;
    title.append(titleText);

    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "favorite-button";
    favorite.classList.toggle("active", item.favorite);
    favorite.title = item.favorite ? "取消收藏" : "收藏";
    favorite.textContent = "★";
    favorite.addEventListener("click", (event) => {
      event.stopPropagation();
      item.favorite = !item.favorite;
      item.updatedAt = new Date().toISOString();
      persistAndRender({ skipEditor: true });
    });

    top.append(checkbox, title, favorite);

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.append(createPill(item.category), createPill(item.type), createPill(item.source));

    const preview = document.createElement("p");
    preview.className = "prompt-preview";
    preview.textContent = item.content;

    card.append(createCardVisual(item), top, meta, preview);

    const tags = document.createElement("div");
    tags.className = "tag-row";
    item.tags.slice(0, 3).forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "tag";
      chip.textContent = tag;
      tags.append(chip);
    });
    card.append(tags);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const edit = document.createElement("button");
    edit.className = "small-button";
    edit.type = "button";
    edit.textContent = "编辑";
    edit.addEventListener("click", (event) => {
      event.stopPropagation();
      selectPrompt(item.id, "editor");
    });

    const copy = document.createElement("button");
    copy.className = "small-button";
    copy.type = "button";
    copy.textContent = "复制";
    copy.addEventListener("click", (event) => {
      event.stopPropagation();
      copyText(item.content, "提示词已复制");
    });

    actions.append(edit, copy);
    card.append(actions);

    card.addEventListener("click", () => selectPrompt(item.id));
    card.addEventListener("dblclick", () => copyText(item.content, "已通过双击复制提示词"));

    return card;
  }

  function createCardVisual(item) {
    const visual = document.createElement("div");
    visual.className = "card-visual";
    const url = mediaUrl(item);

    if (url) {
      if (isPlayableVideoUrl(url)) {
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", `${item.title}效果视频`);
        video.addEventListener("pointerenter", () => {
          video.play().catch(() => {});
        });
        video.addEventListener("pointerleave", () => {
          video.pause();
        });
        video.addEventListener("error", () => {
          visual.replaceChildren(createVisualPlaceholder(item));
        });
        visual.append(video);
        return visual;
      }

      const image = document.createElement("img");
      image.alt = `${item.title}素材`;
      image.src = url;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        visual.replaceChildren(createVisualPlaceholder(item));
      });
      visual.append(image);
      return visual;
    }

    visual.append(createVisualPlaceholder(item));
    return visual;
  }

  function createVisualPlaceholder(item) {
    const placeholder = document.createElement("div");
    placeholder.className = "visual-placeholder";
    const mark = document.createElement("strong");
    mark.textContent = visualMark(item);
    const label = document.createElement("span");
    label.textContent = `${item.category} · ${item.type}`;
    placeholder.append(mark, label);
    return placeholder;
  }

  function visualMark(item) {
    if (item.type === "视频") return "视";
    if (item.type === "图像" || item.type === "素材") return "图";
    if (item.type === "工作流") return "流";
    return item.category.slice(0, 1) || "AI";
  }

  function createPill(text) {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = text;
    return pill;
  }

  function renderBatchBar() {
    const count = state.selectedIds.size;
    els.batchBar.classList.toggle("show", count > 0);
    els.selectionText.textContent = `已选择 ${count} 条`;
  }

  function renderEditor() {
    const item = getActivePrompt();
    els.editorTitle.textContent = item ? "编辑提示词" : "新增提示词";
    els.saveState.textContent = item ? "已载入" : "等待保存";
    els.promptTitle.value = item?.title || "";
    els.promptCategory.value = item?.category || selectedWritableCategory();
    els.promptType.value = item?.type || "文本";
    els.promptTags.value = item?.tags.join("，") || "";
    els.promptImage.value = item?.imageUrl || "";
    els.promptContent.value = item?.content || "";
    syncEditorImagePreview();
    els.deletePromptBtn.disabled = !item;
  }

  function renderApplyPanel() {
    const item = getActivePrompt();
    if (!item) {
      els.selectedPromptSummary.textContent = "从中间词库选择一个模板开始应用。";
      els.composedPrompt.value = "";
      els.copyOriginalBtn.disabled = true;
      return;
    }

    els.copyOriginalBtn.disabled = false;
    els.selectedPromptSummary.innerHTML = "";
    const strong = document.createElement("strong");
    strong.textContent = item.title;
    const detail = document.createElement("span");
    detail.textContent = `${item.category} · ${item.type} · 双击卡片可快速复制`;
    els.selectedPromptSummary.append(strong, detail);

    const context = cleanText(els.taskContext.value) || "请在这里补充本次任务、受众、素材、限制和交付场景。";
    const tone = cleanText(els.toneSelect.value);
    const format = cleanText(els.formatSelect.value);
    const extra = cleanText(els.extraRules.value) || "无额外约束。";

    els.composedPrompt.value = [
      item.content,
      "",
      "【本次任务】",
      context,
      "",
      "【输出偏好】",
      `语气：${tone}`,
      `格式：${format}`,
      `额外约束：${extra}`,
      "",
      "请在回答前先检查是否缺少必要信息；如缺少，请先提出问题，再给出可执行版本。",
    ].join("\n");
  }

  function getVisiblePrompts() {
    const query = state.search.toLowerCase();
    let prompts = state.prompts.slice();

    if (state.selectedCategory === MEDIA_CATEGORY) {
      prompts = prompts.filter(isMediaPrompt);
    } else if (state.selectedCategory !== ALL_CATEGORY) {
      prompts = prompts.filter((item) => item.category === state.selectedCategory);
    }

    if (state.filter === "favorite") prompts = prompts.filter((item) => item.favorite);
    if (state.filter === "media") prompts = prompts.filter(isMediaPrompt);
    if (state.filter === "workflow") prompts = prompts.filter((item) => item.type === "工作流");

    if (query) {
      prompts = prompts.filter((item) => {
        const haystack = [item.title, item.category, item.type, item.content, item.tags.join(" ")]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    prompts.sort(sortPrompts);
    return prompts;
  }

  function sortPrompts(a, b) {
    if (state.sort === "title") return a.title.localeCompare(b.title, "zh-Hans-CN");
    if (state.sort === "category") return a.category.localeCompare(b.category, "zh-Hans-CN");
    if (state.sort === "favorite") return Number(b.favorite) - Number(a.favorite) || dateSort(a, b);
    return dateSort(a, b);
  }

  function dateSort(a, b) {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  }

  function isMediaPrompt(item) {
    return Boolean(mediaUrl(item)) || item.type === "图像" || item.type === "视频" || item.type === "素材";
  }

  function setCategory(category) {
    state.selectedCategory = category;
    state.selectedIds.clear();
    renderListArea();
  }

  function selectedWritableCategory() {
    if (![ALL_CATEGORY, MEDIA_CATEGORY].includes(state.selectedCategory)) return state.selectedCategory;
    return state.categories[0] || UNCATEGORIZED;
  }

  function addCategory() {
    const name = cleanText(window.prompt("输入新分类名称"));
    if (!name) return;
    addCategoryName(name);
    state.selectedCategory = name;
    persistAndRender();
    showToast(`已新增分类：${name}`);
  }

  function addCategoryName(name) {
    const category = cleanText(name);
    if (!category) return;
    if (!state.categories.includes(category)) {
      state.categories.push(category);
      state.categories.sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
    }
  }

  function renameCategory() {
    if ([ALL_CATEGORY, MEDIA_CATEGORY].includes(state.selectedCategory)) return;
    const oldName = state.selectedCategory;
    const newName = cleanText(window.prompt("输入新的分类名称", oldName));
    if (!newName || newName === oldName) return;
    state.prompts.forEach((item) => {
      if (item.category === oldName) {
        item.category = newName;
        item.updatedAt = new Date().toISOString();
      }
    });
    state.categories = state.categories.filter((item) => item !== oldName);
    addCategoryName(newName);
    state.selectedCategory = newName;
    persistAndRender();
    showToast("分类已重命名");
  }

  function removeCategory() {
    if ([ALL_CATEGORY, MEDIA_CATEGORY].includes(state.selectedCategory)) return;
    const name = state.selectedCategory;
    const ok = window.confirm(`删除分类「${name}」？该分类下的提示词会移动到「${UNCATEGORIZED}」。`);
    if (!ok) return;
    addCategoryName(UNCATEGORIZED);
    state.prompts.forEach((item) => {
      if (item.category === name) {
        item.category = UNCATEGORIZED;
        item.updatedAt = new Date().toISOString();
      }
    });
    state.categories = state.categories.filter((item) => item !== name);
    state.selectedCategory = ALL_CATEGORY;
    persistAndRender();
    showToast("分类已删除，提示词已移动");
  }

  function selectPrompt(id, panelName) {
    state.activePromptId = id;
    if (panelName) activatePanel(panelName);
    renderGrid();
    renderEditor();
    renderApplyPanel();
  }

  function startNewPrompt() {
    state.activePromptId = null;
    activatePanel("editor");
    renderGrid();
    renderEditor();
    els.promptTitle.focus();
  }

  function getActivePrompt() {
    return state.prompts.find((item) => item.id === state.activePromptId) || null;
  }

  function collectFormData() {
    return {
      title: cleanText(els.promptTitle.value),
      category: cleanText(els.promptCategory.value) || UNCATEGORIZED,
      type: cleanText(els.promptType.value) || "文本",
      tags: normalizeTags(els.promptTags.value),
      imageUrl: cleanText(els.promptImage.value),
      content: cleanText(els.promptContent.value),
    };
  }

  function savePromptFromForm() {
    const data = collectFormData();
    if (!data.title || !data.content) {
      showToast("请填写标题和提示词内容");
      return;
    }

    addCategoryName(data.category);
    const existing = getActivePrompt();
    const now = new Date().toISOString();

    if (existing) {
      Object.assign(existing, data, { updatedAt: now });
      showSaveState("已保存");
    } else {
      const item = {
        id: createId("prompt"),
        ...data,
        favorite: false,
        source: "自定义",
        createdAt: now,
        updatedAt: now,
      };
      state.prompts.unshift(item);
      state.activePromptId = item.id;
      showSaveState("已创建");
    }

    persistAndRender();
    showToast("提示词已保存");
  }

  function handleEditorInput() {
    syncEditorImagePreview();
    const existing = getActivePrompt();
    if (!existing) return;

    const data = collectFormData();
    if (!data.title || !data.content) return;
    Object.assign(existing, data, { updatedAt: new Date().toISOString() });
    addCategoryName(data.category);
    persist();
    showSaveState("已实时保存");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      renderCategoryOptions();
      renderCounts();
      renderCategories();
      renderGrid();
      renderApplyPanel();
    }, 220);
  }

  function syncEditorImagePreview() {
    const url = cleanText(els.promptImage.value);
    els.imagePreview.hidden = !url;
    els.previewImage.hidden = true;
    els.previewVideo.hidden = true;
    els.previewImage.removeAttribute("src");
    els.previewVideo.removeAttribute("src");
    if (!url) return;

    if (isPlayableVideoUrl(url)) {
      els.previewVideo.src = url;
      els.previewVideo.hidden = false;
      els.previewCaption.textContent = url.startsWith("data:video") ? "本地视频素材" : "网络视频素材";
      return;
    }

    els.previewImage.src = url;
    els.previewImage.hidden = false;
    els.previewCaption.textContent = url.startsWith("data:image") ? "本地图片素材" : "网络图片素材";
  }

  function showSaveState(text) {
    els.saveState.textContent = text;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      els.saveState.textContent = state.activePromptId ? "本地保存" : "等待保存";
    }, 1400);
  }

  function deleteActivePrompt() {
    const item = getActivePrompt();
    if (!item) return;
    const ok = window.confirm(`删除「${item.title}」？`);
    if (!ok) return;
    state.prompts = state.prompts.filter((promptItem) => promptItem.id !== item.id);
    state.selectedIds.delete(item.id);
    state.activePromptId = state.prompts[0]?.id || null;
    persistAndRender();
    showToast("提示词已删除");
  }

  function deleteSelectedPrompts() {
    const count = state.selectedIds.size;
    if (!count) return;
    const ok = window.confirm(`批量删除 ${count} 条提示词？`);
    if (!ok) return;
    state.prompts = state.prompts.filter((item) => !state.selectedIds.has(item.id));
    if (state.activePromptId && state.selectedIds.has(state.activePromptId)) {
      state.activePromptId = state.prompts[0]?.id || null;
    }
    state.selectedIds.clear();
    persistAndRender();
    showToast("已完成批量删除");
  }

  function activatePanel(name) {
    openDrawer();
    document.querySelectorAll(".panel-tabs [data-panel]").forEach((button) => {
      button.classList.toggle("active", button.dataset.panel === name);
    });
    document.querySelectorAll(".panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `${name}Panel`);
    });
  }

  function openDrawer() {
    els.toolDrawer.classList.add("open");
    els.toolDrawer.setAttribute("aria-hidden", "false");
    els.drawerBackdrop.hidden = false;
  }

  function closeDrawer() {
    els.toolDrawer.classList.remove("open");
    els.toolDrawer.setAttribute("aria-hidden", "true");
    els.drawerBackdrop.hidden = true;
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
    persist();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    els.themeToggle.textContent = state.theme === "dark" ? "☀" : "☾";
  }

  function exportMasterFile() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: "AI词库管理器",
      categories: state.categories,
      prompts: state.prompts,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AI词库母版-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("母版文件已导出");
  }

  async function handleFileInput(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    let added = 0;

    for (const file of files) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const imageUrl = await readAsDataUrl(file);
        const isVideo = file.type.startsWith("video/");
        addImportedPrompt({
          title: file.name.replace(/\.[^.]+$/, ""),
          category: "素材管理",
          type: isVideo ? "视频" : "素材",
          tags: ["本地文件", isVideo ? "视频" : "图片"],
          imageUrl,
          content: `本地${isVideo ? "视频" : "图片"}素材：${file.name}\n用途：可作为生成参考、设计参考或项目素材归档。`,
          source: "文件导入",
        });
        added += 1;
        continue;
      }

      const text = await readAsText(file);
      const result = parseImportText(text, file.name);
      result.categories.forEach(addCategoryName);
      result.prompts.forEach(addImportedPrompt);
      added += result.prompts.length;
    }

    els.fileInput.value = "";
    if (added) {
      persistAndRender();
      showToast(`已导入 ${added} 条内容`);
    } else {
      showToast("没有识别到可导入内容");
    }
  }

  function readAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function parseImportText(text, fileName = "导入文件") {
    const trimmed = cleanText(text);
    if (!trimmed) return { prompts: [], categories: [] };

    const json = tryParseJson(trimmed);
    if (json) return parseJsonImport(json);

    if (fileName.toLowerCase().endsWith(".csv")) {
      return parseCsvImport(trimmed, fileName);
    }

    return parsePlainTextImport(trimmed, fileName);
  }

  function tryParseJson(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function parseJsonImport(json) {
    const rawPrompts = Array.isArray(json) ? json : json.prompts || json.templates || [];
    const categories = Array.isArray(json.categories) ? json.categories.map(cleanText).filter(Boolean) : [];
    return {
      categories,
      prompts: rawPrompts.map(normalizePrompt).filter((item) => item.title && item.content),
    };
  }

  function parseCsvImport(text, fileName) {
    const rows = parseCsvRows(text);
    if (!rows.length) return { prompts: [], categories: [] };
    const headers = rows.shift().map((item) => item.toLowerCase().trim());
    const prompts = rows
      .map((row, index) => {
        const record = {};
        headers.forEach((header, columnIndex) => {
          record[header] = row[columnIndex] || "";
        });
        return normalizePrompt({
          title: record.title || record.name || record["标题"] || `${fileName} ${index + 1}`,
          category: record.category || record["分类"] || selectedWritableCategory(),
          content: record.content || record.prompt || record.text || record["内容"] || row.join("\n"),
          tags: record.tags || record["标签"],
          imageUrl:
            record.videourl ||
            record.mediaurl ||
            record.imageurl ||
            record.video ||
            record.image ||
            record.url ||
            record["视频链接"] ||
            record["素材链接"] ||
            record["图片链接"],
          type: record.type || record["类型"],
          source: "CSV导入",
        });
      })
      .filter((item) => item.content);

    return { prompts, categories: [] };
  }

  function parseCsvRows(text) {
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
        row.push(cell.trim());
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell.trim());
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell.trim());
    rows.push(row);
    return rows.filter((line) => line.some(Boolean));
  }

  function parsePlainTextImport(text, fileName) {
    const category = cleanText(els.pasteCategory.value) || selectedWritableCategory();
    const chunks = splitPromptChunks(text);
    const prompts = chunks.map((chunk, index) => {
      const lines = chunk.split(/\n+/).map(cleanText).filter(Boolean);
      const possibleTitle = lines[0] || `${fileName} ${index + 1}`;
      const title = possibleTitle.length <= 56 ? possibleTitle : `${fileName.replace(/\.[^.]+$/, "")} ${index + 1}`;
      return normalizePrompt({
        title,
        category,
        type: inferType(category),
        tags: ["粘贴导入"],
        content: chunk,
        source: "文本导入",
      });
    });
    return { prompts, categories: [category] };
  }

  function splitPromptChunks(text) {
    if (/\n\s*---+\s*\n/.test(text)) {
      return text.split(/\n\s*---+\s*\n/).map(cleanText).filter(Boolean);
    }
    const chunks = text.split(/\n{2,}/).map(cleanText).filter(Boolean);
    const substantialChunks = chunks.filter((chunk) => chunk.length > 30);
    return substantialChunks.length > 1 ? substantialChunks : [text];
  }

  function addImportedPrompt(raw) {
    const item = normalizePrompt({
      ...raw,
      id: createId("import"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    addCategoryName(item.category);
    state.prompts.unshift(item);
    state.activePromptId = item.id;
  }

  function importFromPaste() {
    const text = cleanText(els.pasteBox.value);
    if (!text) {
      showToast("请先粘贴提示词内容");
      return;
    }
    const result = parsePlainTextImport(text, "粘贴内容");
    result.categories.forEach(addCategoryName);
    result.prompts.forEach(addImportedPrompt);
    els.pasteBox.value = "";
    persistAndRender();
    activatePanel("editor");
    showToast(`已从粘贴内容导入 ${result.prompts.length} 条`);
  }

  function addRemoteImage() {
    const url = cleanText(els.remoteImageUrl.value);
    if (!url) {
      showToast("请填写网络图片或视频链接");
      return;
    }
    const isVideo = isPlayableVideoUrl(url);
    const title = cleanText(els.remoteImageTitle.value) || (isVideo ? "网络视频素材" : "网络图片素材");
    addImportedPrompt({
      title,
      category: "素材管理",
      type: isVideo ? "视频" : "素材",
      tags: [isVideo ? "网络视频" : "网络图片", "素材"],
      imageUrl: url,
      content: `网络${isVideo ? "视频" : "图片"}素材链接：${url}\n用途：可作为生成参考、设计参考或项目素材归档。`,
      source: "网络链接",
    });
    els.remoteImageTitle.value = "";
    els.remoteImageUrl.value = "";
    persistAndRender();
    activatePanel("editor");
    showToast(`网络${isVideo ? "视频" : "图片"}已加载为素材`);
  }

  function mediaUrl(item) {
    return cleanText(item?.videoUrl || item?.mediaUrl || item?.imageUrl || "");
  }

  function isPlayableVideoUrl(url) {
    return /^data:video\//i.test(url) || /\.(mp4|webm|mov|m4v|ogv)(?:[?#].*)?$/i.test(url);
  }

  function restoreSeedPrompts() {
    const ok = window.confirm("恢复内置400+精选模板？会保留你的自定义内容，并补回缺失的内置模板。");
    if (!ok) return;
    const existingIds = new Set(state.prompts.map((item) => item.id));
    const seeds = createSeedPrompts();
    let added = 0;
    seeds.forEach((item) => {
      if (!existingIds.has(item.id)) {
        state.prompts.push(item);
        added += 1;
      }
    });
    seedCategories.forEach(addCategoryName);
    state.activePromptId = state.prompts[0]?.id || null;
    persistAndRender();
    showToast(added ? `已补回 ${added} 条内置模板` : "内置模板已经完整");
  }

  async function copyText(text, message) {
    const value = cleanText(text);
    if (!value) {
      showToast("没有可复制的内容");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    showToast(message);
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 2200);
  }
})();
