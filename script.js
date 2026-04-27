const scenes = [
  { id: "scene-opening", label: "卷轴初启" },
  { id: "scene-role", label: "选择角色" },
  { id: "scene-story1", label: "剧情引入" },
  { id: "scene-shop", label: "采购种子" },
  { id: "scene-seed-show", label: "展示种子" },
  { id: "scene-soak", label: "浸种准备" },
  { id: "scene-wood", label: "选择木材" },
  { id: "scene-saw", label: "锯开木头" },
  { id: "scene-assemble", label: "拼装曲辕犁" },
  { id: "scene-finish", label: "成果展示" },
  { id: "scene-ending", label: "章节收尾" },
];

const appState = {
  currentScene: 1,
  selectedRole: 0,
  seeds: 1,
  quizPassed: false,
  soakDone: false,
  soaking: false,
  woodChoice: "",
  sawProgress: 0,
  sawLastX: 0,
  sawDragging: false,
  assemblePlaced: new Set(),
  selectedPart: "",
};

const roleData = [
  { name: "书生", image: "./extracted_assets/pack_1/item/038_IMG_9245.png", text: "懂农时，也懂故事，最适合替大家翻开这幅画卷。" },
  { name: "慈长者", image: "./extracted_assets/pack_1/item/039_IMG_9244.png", text: "稳稳当当，像经验丰富的乡里长辈，总能给你一句关键提醒。" },
  { name: "行脚客", image: "./extracted_assets/pack_1/item/040_IMG_9246.png", text: "挑着担子走南闯北，最知道哪里能寻到好材料。" },
  { name: "卖花娘", image: "./extracted_assets/pack_1/item/041_IMG_9247.png", text: "手脚麻利，眼神也好，选种子和挑木头都很有一套。" },
  { name: "采花女", image: "./extracted_assets/pack_1/item/042_IMG_9243.png", text: "心细又温柔，做起准备工作来总能把每一步都安排妥帖。" },
  { name: "田间少年", image: "./extracted_assets/pack_1/item/043_IMG_9242.png", text: "跑得快，胆子也大，最适合替大家去试试新的办法。" },
  { name: "小掌事", image: "./extracted_assets/pack_1/item/044_IMG_9241.png", text: "做事利落，说选谁就选谁，进了田里就是可靠搭子。" },
  { name: "背篓女", image: "./extracted_assets/pack_1/item/047_IMG_9275.png", text: "最擅长搬运和收纳，浸种和备料的事交给她准没错。" },
  { name: "团圆丫头", image: "./extracted_assets/pack_1/item/048_IMG_9248.png", text: "总把热闹和好运气带在身边，适合和大家一起把春耕做成喜事。" },
];

const partData = [
  { id: "beam", image: "./extracted_assets/pack_1/item/014_9.png" },
  { id: "curve", image: "./extracted_assets/pack_1/item/015_8.png" },
  { id: "hook", image: "./extracted_assets/pack_1/item/016_3.png" },
  { id: "post", image: "./extracted_assets/pack_1/item/018_6.png" },
  { id: "share", image: "./extracted_assets/pack_1/item/019_7.png" },
  { id: "base", image: "./extracted_assets/pack_1/item/020_5.png" },
  { id: "peg", image: "./extracted_assets/pack_1/item/021_4.png" },
];

const sceneNodes = scenes.map((scene) => document.getElementById(scene.id));
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");

const roleGrid = document.getElementById("roleGrid");
const rolePreviewImage = document.getElementById("rolePreviewImage");
const rolePreviewName = document.getElementById("rolePreviewName");
const rolePreviewText = document.getElementById("rolePreviewText");

const seedCount = document.getElementById("seedCount");
const quizModal = document.getElementById("quizModal");
const quizFeedback = document.getElementById("quizFeedback");
const toSeedPageBtn = document.getElementById("toSeedPageBtn");
const quizOptions = Array.from(document.querySelectorAll(".quiz-option"));

const basket = document.getElementById("basket");
const soakProgressFill = document.getElementById("soakProgressFill");
const soakStatus = document.getElementById("soakStatus");
const startSoakBtn = document.getElementById("startSoakBtn");

