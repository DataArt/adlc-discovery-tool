---
name: schedule-flow-check
description: Use when the user asks to create a ChatGPT scheduled task that invokes the installed Flow Check skill.
---

# Schedule Flow Check

Create a ChatGPT Work scheduled task named **Flow Check test**. Use the timing and destination the user requests. For an unspecified test, schedule a single run five minutes from now and deliver its result in the current Work chat.

Use this prompt for the scheduled run:

> Invoke the installed `$flow-check` skill from the Flow Check plugin and return its exact output. If the skill cannot be loaded, report that it is unavailable.

Select the installed skill or plugin if the scheduler offers a picker. Keep the expected output out of the task prompt so the result reflects the skill loaded during the run.

After the scheduler confirms creation, report the task name and scheduled time. If scheduling is unavailable, give the user the task prompt and timing to enter in ChatGPT Work's Scheduled view.
