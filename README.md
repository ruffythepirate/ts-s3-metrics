![Node.js CI](https://github.com/ruffythepirate/ts-s3-metrics/workflows/Node.js%20CI/badge.svg)

# S3 Metrics

AWS has very good support for metrics, and a very powerful way of implementing these metrics with other functionality. The problem is that if you work on a hobby project it's quite expensive to pay 0.3$ per metric. That is why this library instead helps you to read and write metrics to S3, so that you can track developments over time without accumulating a high running cost.

## Features

* The library contains logic to:
  - Read metrics
  - Write metrics
  - Support different merge modes when writing metrics.
  - Support writing metrics in different resolutions.

For full information, please refer to the [API documentation](https://ruffythepirate.github.io/ts-s3-metrics/globals.html) to see available classes and their functions.

## Requirements

* Node and npm
* To build or develop you will benefit from having `npx` https://github.com/npm/npx. This allows invoking of the other global npm requirements in the repository (Typescript, Jest) without having to install them.

## Usage

Not available yet.

## Contributing

Contributions, if they are in line with expanding functionality that can help with layout logic are welcome. Requirements for pull requests are:
* All code is tested
* Naming is consistent with project naming
* Commits are squashed and contain a clear commit message describing what functionality is added.

## License

[MIT](./LICENSE)
