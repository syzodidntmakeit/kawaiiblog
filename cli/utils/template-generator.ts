import slugify from 'slugify';

interface PostData {
    title: string;
    date: Date;
    category: string;
    excerpt: string;
    tags: string[];
}

export function generateTemplate(data: PostData): string {
    const { title, date, category, excerpt, tags } = data;
    const formattedDate = date.toISOString().split('T')[0];
    const tagsString = JSON.stringify(tags);

    // Escape double quotes in title and excerpt for YAML
    const escapedTitle = title.replace(/"/g, '\\"');
    const escapedExcerpt = excerpt.replace(/"/g, '\\"');

    return `---
title: "${escapedTitle}"
date: ${formattedDate}
category: ${category}
excerpt: "${escapedExcerpt}"
tags: ${tagsString}
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
