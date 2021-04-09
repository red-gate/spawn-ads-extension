# spawn-ads-extension

This extension adds support for quickly connecting to [Spawn](https://spawn.cc) data containers in Azure Data Studio.

Using the command palette, you're able to select a data container and auto-populate the connection dialog to quickly connect to your data containers.

Currently, this only supports **Microsoft SQL Server** and **PostgreSQL** data containers.

## Installing

- Download the latest `VSIX` file from the  [GitHub Releases](https://github.com/red-gate/spawn-ads-extension/releases)
- In Azure Data Studio, open the command palette and select "Install extension from VSIX"
- Select the VSIX you downloaded and install the extension.

## Usage

- In the command palette, search for `Spawn` and select the spawn command
- Select the data container to connect to from the quick pick menu
- This will auto-populate the connection dialog with the connection details from the data container
- Click `connect`

## Release history

Review [CHANGELOG.md](./documentation/CHANGELOG.md) for information on previous releases.

## Missing features?

Is there something you'd like the Spawn ADS extension to do? Please [create an issue](https://github.com/red-gate/spawn-ads-extension/issues/new/choose) and let us know what's missing.