// The latest posts from blog.arda.tr, fetched at build time by
// scripts/fetch-blog-posts.mjs into the generated src/config/blog.generated.ts
// bridge (re-exported by src/config/blog.ts). Empty when the feed was
// unreachable during the build.

type post = {
  title: string,
  link: string,
  date: string,
  excerpt: string,
}

@module("../config/blog")
external posts: array<post> = "blogPosts"
