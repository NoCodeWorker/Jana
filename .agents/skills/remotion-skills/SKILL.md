---
name: remotion-skills
description: "Adds skills from remotion-dev/skills repository using the skills CLI tool. Facilitates running 'npx -y skills@latest add remotion-dev/skills -g -y'."
---

# remotion-skills Skill

Use this skill to add the specialized skills from the `remotion-dev/skills` repository into your agent environment.

## Usage

To add the skills to your agent environment:

```bash
# Add skills from remotion-dev/skills globally and automatically accept prompt confirmations
npx -y skills@latest add remotion-dev/skills -g -y
```

### Explanation of Flags:
- `-y` (after `npx`): Automatically install `skills` if it's not found on the local cache.
- `add remotion-dev/skills`: Add skills from the specific repository `remotion-dev/skills`.
- `-g`: Add the skill globally.
- `-y` (at the end): Skip confirmation prompts in the `skills` CLI.
