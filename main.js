const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/*  <div id="model-2" class="model-backdrop">
      <div class="model-container">
        <button class="model-close">&times;</button>
        <div class="model-content">
          <p>model 2</p>
        </div>
      </div>
    </div>  */

function Model() {
  // opend model
  this.open = (content) => {
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
    modelContent.innerHTML = content;
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

  // close model
  this.close = (backdrop) => {
    backdrop.classList.remove("show");
    backdrop.ontransitionend = () => {
      backdrop.remove();
    };
  };
}

const model1 = new Model();
const model2 = new Model();

$("#model-1").onclick = () => {
  model1.open("<h1>Model 1</h1>");
};

$("#model-2").onclick = () => {
  model2.open("<h1>Model 2</h1>");
};