const woodFeedback = document.getElementById("woodFeedback");
const toSawBtn = document.getElementById("toSawBtn");
const toAssembleBtn = document.getElementById("toAssembleBtn");
const woodModal = document.getElementById("woodModal");
const woodModalStartBtn = document.getElementById("woodModalStartBtn");
const woodModalCloseBtn = document.getElementById("woodModalCloseBtn");

const sawTool = document.getElementById("sawTool");
const sawdust = document.getElementById("sawdust");
const sawProgressFill = document.getElementById("sawProgressFill");
const sawStatus = document.getElementById("sawStatus");

const partsTray = document.getElementById("partsTray");
const assembleBoard = document.getElementById("assembleBoard");
const assembleProgressFill = document.getElementById("assembleProgressFill");
const assembleStatus = document.getElementById("assembleStatus");
const assembleHint = document.getElementById("assembleHint");
const toFinishBtn = document.getElementById("toFinishBtn");
const finishAudio = document.getElementById("finishAudio");

function stopFinishAudio() {
  if (!finishAudio) return;
  finishAudio.pause();
  finishAudio.currentTime = 0;
}

async function playFinishAudio() {
  if (!finishAudio) return;
  finishAudio.pause();
  finishAudio.currentTime = 0;
  try {
    await finishAudio.play();
  } catch (error) {
  }
}

function setScene(index) {
  const previousScene = appState.currentScene;
  appState.currentScene = index;
  sceneNodes.forEach((node, i) => node.classList.toggle("scene-active", i === index));
  progressFill.style.width = `${((index + 1) / scenes.length) * 100}%`;
  progressLabel.textContent = scenes[index].label;
  if (index === 9 && previousScene !== 9) {
    playFinishAudio();
  } else if (previousScene === 9 && index !== 9) {
    stopFinishAudio();
  }
}

function renderRoleOptions() {
  roleGrid.innerHTML = "";
  roleData.forEach((role, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "role-card";
    if (index === appState.selectedRole) button.classList.add("active");
    button.innerHTML = `<img src="${role.image}" alt="${role.name}">`;
    button.addEventListener("click", () => {
      appState.selectedRole = index;
      rolePreviewImage.src = role.image;
      rolePreviewImage.alt = role.name;
      rolePreviewName.textContent = role.name;
      rolePreviewText.textContent = role.text;
      renderRoleOptions();
    });
    roleGrid.appendChild(button);
  });
}

function renderSeeds() {
  seedCount.textContent = String(appState.seeds);
  toSeedPageBtn.disabled = !appState.quizPassed;
}

function openQuiz(show) {
  quizModal.classList.toggle("hidden", !show);
  quizModal.setAttribute("aria-hidden", show ? "false" : "true");
  if (show) quizFeedback.textContent = "";
}

function openWoodModal(show) {
  woodModal.classList.toggle("hidden", !show);
  woodModal.setAttribute("aria-hidden", show ? "false" : "true");
}

function markSoakDone() {
  appState.soakDone = true;
  appState.soaking = false;
  soakProgressFill.style.width = "100%";
  soakStatus.textContent = "浸种完成，种子已经吸饱水分，马上进入下一页。";
  document.querySelector("#riverZone .zone-ring").classList.add("done");
  document.querySelector("#riverZone .zone-ring").textContent = "浸种完成";
  window.setTimeout(() => setScene(6), 650);
}

function renderSawProgress() {
  sawProgressFill.style.width = `${Math.min(appState.sawProgress, 100)}%`;
  if (appState.sawProgress >= 100) {
    sawStatus.textContent = "木头已经开好料，可以进入拼装了。";
    toAssembleBtn.disabled = false;
    sawdust.classList.add("active");
  } else {
    const left = Math.max(1, Math.ceil((100 - appState.sawProgress) / 10));
    sawStatus.textContent = `继续来回锯木，再完成 ${left} 次左右就差不多了。`;
  }
}

function renderAssembleTray() {
  partsTray.innerHTML = "";
  partData.forEach((part) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "part-card";
    card.dataset.part = part.id;
    if (appState.assemblePlaced.has(part.id)) {
      card.classList.add("placed");
    } else if (appState.selectedPart === part.id) {
      card.classList.add("selected");
    }
    card.innerHTML = `<img src="${part.image}" alt="${part.id}">`;
    card.addEventListener("click", () => {
      if (appState.assemblePlaced.has(part.id)) return;
      appState.selectedPart = appState.selectedPart === part.id ? "" : part.id;
      renderAssembleTray();
      renderAssembleTargets();
      assembleHint.textContent = appState.selectedPart
        ? "已选中一个部件，请点击右侧对应区域放置。"
        : "请先点选一个部件，再点右侧高亮区域放置。";
    });
    partsTray.appendChild(card);
  });
}

