name: "Bug Report"
description: "Report a problem or unexpected behavior"
title: "[BUG] <title>"
labels: ["bug", "needs triage"]
body:

- type: checkboxes
  attributes:
  label: "Existing issue check"
  description: "Please confirm you have searched for existing issues"
  options: - label: "I have searched existing issues"
  required: true

- type: textarea
  attributes:
  label: "Description"
  description: "What happened?"
  validations:
  required: true

- type: textarea
  attributes:
  label: "Expected behavior"
  description: "What should have happened?"

- type: textarea
  attributes:
  label: "Steps to reproduce"
  placeholder: | 1. Go to... 2. Click... 3. Run command... 4. See error

- type: textarea
  attributes:
  label: "Logs / Screenshots"
  description: "Add screenshots or logs if helpful"

- type: dropdown
  id: browser
  attributes:
  label: "Affected browser(s)"
  multiple: true
  options: - Firefox - Chrome - Safari - Edge

- type: textarea
  attributes:
  label: "Additional context"
  description: "Anything else to help us understand the issue?"
