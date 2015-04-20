# Pongo

A *not-serious* command line benchmarking tool for NoSQL datastores

This is just an exercise in learning about new NoSQL datastores and understanding the shortcomings of intra-DB benchmarks

## Setup

```
$ git clone https://github.com/cblanc/pongo_benchmark

$ npm link
```

## Example

```
$ pongo -t insert -s mongodb
```

## Current Stores 

- Postgresql
- MongoDB
- Redis

Setting the flag:

```
-s mongodb
```

## Current Test Methods

### Insert

Setting the flag:

```
-t insert
```

## Notes

The following steps have been taken to reduce (as much as possbile) the confounding effects of javascript runtime (like JSON parsing/stringifying) or quirks of the database driver

- Database instructions are buffered as much as possible prior to benchmarking
- Database instructions are sent in series
- Custom connection pooling (single client is instantiated and used in series)

## Notes Absurdities of Intra-DB tests

- Tests are highly subject to DB drivers and libraries built on top. E.g. When implementing MongoDB tests, time for insert was halved by reusing the same client repeatedly.