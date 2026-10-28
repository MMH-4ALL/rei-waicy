# Rei - WAICY 2026

Rei - A Safe Personal AI Companion for Teens

Live: https://MMH-4ALL.github.io/rei-waicy

THIS IS A PERSONAL PROJECT. I DO NOT SELL OR SHARE ANYTHING.

I USE THIS TO HOST A LINK. THAT IS ALL.

## Pages

- index.html - Home
- story.html - Emotional Story
- problem.html - The Problem
- solution.html - What Rei Is
- architecture.html - How Rei Works
- ethics.html - Ethics and Safety
- impact.html - Impact
- demo.html - Interactive Demo
- waicy.html - WAICY Alignment
- future.html - Future Plans
- about.html - About

## Tech Stack

Pure vanilla HTML, CSS, JavaScript. No frameworks.

## Current prototype

The main page contains a scripted conversation demo. It selects written responses
and checks a small set of keywords; it does not connect to Claude or another AI
service. Chat messages stay in page memory and are cleared on reload. Clinical
effectiveness, crisis detection, secure messaging and legal compliance have not
been evaluated. Architecture and impact sections describe proposed future work.

The global adolescent mental health estimate links to WHO's 2025 fact sheet.
Other unsupported numerical claims were removed; proposed outcomes are marked
as unmeasured.

## Check changes

Use Node.js 22 or newer, then run `npm ci` and `npm test`. These tools are only
needed for development. GitHub Pages still serves the HTML, CSS and JavaScript
directly. Section URLs such as `#demo` support sharing, reload and browser Back.