function renderAssembleTargets() {
  assembleBoard.querySelectorAll(".drop-slot").forEach((slot) => {
    const partId = slot.dataset.part || "";
    const filled = appState.assemblePlaced.has(partId);
    slot.classList.toggle("filled", filled);
    slot.classList.toggle("targetable", Boolean(appState.selectedPart) && appState.selectedPart === partId && !filled);
  });
}

function renderAssembleProgress() {
  const total = partData.length;
  const count = appState.assemblePlaced.size;
  assembleProgressFill.style.width = `${(count / total) * 100}%`;
  assembleStatus.textContent = count === total
    ? "曲辕犁已经拼好，可以翻到成果页了。"
    : `还差 ${total - count} 个部件，把它们都拼回去。`;
  if (count === total) {
    assembleHint.textContent = "所有部件都归位了，可以进入成果展示。";
  }
  toFinishBtn.disabled = count !== total;
}

function resetFlow() {
  stopFinishAudio();
  appState.selectedRole = 0;
  appState.seeds = 1;
  appState.quizPassed = false;
  appState.soakDone = false;
  appState.soaking = false;
  appState.woodChoice = "";
  appState.sawProgress = 0;
  appState.sawLastX = 0;
  appState.sawDragging = false;
  appState.assemblePlaced = new Set();
  appState.selectedPart = "";

  rolePreviewImage.src = roleData[0].image;
  rolePreviewImage.alt = roleData[0].name;
  rolePreviewName.textContent = roleData[0].name;
  rolePreviewText.textContent = roleData[0].text;
  renderRoleOptions();
  renderSeeds();
  quizFeedback.textContent = "";
  openQuiz(false);
  openWoodModal(false);

  soakProgressFill.style.width = "0%";
  soakStatus.textContent = "竹筐已经就位，点击开始浸泡。";
  document.querySelector("#riverZone .zone-ring").classList.remove("done");
  document.querySelector("#riverZone .zone-ring").textContent = "浸泡区域";
  basket.classList.remove("soaking");
  startSoakBtn.disabled = false;
  startSoakBtn.textContent = "浸泡";

  woodFeedback.textContent = "请选择更适合做农具的木材。";
  document.querySelectorAll(".wood-card").forEach((card) => card.classList.remove("selected"));
  toSawBtn.hidden = true;

  sawTool.style.left = "8%";
  sawTool.classList.remove("dragging");
  sawdust.classList.remove("active");
  toAssembleBtn.disabled = true;
  renderSawProgress();

  assembleBoard.querySelectorAll(".placed-piece").forEach((node) => node.remove());
  assembleBoard.querySelectorAll(".drop-slot").forEach((node) => node.classList.remove("filled"));
  assembleHint.textContent = "请先点选一个部件，再点右侧高亮区域放置。";
  renderAssembleTray();
  renderAssembleTargets();
  renderAssembleProgress();

  setScene(1);
}

document.getElementById("openStoryBtn").addEventListener("click", () => setScene(1));
document.getElementById("confirmRoleBtn").addEventListener("click", () => setScene(2));
document.getElementById("toShopBtn").addEventListener("click", () => setScene(3));
document.getElementById("quizBtn").addEventListener("click", () => openQuiz(true));
document.getElementById("closeQuizBtn").addEventListener("click", () => openQuiz(false));
toSeedPageBtn.addEventListener("click", () => setScene(4));
document.getElementById("toSoakBtn").addEventListener("click", () => setScene(5));
document.getElementById("startSoakBtn").addEventListener("click", () => {
  if (appState.soaking || appState.soakDone) return;
  appState.soaking = true;
  startSoakBtn.disabled = true;
  startSoakBtn.textContent = "浸泡中...";
  basket.classList.add("soaking");
  soakStatus.textContent = "正在浸泡种子，请稍候。";
  soakProgressFill.style.width = "100%";
  window.setTimeout(markSoakDone, 3000);
});

