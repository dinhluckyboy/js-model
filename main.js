const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Model() {
  // -
  this.open = (option = {}) => {
    // get content from template
    const { templateId, allowBackdropClose = true } = option;
    const template = $(`#${templateId}`);
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

    if (allowBackdropClose) {
      backdrop.onclick = (e) => {
        if (e.target === backdrop) {
          this.close(backdrop);
        }
      };
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.close(backdrop);
      }
    });

    // disable scroll
    document.body.classList.add("no-scroll");

    return backdrop;
  };

  // -
  this.close = (backdrop) => {
    backdrop.classList.remove("show");
    backdrop.ontransitionend = () => {
      backdrop.remove();
    };

    // enable scroll
    document.body.classList.remove("no-scroll");
  };
}

const model1 = new Model();
const model2 = new Model();

$("#btn-1").onclick = () => {
  model1.open({
    templateId: "model-1",
  });
};

$("#btn-2").onclick = () => {
  const modelElement = model2.open({
    templateId: "model-2",
    allowBackdropClose: false,
  });
  const form = modelElement.querySelector("#login-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = {
      mail: $("#mail").value.trim(),
      pass: $("#password").value.trim(),
    };
    console.log(formData);
  };
};
