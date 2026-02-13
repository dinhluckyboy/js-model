const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$("#btn-model").onclick = function () {
  $("#model").classList.add("show");
};

$(".model-close").onclick = function () {
  $("#model").classList.remove("show");
};

$("#model").onclick = function (e) {
  if (e.target === $("#model")) {
    $("#model").classList.remove("show");
  }
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    $("#model").classList.remove("show");
    console.log(e);
  }
});
