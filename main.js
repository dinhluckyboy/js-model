const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Model(option = {}) {
  let _scrollBarWidth; // cache scroll bar width
  // get content... from option
  const { templateId, closeMethods = ["button", "overlay", "escape"] } = option;
  const template = $(`#${templateId}`);
  if (!template) {
    console.error("template id none exits");
    return;
  }
  this.allowButtonClose = closeMethods.includes("button");
  this.allowBackdropClose = closeMethods.includes("overlay");
  this.allowEscapeClose = closeMethods.includes("escape");

  // -
  this.open = () => {
    const content = template.content.cloneNode(true);
    // create element
    const backdrop = document.createElement("div");
    backdrop.className = "model-backdrop";

    const container = document.createElement("div");
    container.className = "model-container";

    if (this.allowButtonClose) {
      const btnClose = document.createElement("button");
      btnClose.className = "model-close";
      btnClose.innerHTML = "&times;";
      container.append(btnClose); // append element
      btnClose.onclick = () => {
        this.close(backdrop);
      }; // handel close event
    }

    const modelContent = document.createElement("div");
    modelContent.className = "model-content";

    // append element
    modelContent.append(content);
    container.append(modelContent);
    backdrop.append(container);
    document.body.append(backdrop);

    // show backdrop
    setTimeout(() => {
      backdrop.classList.add("show");
    }, 1);

    // handel close event
    if (this.allowBackdropClose) {
      backdrop.onclick = (e) => {
        if (e.target === backdrop) {
          this.close(backdrop);
        }
      };
    }
    if (this.allowEscapeClose) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close(backdrop);
        }
      });
    }

    // disable scroll
    document.body.classList.add("no-scroll");
    //padding right scroll bar
    document.body.style.paddingRight = getScrollBar() + "px";

    // tinh do rong cua scroll bar
    function getScrollBar() {
      if (_scrollBarWidth !== undefined) return _scrollBarWidth;
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.top = "-999px";
      div.style.width = "100px";
      div.style.height = "100px";
      div.style.overflow = "scroll";
      document.body.appendChild(div);
      _scrollBarWidth = div.offsetWidth - div.clientWidth;
      document.body.removeChild(div);
      return _scrollBarWidth;
    }

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

// create model
const model1 = new Model({
  templateId: "model-1",
});

const model2 = new Model({
  templateId: "model-2",
  closeMethods: ["button", "escape"],
});

$("#btn-1").onclick = () => {
  model1.open();
}; // open model 1

$("#btn-2").onclick = () => {
  const modelElement = model2.open();

  const form = modelElement.querySelector("#login-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = {
      mail: $("#mail").value.trim(),
      pass: $("#password").value.trim(),
    };
    console.log(formData);
  };
}; // open model 2
