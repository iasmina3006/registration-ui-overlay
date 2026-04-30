(function () {
  'use strict';

  var MAX_PASSWORD_LENGTH = 16;
  var MIN_PASSWORD_LENGTH = 8;

  var strengthLabels = [
    '–',
    'Schwach',
    'Schwach',
    'Mittel',
    'Gut',
    'Sehr gut'
  ];

  var elements = {
    password: document.getElementById('password'),
    repeatedPassword: document.getElementById('password-repeat'),
    counter: document.getElementById('password-counter'),
    summary: document.getElementById('password-summary'),
    repeatFeedback: document.getElementById('repeat-feedback'),
    strengthBar: document.getElementById('strength-bar'),
    strengthText: document.getElementById('strength-text'),
    rules: document.querySelectorAll('[data-rule]'),
    toggleButtons: document.querySelectorAll('.password-toggle')
  };

  var rules = {
    length: function (password) {
      return password.length >= MIN_PASSWORD_LENGTH &&
        password.length <= MAX_PASSWORD_LENGTH;
    },
    lower: function (password) {
      return /[a-zäöüß]/.test(password);
    },
    upper: function (password) {
      return /[A-ZÄÖÜ]/.test(password);
    },
    digit: function (password) {
      return /[0-9]/.test(password);
    },
    special: function (password) {
      return /[^A-Za-zÄÖÜäöüß0-9]/.test(password);
    }
  };

  function initialize() {
    if (!hasRequiredElements()) {
      return;
    }

    elements.password.addEventListener('input', updatePasswordState);
    elements.repeatedPassword.addEventListener('input', updateRepeatFeedback);

    Array.prototype.forEach.call(elements.toggleButtons, function (button) {
      button.addEventListener('click', function () {
        togglePasswordVisibility(button);
      });
    });

    updatePasswordState();
  }

  function hasRequiredElements() {
    return elements.password &&
      elements.repeatedPassword &&
      elements.counter &&
      elements.summary &&
      elements.repeatFeedback &&
      elements.strengthBar &&
      elements.strengthText;
  }

  function updatePasswordState() {
    limitInputLength(elements.password);

    var password = elements.password.value;
    var validation = validatePassword(password);
    var fulfilledRules = countFulfilledRules(validation);

    updateCounter(password);
    updateSummary(fulfilledRules);
    updateRules(validation);
    updateStrength(fulfilledRules);
    updateRepeatFeedback();
  }

  function updateRepeatFeedback() {
    limitInputLength(elements.repeatedPassword);

    if (elements.repeatedPassword.value.length === 0) {
      setRepeatFeedback('', '');
      return;
    }

    if (passwordsMatch()) {
      setRepeatFeedback('Passwörter stimmen überein.', 'is-valid');
      return;
    }

    setRepeatFeedback('Passwörter stimmen nicht überein.', 'is-invalid');
  }

  function validatePassword(password) {
    return {
      length: rules.length(password),
      lower: rules.lower(password),
      upper: rules.upper(password),
      digit: rules.digit(password),
      special: rules.special(password)
    };
  }

  function countFulfilledRules(validation) {
    return Object.keys(validation).filter(function (ruleName) {
      return validation[ruleName];
    }).length;
  }

  function updateCounter(password) {
    elements.counter.textContent =
      password.length + ' / ' + MAX_PASSWORD_LENGTH + ' Zeichen';
  }

  function updateSummary(fulfilledRules) {
    elements.summary.textContent =
      'Erfüllt: ' + fulfilledRules + ' von 5 Kriterien';
  }

  function updateRules(validation) {
    Array.prototype.forEach.call(elements.rules, function (ruleElement) {
      var ruleName = ruleElement.getAttribute('data-rule');
      ruleElement.classList.toggle('is-met', validation[ruleName] === true);
    });
  }

  function updateStrength(score) {
    var safeScore = clamp(score, 0, 5);
    var width = safeScore * 20;

    elements.strengthBar.style.width = width + '%';
    elements.strengthBar.className =
      'password-strength-bar strength-' + safeScore;
    elements.strengthText.textContent =
      'Stärke: ' + strengthLabels[safeScore];
  }

  function setRepeatFeedback(message, stateClass) {
    elements.repeatFeedback.textContent = message;
    elements.repeatFeedback.className =
      stateClass ? 'repeat-feedback ' + stateClass : 'repeat-feedback';
  }

  function passwordsMatch() {
    return elements.password.value === elements.repeatedPassword.value;
  }

  function togglePasswordVisibility(button) {
    var input = document.getElementById(button.getAttribute('data-target'));

    if (!input) {
      return;
    }

    var isNowHidden = input.classList.toggle('is-masked');

    button.classList.toggle('is-visible', !isNowHidden);
    button.setAttribute(
      'aria-label',
      isNowHidden ? 'Passwort anzeigen' : 'Passwort verbergen'
    );
  }

  function limitInputLength(input) {
    input.value = input.value.slice(0, MAX_PASSWORD_LENGTH);
  }

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  initialize();
}());