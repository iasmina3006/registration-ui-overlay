(function () {
  'use strict';

  var maxLength = 16;

  var password = document.getElementById('password');
  var repeat = document.getElementById('password-repeat');
  var counter = document.getElementById('password-counter');
  var summary = document.getElementById('password-summary');
  var repeatFeedback = document.getElementById('repeat-feedback');
  var ruleItems = document.querySelectorAll('[data-rule]');
  var toggleButtons = document.querySelectorAll('.toggle-password');
  var strengthBar = document.getElementById('strength-bar');
  var strengthText = document.getElementById('strength-text');

  var checks = {
    length: function (value) {
      return value.length >= 8 && value.length <= maxLength;
    },
    lower: function (value) {
      return /[a-zäöüß]/.test(value);
    },
    upper: function (value) {
      return /[A-ZÄÖÜ]/.test(value);
    },
    digit: function (value) {
      return /[0-9]/.test(value);
    },
    special: function (value) {
      return /[^A-Za-zÄÖÜäöüß0-9]/.test(value);
    }
  };

  function getStatus(value) {
    return {
      length: checks.length(value),
      lower: checks.lower(value),
      upper: checks.upper(value),
      digit: checks.digit(value),
      special: checks.special(value)
    };
  }

  function countMet(status) {
    var count = 0;

    Object.keys(status).forEach(function (key) {
      if (status[key]) {
        count += 1;
      }
    });

    return count;
  }

  function updateRules(status) {
    Array.prototype.forEach.call(ruleItems, function (item) {
      var ruleName = item.getAttribute('data-rule');
      item.classList.toggle('is-met', status[ruleName] === true);
    });
  }

  function updateStrength(score) {
    var safeScore = Math.max(0, Math.min(5, score));
    var percent = (safeScore / 5) * 100;

    var labels = [
      '–',
      'Schwach',
      'Schwach',
      'Mittel',
      'Gut',
      'Sehr gut'
    ];

    strengthBar.style.width = percent + '%';
    strengthBar.className = 'password-strength-bar strength-' + safeScore;
    strengthText.textContent = 'Stärke: ' + labels[safeScore];
  }

  function updateRepeatFeedback() {
    repeat.value = repeat.value.slice(0, maxLength);

    if (repeat.value.length === 0) {
      repeatFeedback.textContent = '';
      repeatFeedback.className = 'repeat-feedback';
      return;
    }

    if (password.value === repeat.value) {
      repeatFeedback.textContent = 'Passwörter stimmen überein.';
      repeatFeedback.className = 'repeat-feedback is-valid';
      return;
    }

    repeatFeedback.textContent = 'Passwörter stimmen nicht überein.';
    repeatFeedback.className = 'repeat-feedback is-invalid';
  }

  function updatePasswordState() {
    password.value = password.value.slice(0, maxLength);

    var status = getStatus(password.value);
    var fulfilled = countMet(status);

    counter.textContent = password.value.length + ' / ' + maxLength + ' Zeichen';
    summary.textContent = 'Erfüllt: ' + fulfilled + ' von 5 Kriterien';

    updateRules(status);
    updateStrength(fulfilled);
    updateRepeatFeedback();
  }

  function toggleInputVisibility(button) {
    var input = document.getElementById(button.getAttribute('data-target'));

    if (!input) {
      return;
    }

    var isHidden = input.classList.toggle('masked');

    button.classList.toggle('is-visible', !isHidden);
    button.setAttribute(
      'aria-label',
      isHidden ? 'Passwort anzeigen' : 'Passwort verbergen'
    );
  }

  password.addEventListener('input', updatePasswordState);
  repeat.addEventListener('input', updateRepeatFeedback);

  Array.prototype.forEach.call(toggleButtons, function (button) {
    button.addEventListener('click', function () {
      toggleInputVisibility(button);
    });
  });

  updatePasswordState();
}());