# Client ID Metadata Documents Web

This repository contains the public-facing website that showcases [OAuth Client ID Metadata Documents](https://datatracker.ietf.org/doc/draft-parecki-oauth-client-id-metadata-document/).

## Overview

This is a Next.js website that contains explainers and examples for CIMD.

## Deployment

This site is deployed on Vercel and automatically updates when changes are pushed to the main branch.

## Local Development

```bash
nvm use
npm install
npm run dev
```

Visit `http://localhost:3000` to see the site.

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable UI components
- `/lib` - Utility functions
- `/public` - Static assets

## Features

- **Documentation**: Explanations and usage guides for clients and authorization servers
- **Debuggers**: Tools to validate your CIMD as a client and (soon) handling as an authorization server
