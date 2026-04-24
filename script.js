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
      return /\d/.test(value);
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
    return Object.keys(status).filter(function (key) {
      return status[key];
    }).length;
  }

  function updateRules(status) {
    Array.prototype.forEach.call(ruleItems, function (item) {
      var ruleName = item.getAttribute('data-rule');
      item.classList.toggle('is-met', Boolean(status[ruleName]));
    });
  }

  function updateRepeatFeedback() {
    if (!repeat.value) {
      repeatFeedback.textContent = '';
      return;
    }

    repeatFeedback.textContent = password.value === repeat.value
      ? 'Passwörter stimmen überein.'
      : 'Passwörter stimmen nicht überein.';
  }

  function updatePasswordState() {
    var value = password.value.slice(0, maxLength);

    if (password.value !== value) {
      password.value = value;
    }

    var status = getStatus(value);
    var fulfilled = countMet(status);

    counter.textContent = value.length + ' / ' + maxLength + ' Zeichen';
    summary.textContent = 'Erfüllt: ' + fulfilled + ' von 5 Kriterien';

    updateRules(status);
    updateRepeatFeedback();
  }

  function toggleInputVisibility(button) {
    var input = document.getElementById(button.getAttribute('data-target'));
    var isHidden = input.classList.toggle('masked');

    button.textContent = isHidden ? 'Anzeigen' : 'Verbergen';
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