# Project2 Domain (Week03 CRUD Part 1)

Collections:

1. books (>=7 fields)
2. authors

books fields (all required):

- title (string, 3-200 chars)
- isbn (string, 10-17 chars, unique pattern)
- authorId (ObjectId ref authors)
- publishedYear (integer, 1450 - current year)
- genres (array of 1-5 strings, each 2-30 chars)
- pages (integer, 1 - 10000)
- language (string, ISO 639-1 code or plain name, 2-30 chars)
- inPrint (boolean)

authors fields (all required):

- firstName (string, 2-60 chars)
- lastName (string, 2-60 chars)
- email (string, valid email)
- country (string 2-60 chars)
- birthDate (string date YYYY-MM-DD)
- website (string optional in week04 for enrichment, omit now)

Validation approach: Joi schemas with custom messages.
Relationships: books.authorId -> authors.\_id.
Indexing: isbn unique index (to add later).
