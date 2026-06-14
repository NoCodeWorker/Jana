## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Windows Python

This workspace runs on Windows. The `python` and `python3` commands may resolve to the Microsoft Store aliases under `C:\Users\usuario\AppData\Local\Microsoft\WindowsApps\`, which can fail with a session/startup error. Use `py -3` for local Python scripts instead. Verified interpreter: `py -3 --version` returns Python 3.13.7.

## shadcn-init

Initialize shadcn/ui components using:
- **shadcn-init** (`.codex/skills/shadcn/SKILL.md`) - initialize shadcn/ui and add components.
When installing shadcn components or initializing UI, refer to this skill.

## remotion-skills

Add remotion-dev skills using:
- **remotion-skills** (`.codex/skills/remotion-skills/SKILL.md`) - add skills from remotion-dev/skills.
When importing specialized agent skills, refer to this skill.


