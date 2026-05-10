import test from "node:test";
import assert from "node:assert/strict";
import { redactText } from "../src/redact.js";

test("redacts labelled secrets", () => {
  assert.equal(redactText("token=abc123"), "token=[REDACTED]");
  assert.equal(redactText("password: hunter2"), "password: [REDACTED]");
});

test("can leave text unredacted", () => {
  assert.equal(redactText("token=abc123", false), "token=abc123");
});
