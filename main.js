const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Model(option = {}) {
  let _scrollBarWidth; // cache scroll bar width
  // get content... from option
  const {
    templateId,
    closeMethods = ["button", "overlay", "escape"],
    destroyOnClose = true,
    cssClass = [],
    onOpen,
    onClose,
  } = option;
  const template = $(`#${templateId}`);
  if (!template) {
    console.error("template id none exits");
    return;
  }
  this.allowButtonClose = closeMethods.includes("button");
  this.allowBackdropClose = closeMethods.includes("overlay");
  this.allowEscapeClose = closeMethods.includes("escape");

  this._createElement = () => {
    const content = template.content.cloneNode(true);
    // create element
    this._backdrop = document.createElement("div");
    this._backdrop.className = "model-backdrop";

    const container = document.createElement("div");
    container.className = "model-container";

    if (cssClass.length > 0) {
      cssClass.forEach((className) => {
        if (typeof className === "string") {
          container.classList.add(className);
        }
      });
    } // add css class to container

    if (this.allowButtonClose) {
      const btnClose = document.createElement("button");
      btnClose.className = "model-close";
      btnClose.innerHTML = "&times;";
      container.append(btnClose); // append element
      btnClose.onclick = () => {
        this.close();
      }; // handel close event
    }

    const modelContent = document.createElement("div");
    modelContent.className = "model-content";

    // append element
    modelContent.append(content);
    container.append(modelContent);
    this._backdrop.append(container);
    document.body.append(this._backdrop);
  };

  // -
  this.open = () => {
    if (!this._backdrop) {
      this._createElement();
    }

    // show backdrop
    setTimeout(() => {
      this._backdrop.classList.add("show");
    }, 0);

    // handel close event
    if (this.allowBackdropClose) {
      this._backdrop.onclick = (e) => {
        if (e.target === this._backdrop) {
          this.close();
        }
      };
    }
    if (this.allowEscapeClose) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close();
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

    // onOpen
    this._backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "transform") return;
      if (typeof onOpen === "function") {
        onOpen();
      }
    };

    return this._backdrop;
  };

  // -
  this.close = (destroy = destroyOnClose) => {
    this._backdrop.classList.remove("show");

    this._backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "transform") return;

      this._backdrop.ontransitionend = null; // gỡ handel sau khi chạy xong

      if (destroy && this._backdrop) {
        this._backdrop.remove();
        this._backdrop = null;
      }

      // onClose
      if (typeof onClose === "function") {
        onClose();
      }

      // enable scroll
      document.body.classList.remove("no-scroll");
      //remove padding right scroll bar
      document.body.style.paddingRight = "";
    };
  };

  // -
  this.destroy = () => {
    this.close(true);
  };
}

// create model
const model1 = new Model({
  templateId: "model-1",
  destroyOnClose: false,
  cssClass: ["class1"],
  onOpen: () => {
    console.log("model 1 open");
  },
  onClose: () => {
    console.log("model 1 close");
  },
});

const model2 = new Model({
  templateId: "model-2",
  closeMethods: ["button", "escape"],
  cssClass: ["class1", "class2", "class3"],
  onOpen: () => {
    console.log("model 2 open");
  },
  onClose: () => {
    console.log("model 2 close");
  },
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
