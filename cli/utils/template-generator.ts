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

    return `---
title: "${title}"
date: ${formattedDate}
category: ${category}
excerpt: "${excerpt}"
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
