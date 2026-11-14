import { describe, expect, it } from "vitest";
import * as WorkCard from "@/components/WorkCard.res.mjs";

// Family sites (arda.tr, *.arda.tr) get the referrer; anything else, or
// anything that is not a plain http(s) URL, gets rel="noopener noreferrer".
const relFor = WorkCard.relFor as (href: string) => string | undefined;
const withheld = "noopener noreferrer";

describe("WorkCard relFor", () => {
  it("passes the referrer to arda.tr and its subdomains", () => {
    for (const href of ["https://arda.tr", "https://arda.tr/", "https://lind.arda.tr", "http://local-ai.arda.tr/x?y#z", "https://x.arda.tr:8443/"]) {
      expect(relFor(href), href).toBeUndefined();
    }
  });

  it("withholds it from look-alike hosts", () => {
    for (const href of [
      "https://notarda.tr",
      "https://arda.tr.evil.com",
      "https://arda.tr:123@evil.com", // userinfo, the host is evil.com
      "https://evil.com/?next=.arda.tr",
      "https://github.com/c0ze/king",
    ]) {
      expect(relFor(href), href).toBe(withheld);
    }
  });

  it("withholds it from anything that is not an http(s) URL", () => {
    for (const href of ["ftp://arda.tr/", "javascript:alert(1)//arda.tr", "not a url", ""]) {
      expect(relFor(href), href).toBe(withheld);
    }
  });
});
