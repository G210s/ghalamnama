(function () {
  "use strict";

  const sections = [...document.querySelectorAll("[data-step]")];
  const progress = document.getElementById("progress");
  const error = document.getElementById("error");
  const back = document.getElementById("back");
  const next = document.getElementById("next");
  const finish = document.getElementById("finish");
  let step = 0;

  function selectedLanguages() {
    return [...document.querySelectorAll("fieldset input:checked")].map((input) => input.value);
  }

  function showStep(index) {
    step = Math.max(0, Math.min(index, sections.length - 1));
    sections.forEach((section, sectionIndex) => { section.hidden = sectionIndex !== step; });
    progress.textContent = `Step ${step + 1} of ${sections.length}`;
    back.hidden = step === 0;
    next.hidden = step === sections.length - 1;
    finish.hidden = step !== sections.length - 1;
    sections[step].querySelector("h2")?.focus?.();
  }

  next.onclick = () => {
    if (step === 0 && selectedLanguages().length === 0) {
      error.hidden = false;
      return;
    }
    error.hidden = true;
    showStep(step + 1);
  };

  back.onclick = () => showStep(step - 1);

  finish.onclick = async () => {
    const enabledLanguages = selectedLanguages();
    const language = enabledLanguages[0];
    const keyboardMode = document.querySelector("input[name='mode']:checked").value;
    finish.disabled = true;
    await browser.storage.local.set({ enabledLanguages, language, keyboardMode, onboardingComplete: true });
    window.close();
  };
})();
