const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Model.elements = []; // array save model open current

function Model(option = {}) {
  // get content... from option
  const {
    templateId,
    closeMethods = ["button", "overlay", "escape"],
    destroyOnClose = true,
    cssClass = [],
    onOpen,
    onClose,
    footer = false,
  } = option;
  const template = $(`#${templateId}`);
  if (!template) {
    console.error("template id none exits");
    return;
  }
  this._allowButtonClose = closeMethods.includes("button");
  this._allowBackdropClose = closeMethods.includes("overlay");
  this._allowEscapeClose = closeMethods.includes("escape");

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

    if (this._allowButtonClose) {
      const btnClose = this._createButton("&times;", "model-close", this.close);
      container.append(btnClose); // append element
    }

    const modelContent = document.createElement("div");
    modelContent.className = "model-content";

    // append element
    modelContent.append(content);
    container.append(modelContent);
    this._backdrop.append(container);
    document.body.append(this._backdrop);

    // add footer
    if (footer) {
      this._modelFooter = document.createElement("div");
      this._modelFooter.className = "model-footer";
      this._renderFooterContent(); // render footer content
      this._renderButton(); // render button to footer
      container.append(this._modelFooter); // add footer to container
    }
  };

  // -
  this.open = () => {
    Model.elements.push(this); // push model open current

    if (!this._backdrop) {
      this._createElement();
    }

    // show backdrop
    setTimeout(() => {
      this._backdrop.classList.add("show");
    }, 0);

    // handel close event
    if (this._allowBackdropClose) {
      this._backdrop.onclick = (e) => {
        if (e.target === this._backdrop) {
          this.close();
        }
      };
    }

    // handel escape close
    this._handelEscapeClose = (e) => {
      const lastModel = Model.elements[Model.elements.length - 1]; // last model
      if (e.key === "Escape" && this === lastModel) {
        this.close();
      }
    };

    if (this._allowEscapeClose) {
      document.addEventListener("keydown", this._handelEscapeClose);
    }

    // disable scroll
    document.body.classList.add("no-scroll");
    //padding right scroll bar
    document.body.style.paddingRight = this._getScrollBar() + "px";

    // onOpen
    this._onTransitionEnd(onOpen);

    return this._backdrop;
  };

  // tinh do rong cua scroll bar
  this._getScrollBar = () => {
    if (this._scrollBarWidth !== undefined) return this._scrollBarWidth;
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "-999px";
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.overflow = "scroll";
    document.body.appendChild(div);
    this._scrollBarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return this._scrollBarWidth;
  };

  // -
  this.close = (destroy = destroyOnClose) => {
    if (this._allowEscapeClose) {
      document.removeEventListener("keydown", this._handelEscapeClose);
    } // remove event listener

    Model.elements.pop(); // remove element last array

    this._backdrop.classList.remove("show");

    this._onTransitionEnd(() => {
      this._backdrop.ontransitionend = null; // gỡ handel sau khi chạy xong

      if (destroy && this._backdrop) {
        this._backdrop.remove();
        this._backdrop = null;
        this._modelFooter = null;
      }

      // onClose
      if (typeof onClose === "function") {
        onClose();
      }
      if (!Model.elements.length) {
        // enable scroll
        document.body.classList.remove("no-scroll");
        //remove padding right scroll bar
        document.body.style.paddingRight = "";
      } // Model.length = 0 thi show scroll bar
    });
  };

  // -
  this.destroy = () => {
    this.close(true);
  };

  // -
  this._onTransitionEnd = (callback) => {
    this._backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "transform") return;
      if (typeof callback === "function") {
        callback();
      }
    };
  };

  this.setFooterContent = (html) => {
    this._footerContent = html;
    this._renderFooterContent(); // render footer content
  };

  this._footerButton = [];

  this.addFooterButton = (title, className, callback) => {
    const btn = this._createButton(title, className, callback);
    this._footerButton.push(btn);
    this._renderButton(); // render button to footer
  };

  this._createButton = (title, className, callback) => {
    const btn = document.createElement("button");
    btn.className = className;
    btn.innerHTML = title;
    btn.onclick = callback;
    return btn;
  };

  this._renderButton = () => {
    if (this._footerButton.length > 0 && this._modelFooter) {
      this._footerButton.forEach((btn) => {
        this._modelFooter.append(btn);
      });
    }
  }; // render button to footer

  this._renderFooterContent = () => {
    if (this._modelFooter && this._footerContent) {
      this._modelFooter.innerHTML = this._footerContent;
    }
  }; // render footer content
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

const model3 = new Model({
  templateId: "model-3",
  closeMethods: [],
  onOpen: () => {
    console.log("model 3 open");
  },
  onClose: () => {
    console.log("model 3 close");
  },
  footer: true,
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

$("#btn-3").onclick = () => {
  model3.open();
};

model3.addFooterButton("Cancel", "model-btn", (e) => {
  console.log("Cancel button click");
  model3.close();
});

model3.addFooterButton("Agree", "model-btn primary", (e) => {
  console.log("Agree button click");
  model3.close();
});
