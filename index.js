window.addEventListener('load', () => {
  const width = 640;
  const height = 480;

  let x = 0;
  let previewOffsetX = 0;
  let y = 0;
  let previewOffsetY = 0;
  let alpha = 0;
  let previewOffsetAlpha = 0;

  function getGroundAndValue(joystickInput) {
    const max = Number(joystickInput.max) || 100;
    const min = Number(joystickInput.min);
    const ground = (max - min) / 2;
    const typeInput = document.querySelector('input[name=typeInput]:checked');
    switch (typeInput.value) {
      case 'linear': {
        const value = joystickInput.valueAsNumber - ground;
        return { ground, value };
      }
      case 'sinusoidal': {
        const ratio = (joystickInput.valueAsNumber - min) / max;
        const value = ~~(Math.sin(ratio * Math.PI * 1.5) * ground);
        return { ground, value };
      }
      case 'cosinusoidal': {
        const ratio = (joystickInput.valueAsNumber - ground) / ground;
        switch (Math.sign(ratio)) {
          case -1: {
            const value = ~~(Math.cos((ratio + 1) * (Math.PI / 2)) * -ground);
            return { ground, value };
          }
          case 0: {
            return { ground, value: 0 };
          }
          case 1: {
            const value = ~~(Math.cos((Math.PI + Math.PI / 2) + (ratio * (Math.PI / 2))) * ground);
            return { ground, value };
          }
        }
      }
      default: {
        alert(`Invalid 'type' value '${typeInput.value}'.`);
      }
    }
  }

  const joystickInputs = document.querySelectorAll('.joystickInput');
  for (const joystickInput of joystickInputs) {
    joystickInput.addEventListener('input', () => {
      const { value } = getGroundAndValue(joystickInput);
      switch (joystickInput.dataset.for) {
        case 'x': {
          previewOffsetX = value;
          render();
          break;
        }
        case 'y': {
          previewOffsetY = value;
          render();
          break;
        }
        case 'alpha': {
          previewOffsetAlpha = value;
          render();
          break;
        }
        default: {
          alert(`Invalid 'for' value '${joystickInput.dataset.for}'.`);
        }
      }
    });

    joystickInput.addEventListener('change', () => {
      const { ground, value } = getGroundAndValue(joystickInput);
      joystickInput.value = ground;
      switch (joystickInput.dataset.for) {
        case 'x': {
          previewOffsetX = 0;
          x += value;
          switch (Math.sign(value)) {
            case -1: {
              toast(`${-value}px to the left`);
              break;
            }
            case 0: {
              break;
            }
            case 1: {
              toast(`${value}px to the right`);
              break;
            }
          }

          render();
          break;
        }
        case 'y': {
          previewOffsetY = 0;
          y += value;
          switch (Math.sign(value)) {
            case -1: {
              toast(`${-value}px up`);
              break;
            }
            case 0: {
              break;
            }
            case 1: {
              toast(`${value}px down`);
              break;
            }
          }

          render();
          break;
        }
        case 'alpha': {
          previewOffsetAlpha = 0;
          alpha += value;
          switch (Math.sign(value)) {
            case -1: {
              toast(`${-value}° counter-clockwise`);
              break;
            }
            case 0: {
              break;
            }
            case 1: {
              toast(`${value}° clockwise`);
              break;
            }
          }

          render();
          break;
        }
        default: {
          alert(`Invalid 'for' value '${joystickInput.dataset.for}'.`);
        }
      }
    });
  }

  function getEffectiveX() {
    return Math.max(-width / 2, Math.min(width / 2, x + previewOffsetX));
  }

  function getEffectiveY() {
    return Math.max(-height / 2, Math.min(height / 2, y + previewOffsetY));
  }

  function getEffectiveAlpha() {
    return Math.max(-180, Math.min(180, alpha + previewOffsetAlpha));
  }

  const ballG = document.getElementById('ballG');
  const xLabel = document.getElementById('xLabel');
  const yLabel = document.getElementById('yLabel');
  const alphaLabel = document.getElementById('alphaLabel');
  function render() {
    ballG.style.translate = `${getEffectiveX()}px ${getEffectiveY()}px`;
    ballG.style.rotate = `${getEffectiveAlpha()}deg`;

    xLabel.textContent = `${getEffectiveX()}px`;
    yLabel.textContent = `${getEffectiveY()}px`;
    alphaLabel.textContent = `${getEffectiveAlpha()}deg`;
  }

  render();

  const toastsDiv = document.getElementById('toastsDiv');
  function toast(message) {
    const toastDiv = document.createElement('div');
    toastDiv.className = 'toastDiv';
    toastDiv.textContent = message;
    toastsDiv.insertAdjacentElement('afterbegin', toastDiv);
    window.setTimeout(() => toastDiv.remove(), 3000);
  }

  toast('Tom');
});
