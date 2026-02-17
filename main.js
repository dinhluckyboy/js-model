const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let currentModel = null;

$$("[data-model]").forEach((btn) => {
  btn.onclick = () => {
    const model = btn.dataset.model;
    $(model).classList.add("show");
    currentModel = $(model);
  };
});

$$(".model-close").forEach((btn) => {
  btn.onclick = () => {
    const model = btn.closest(".model-backdrop");
    model.classList.remove("show");
    currentModel = null;
  };
});

$$(".model-backdrop").forEach((model) => {
  model.onclick = (e) => {
    if (e.target === model) {
      model.classList.remove("show");
      currentModel = null;
    }
  };
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && currentModel) {
    currentModel.classList.remove("show");
  }
});
