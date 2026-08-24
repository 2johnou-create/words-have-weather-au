# Isolated GitHub setup

This website is an independent Git repository. It has no GitHub remote and no
hosting resource IDs inherited from another Codex project.

## Isolation rules

- Use the new GitHub account only.
- Store GitHub CLI authentication in the ignored `.github-cli/` directory.
- Do not use the machine's default `gh` login.
- Create a new repository rather than reusing or renaming an existing one.
- Keep the repository private until the working title, intellectual-property,
  education, safeguarding and rights reviews are complete.
- Treat source hosting and public website deployment as separate decisions.

## Intended repository

- Suggested name: `words-have-weather-au-site`
- Recommended initial visibility: private
- GitHub owner: pending confirmation of the new account username

All GitHub CLI commands for this project must be run with a project-local
configuration directory, for example:

```bash
GH_CONFIG_DIR="$PWD/.github-cli" gh auth status
```

The first commit and remote creation should happen only after the new account's
username and commit identity are confirmed.
