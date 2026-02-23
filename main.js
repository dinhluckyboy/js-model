const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const scrollBarWidth = getScrollBar() + "px";

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
    //padding right scroll bar
    document.body.style.paddingRight = scrollBarWidth;

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
    //remove padding right scroll bar
    document.body.style.paddingRight = "";
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

// tinh do rong cua scroll bar
function getScrollBar() {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "-999px";
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.visibility = "hidden";
  div.style.overflow = "scroll";
  document.body.appendChild(div);
  const scrollBarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollBarWidth;
}
