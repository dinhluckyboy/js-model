const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Model() {
  // -
  this.open = (option = {}) => {
    // get content from template
    const { templateID } = option;
    const template = $(`#${templateID}`);
    if (!template) {
      console.error("template id none exits");
      return;
    }
    const content = template.content.cloneNode(true);

    // create element
    const backdrop = document.createElement("div");
    backdrop.className = "model-backdrop";

    const container = document.createElement("div");
    container.className = "model-container";

    const btnClose = document.createElement("button");
    btnClose.className = "model-close";
    btnClose.innerHTML = "&times;";

    const modelContent = document.createElement("div");
    modelContent.className = "model-content";

    // append element
    modelContent.append(content);
    container.append(btnClose, modelContent);
    backdrop.append(container);
    document.body.append(backdrop);

    // show backdrop
    setTimeout(() => {
      backdrop.classList.add("show");
    }, 1);

    // handel close event
    btnClose.onclick = () => {
      this.close(backdrop);
    };

    backdrop.onclick = (e) => {
      if (e.target === backdrop) {
        this.close(backdrop);
      }
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.close(backdrop);
      }
    });
  };

  // -
  this.close = (backdrop) => {
    backdrop.classList.remove("show");
    backdrop.ontransitionend = () => {
      backdrop.remove();
    };
  };
}

const model1 = new Model();
const model2 = new Model();

$("#btn-1").onclick = () => {
  model1.open({
    templateID: "model-1",
  });
};

$("#btn-2").onclick = () => {
  model2.open({
    templateID: "model-2",
  });
};
