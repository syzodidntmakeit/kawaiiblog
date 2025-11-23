import slugify from "slugify";

interface PostData {
  title: string;
  date: Date;
  category: string;
  excerpt: string;
}

export function generateTemplate(data: PostData): string {
  const { title, date, category, excerpt } = data;
  // Use local timezone to avoid date shifting issues
  const formattedDate = new Intl.DateTimeFormat("en-CA").format(date); // en-CA uses YYYY-MM-DD

  // Escape double quotes in title and excerpt for YAML
  const escapedTitle = title.replace(/"/g, '\\"');
  const escapedExcerpt = excerpt.replace(/"/g, '\\"');

  return `---
title: "${escapedTitle}"
date: ${formattedDate}
category: ${category}
excerpt: "${escapedExcerpt}"

---

## Introduction

Write your introduction here...

## Section 1

Your content goes here...

## Conclusion

Wrap it up...
`;
}

export function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}
