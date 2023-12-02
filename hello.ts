// deno-lint-ignore-file no-explicit-any
import { Hono } from "https://deno.land/x/hono@v3.10.4/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v3.10.4/middleware.ts";

const kv = await Deno.openKv();

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

// BACKEND
interface QuizValue {
  questions: any[];
}
app.get("/quizzes", async (ctx) => {
  const entries = kv.list({ prefix: ["quiz"] });
  const names = [];
  for await (const entry of entries) {
    names.push(entry.key[1]);
  }
  return ctx.json({ quizzes: names });
});

app.get("/quiz/:name", async (ctx) => {
  const quizName = ctx.req.param("name");
  const result = await kv.get(["quiz", quizName]);
  if (!result.value) {
    ctx.status(404);
    return ctx.text(`Quiz ${quizName} does not exist`);
  }
  ctx.status(200);
  return ctx.json(result.value);
});

app.post("quiz/:name", async (ctx) => {
  const data = await ctx.req.json();
  const question = data["question"];
  const answer = data["answer"];
  const quizName = ctx.req.param("name");

  const result = await kv.get<QuizValue>(["quiz", quizName]);

  const value = result.value;
  value?.questions.push({ question, answer });

  await kv.set(["quiz", quizName], value);

  return ctx.text("Success");
});

// creates an empty quiz
app.post("/quiz", async (ctx) => {
  const data = await ctx.req.json();
  const quizName = data["quiz_name"];

  if (!quizName) {
    ctx.status(400);
    return ctx.text("Quiz Name cannot be blank");
  }
  const result = await kv.get(["quiz", quizName]);

  if (result.value !== null) {
    ctx.status(400);
    return ctx.text("Quiz already exists");
  }
  await kv.set(["quiz", quizName], { questions: [] });
  ctx.status(200);
  return ctx.text(`Successfully created quiz ${quizName}`);
});

Deno.serve(app.fetch);
