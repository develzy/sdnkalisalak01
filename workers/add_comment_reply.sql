-- Migration: Add reply support to comments table
ALTER TABLE comments ADD COLUMN parent_id INTEGER REFERENCES comments(id);
