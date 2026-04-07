# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**familytreeapp** is a web application for creating and visualizing family trees. The project is currently in its early stages — the repository contains planning documents but no source code has been written yet.

**README:** "This is a app about building a family tree"
**Remote:** `https://github.com/sweetrush/familytreeapp.git`

## Planned Technology Stack

- **HTML** — UI structure
- **CSS** — Styling
- **JavaScript (vanilla)** — Logic and functionality
- **JSON** — Data storage for family tree mappings (no database planned)

## Planned Architecture

### UI Layout: Two-Column Design

1. **Sidebar** — Form for adding family members with fields:
   - Name
   - Date of Birth
   - Location
   - Father Link (dropdown to select existing father)
   - Mother Link (dropdown to select existing mother) — noted as "Month Link" in spec but context indicates "Mother Link"

2. **Tree Display Area** — Visual family tree with connecting links between members.

### Data Model

Family tree data is stored in a JSON file. Each member should have fields for name, date of birth, location, and references to parents.

## Working Conventions

- Always create a new branch when implementing a new feature; merge to `main` after the user confirms it works.
- Always restart and reload the platform after making changes (it uses ports that are already mapped).
- Always recheck and test all changes made.
