export const GENERIC_VIEW = `{{#*inline "greetingPartial"}}
<h3>{{ text }}</h3>
{{/inline}}

{{#*inline "linePartial"}}
<p class='line'>{{ text }}</p>
{{/inline}}

{{#*inline "actionPartial"}}
<a class='action' href={{link}}>{{ text }}</a>
{{/inline}}

<!DOCTYPE html>
<html lang="en">

<head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <style>
    html {
      font-family: 'Roboto', sans-serif;
    }

    .line {
      color: #666;
    }

    .action {
      font-size: 14px;
      font-weight: normal;
      color: #ffffff;
      text-decoration: none;
      background-color: #5d9cec;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      display: inline-block;
      padding: 8px 12px;
    }
  </style>
</head>

<body>
  {{#each genericFields}}
  {{#if line}}
  {{> linePartial text = line }}
  {{else if greeting}}
  {{> greetingPartial text = greeting }}
  {{else if action }}
  {{#with action}}
  {{> actionPartial text = text link = link }}
  {{/with}}
  {{/if}}
  {{/each}}
</body>`;