document.querySelectorAll(".wood-card").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".wood-card").forEach((card) => card.classList.remove("selected"));
    button.classList.add("selected");
    appState.woodChoice = button.dataset.wood || "";
    if (appState.woodChoice === "dark") {
      woodFeedback.textContent = "选得对，硬木更耐用，适合承受春耕时的拉力和磨损。";
      toSawBtn.hidden = false;
      openWoodModal(true);
    } else {
      woodFeedback.textContent = "这根木材太轻，做出来不够稳。试试更结实的那一根。";
      toSawBtn.hidden = true;
      openWoodModal(false);
    }
  });
});

toSawBtn.addEventListener("click", () => setScene(7));
woodModalStartBtn.addEventListener("click", () => {
  openWoodModal(false);
  setScene(7);
});
woodModalCloseBtn.addEventListener("click", () => openWoodModal(false));
toAssembleBtn.addEventListener("click", () => setScene(8));
toFinishBtn.addEventListener("click", () => setScene(9));
document.getElementById("toEndingBtn").addEventListener("click", () => setScene(10));
document.getElementById("restartAllBtn").addEventListener("click", resetFlow);

quizOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (appState.quizPassed) {
      quizFeedback.textContent = "奖励种子已经收下啦，继续去查看吧。";
      return;
    }

    const isCorrect = option.dataset.correct === "true";
    if (isCorrect) {
      appState.quizPassed = true;
      appState.seeds = 2;
      renderSeeds();
      quizFeedback.textContent = "答对了，额外奖励一袋种子，快去收下吧。";
      return;
    }

    quizFeedback.textContent = "这题答错了，再试试看。";
  });
});

assembleBoard.querySelectorAll(".drop-slot").forEach((slot) => {
  slot.addEventListener("click", () => {
    const partId = slot.dataset.part || "";
    if (!appState.selectedPart) {
      assembleHint.textContent = "请先从左边选择一个部件。";
      return;
    }
    if (partId !== appState.selectedPart || appState.assemblePlaced.has(partId)) {
      assembleHint.textContent = "这个区域和当前部件不匹配，换个高亮区域试试。";
      return;
    }
    appState.assemblePlaced.add(partId);
    appState.selectedPart = "";
    slot.classList.add("filled");
    const img = document.createElement("img");
    img.className = `placed-piece part-${partId}`;
    img.src = partData.find((item) => item.id === partId)?.image || "";
    img.alt = partId;
    assembleBoard.appendChild(img);
    renderAssembleTray();
    renderAssembleTargets();
    renderAssembleProgress();
    if (appState.assemblePlaced.size !== partData.length) {
      assembleHint.textContent = "放置成功，再选择下一个部件吧。";
    }
  });
});

function onSawPointerDown(event) {
  if (appState.sawProgress >= 100) return;
  appState.sawDragging = true;
  appState.sawLastX = event.clientX;
  sawTool.classList.add("dragging");
}

function onSawPointerMove(event) {
  if (!appState.sawDragging || appState.sawProgress >= 100) return;
  const stage = document.querySelector(".saw-stage").getBoundingClientRect();
  const toolRect = sawTool.getBoundingClientRect();
  let left = event.clientX - stage.left - toolRect.width / 2;
  left = Math.max(stage.width * 0.04, Math.min(left, stage.width * 0.58));
  sawTool.style.left = `${(left / stage.width) * 100}%`;
  const delta = Math.abs(event.clientX - appState.sawLastX);
  if (delta > 4) {
    appState.sawProgress = Math.min(100, appState.sawProgress + delta * 0.12);
    appState.sawLastX = event.clientX;
    if (appState.sawProgress > 10) sawdust.classList.add("active");
    renderSawProgress();
  }
}

function onSawPointerUp() {
  appState.sawDragging = false;
  sawTool.classList.remove("dragging");
}

sawTool.addEventListener("pointerdown", onSawPointerDown);
window.addEventListener("pointermove", onSawPointerMove);
window.addEventListener("pointerup", onSawPointerUp);

renderRoleOptions();
renderSeeds();
renderAssembleTray();
renderAssembleTargets();
renderAssembleProgress();
soakProgressFill.style.transition = "width 3s linear";
renderSawProgress();
setScene(1);
