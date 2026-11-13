import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { make as Markdown } from "@/components/Markdown.res.mjs";

// Nested marks render as nested elements, and the safety rules hold inside
// them too: elements built from plain data, and only http(s)/mailto links.
describe("chat markdown rendering", () => {
  it("renders a bold link and a link with a bold label", () => {
    const { container } = render(<Markdown text={"**[golem](https://x.y)** and [**label**](https://a.b)"} />);
    const boldLink = container.querySelector("strong > a");
    expect(boldLink).toHaveAttribute("href", "https://x.y");
    expect(boldLink).toHaveTextContent(/^golem$/);
    const linkBold = container.querySelector("a > strong");
    expect(linkBold).toHaveTextContent(/^label$/);
    expect(linkBold!.parentElement).toHaveAttribute("href", "https://a.b");
    expect(container.textContent).not.toContain("*");
  });

  it("keeps unsafe hrefs and markup inert inside nested marks", () => {
    const { container } = render(<Markdown text={"**[x](javascript:alert(1))** [*<img src=x onerror=alert(1)>*](https://a.b)"} />);
    expect(container.querySelector("a[href^='javascript']")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("a > em")).toHaveTextContent("<img src=x onerror=alert(1)>");
  });
});
